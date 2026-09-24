import time
from modules.base_module import ScanModule
from core.finding import Finding
from core.payload_loader import load_payloads

# Signatures that indicate the DB engine leaked an error message
SQL_ERROR_SIGNATURES = [
    "you have an error in your sql syntax",
    "unclosed quotation mark",
    "quoted string not properly terminated",
    "unrecognized token",
    "incomplete input",
    "sqlite3.operationalerror",
    "ora-01756",
    "pg::syntaxerror",
    "postgresql",
    "mysql_fetch",
    "syntax error",
    "near \"",
]

TIME_PAYLOADS = [
    ("' OR SLEEP(5)--", 4.5),
    ("'; WAITFOR DELAY '0:0:5'--", 4.5),
]


class SQLiModule(ScanModule):
    name = "SQL Injection"
    description = "Detects error-based and time-based SQL injection."
    severity = "CRITICAL"

    def __init__(self):
        self.error_payloads = load_payloads("sqli.txt")

    def scan(self, endpoint, session):
        findings = []

        # 1. Query string parameters
        for param in endpoint.get("params", {}):
            f = self._scan_param(endpoint, session, param)
            if f:
                findings.append(f)

        # 2. POST form fields
        for form in endpoint.get("forms", []):
            if form.get("method", "get").lower() != "post":
                continue
            for field in form.get("fields", []):
                f = self._scan_form_field(endpoint, session, form, field)
                if f:
                    findings.append(f)

        return findings

    def _scan_param(self, endpoint, session, param):
        # Error-based
        for payload in self.error_payloads:
            params = dict(endpoint["params"])
            params[param] = payload
            r = session.get(endpoint["url"], params=params)
            if r is not None and self._has_sql_error(r.text):
                return Finding(
                    self.name, r.url, payload,
                    f"SQL error signature detected in response (param: {param})",
                    self.severity,
                )

        # Time-based
        for payload, threshold in TIME_PAYLOADS:
            params = dict(endpoint["params"])
            params[param] = payload
            start = time.time()
            r = session.get(endpoint["url"], params=params)
            elapsed = time.time() - start
            if r is not None and elapsed >= threshold:
                return Finding(
                    self.name, r.url, payload,
                    f"Response delayed {elapsed:.2f}s (threshold {threshold}s) on param '{param}'",
                    self.severity,
                )
        return None

    def _scan_form_field(self, endpoint, session, form, field):
        for payload in self.error_payloads:
            data = {f: "test" for f in form.get("fields", [])}
            data[field] = payload
            target = form.get("action") or endpoint["url"]
            r = session.post(target, data=data)
            if r is not None and self._has_sql_error(r.text):
                return Finding(
                    self.name, r.url, payload,
                    f"SQL error signature detected in POST field '{field}'",
                    self.severity,
                )
        return None

    @staticmethod
    def _has_sql_error(body):
        if not body:
            return False
        low = body.lower()
        return any(sig in low for sig in SQL_ERROR_SIGNATURES)