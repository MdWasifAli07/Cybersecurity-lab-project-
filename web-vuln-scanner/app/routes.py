import os
import re
import smtplib
import uuid
from concurrent.futures import ThreadPoolExecutor
from email.message import EmailMessage
from html import escape
from urllib.parse import urlparse
from flask import Blueprint, request, jsonify

from core.engine import run_scan
from reporting.reporter import summarize

bp = Blueprint("main", __name__)

# In-memory store: { scan_id: summary_dict }
SCANS = {}
SCAN_STATUS = {}
SCAN_EXECUTOR = ThreadPoolExecutor(max_workers=2)
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

MODULE_NAMES = {
    "sqli": "SQL Injection",
    "xss": "Cross-Site Scripting",
    "headers": "Server Header Leak",
    "misconfig": "Security Misconfiguration",
}


def _run_api_scan(scan_id, target, modules):
    try:
        SCAN_STATUS[scan_id] = {"status": "running", "progress": 10}
        # The crawler is the pipeline stage; the remaining IDs select scanner modules.
        selected_names = [MODULE_NAMES[module] for module in modules if module in MODULE_NAMES]
        findings = run_scan(target, enabled_modules=selected_names or None)
        SCANS[scan_id] = summarize(target, findings)
        SCAN_STATUS[scan_id] = {"status": "complete", "progress": 100}
    except Exception as exc:
        SCAN_STATUS[scan_id] = {"status": "error", "progress": 0, "error": str(exc)}


def _valid_authorized_target(target, authorized):
    if not target.startswith(("http://", "https://")):
        return False, "Target URL must start with http:// or https://"

    host = urlparse(target).hostname or ""
    is_local = host in ("localhost", "127.0.0.1", "::1")
    if not is_local and not authorized:
        return False, "You must confirm you are authorized to scan this target."
    return True, ""


@bp.route("/api/scan", methods=["POST"])
def api_scan():
    payload = request.get_json(silent=True) or {}
    target = str(payload.get("target", "")).strip()
    modules = payload.get("modules") or []
    authorized = bool(payload.get("authorized"))

    valid, error = _valid_authorized_target(target, authorized)
    if not valid:
        return jsonify({"error": error}), 400
    if not isinstance(modules, list):
        return jsonify({"error": "modules must be an array"}), 400

    scan_id = str(uuid.uuid4())
    SCAN_STATUS[scan_id] = {"status": "queued", "progress": 0}
    SCAN_EXECUTOR.submit(_run_api_scan, scan_id, target, modules)
    return jsonify({"scan_id": scan_id, "target": target, "modules": modules}), 202


@bp.route("/api/scan/<scan_id>/status")
def api_scan_status(scan_id):
    status = SCAN_STATUS.get(scan_id)
    if not status:
        return jsonify({"error": "Scan not found"}), 404
    return jsonify({"scan_id": scan_id, **status})


@bp.route("/api/scan/<scan_id>/results")
def api_scan_results(scan_id):
    summary = SCANS.get(scan_id)
    if not summary:
        status = SCAN_STATUS.get(scan_id)
        if not status:
            return jsonify({"error": "Scan not found"}), 404
        return jsonify({"error": "Scan is not complete", "status": status["status"]}), 409
    return jsonify({"scan_id": scan_id, **summary})


def _email_report_html(summary):
    findings = summary.get("findings", [])
    rows = "".join(
        "<tr>"
        f"<td>{escape(str(finding.get('severity', 'INFO')))}</td>"
        f"<td>{escape(str(finding.get('module', '')))}</td>"
        f"<td>{escape(str(finding.get('url', '')))}</td>"
        f"<td>{escape(str(finding.get('evidence', '')))}</td>"
        "</tr>"
        for finding in findings
    )
    return f"""<!doctype html>
<html><body>
<h1>Web vulnerability scan report</h1>
<p><strong>Target:</strong> {escape(str(summary.get('target', '')))}</p>
<p><strong>Risk score:</strong> {escape(str(summary.get('risk_score', 0)))}/100</p>
<p><strong>Total findings:</strong> {escape(str(summary.get('total', 0)))}</p>
<table border="1" cellpadding="6" cellspacing="0">
<thead><tr><th>Severity</th><th>Module</th><th>URL</th><th>Evidence</th></tr></thead>
<tbody>{rows or '<tr><td colspan="4">No findings detected</td></tr>'}</tbody>
</table>
</body></html>"""


@bp.route("/api/scan/<scan_id>/email", methods=["POST"])
def api_email_report(scan_id):
    summary = SCANS.get(scan_id)
    if not summary:
        return jsonify({"error": "Scan results not found or scan is not complete"}), 404

    payload = request.get_json(silent=True) or {}
    recipient = str(payload.get("email", "")).strip()
    if not EMAIL_PATTERN.fullmatch(recipient):
        return jsonify({"error": "A valid recipient email address is required"}), 400

    smtp_host = os.getenv("SMTP_HOST")
    if not smtp_host:
        return jsonify({
            "error": "Email delivery is not configured. Set SMTP_HOST and SMTP_FROM on the Flask server."
        }), 503

    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("SMTP_FROM", smtp_user or "noreply@localhost")
    message = EmailMessage()
    message["Subject"] = f"Vulnerability scan report: {summary.get('target', 'target')}"
    message["From"] = sender
    message["To"] = recipient
    message.set_content(
        f"Web vulnerability scan report for {summary.get('target', 'target')}. "
        f"Risk score: {summary.get('risk_score', 0)}/100. "
        f"Total findings: {summary.get('total', 0)}."
    )
    message.add_alternative(_email_report_html(summary), subtype="html")

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as smtp:
            if os.getenv("SMTP_USE_TLS", "true").lower() == "true":
                smtp.starttls()
            if smtp_user and smtp_password:
                smtp.login(smtp_user, smtp_password)
            smtp.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        return jsonify({"error": f"Unable to send email: {exc}"}), 502

    return jsonify({"message": "Report email sent", "email": recipient}), 202


