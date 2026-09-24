import json

SEVERITY_WEIGHTS = {
    "CRITICAL": 10,
    "HIGH": 7,
    "MEDIUM": 4,
    "LOW": 2,
    "INFO": 1,
}


def summarize(target, findings):
    """Aggregate findings into a summary dict ready for rendering."""
    by_sev = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "INFO": 0}
    score = 0
    for f in findings:
        by_sev[f.severity] = by_sev.get(f.severity, 0) + 1
        score += SEVERITY_WEIGHTS.get(f.severity, 0)

    return {
        "target": target,
        "total": len(findings),
        "by_severity": by_sev,
        "risk_score": min(100, score),
        "findings": [f.to_dict() for f in findings],
    }


def to_json(summary):
    return json.dumps(summary, indent=2)