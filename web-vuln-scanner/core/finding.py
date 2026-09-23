class Finding:
    """Represents a single vulnerability finding."""

    def __init__(self, module, url, payload, evidence, severity):
        self.module = module
        self.url = url
        self.payload = payload
        self.evidence = evidence
        self.severity = severity  # CRITICAL | HIGH | MEDIUM | LOW | INFO

    def to_dict(self):
        return {
            "module": self.module,
            "url": self.url,
            "payload": self.payload,
            "evidence": self.evidence,
            "severity": self.severity,
        }

    def __repr__(self):
        return f"<Finding {self.severity} {self.module} {self.url}>"