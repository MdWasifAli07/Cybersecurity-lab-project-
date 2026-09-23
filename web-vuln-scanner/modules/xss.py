from modules.base_module import ScanModule
from core.finding import Finding
from core.payload_loader import load_payloads


class XSSModule(ScanModule):
    name = "Cross-Site Scripting"
    description = "Detects reflected XSS by injecting payloads and checking for unencoded reflection."
    severity = "HIGH"

    def __init__(self):
        self.payloads = load_payloads("xss.txt")

    def scan(self, endpoint, session):
        findings = []
        for param in endpoint.get("params", {}):
            f = self._scan_param(endpoint, session, param)
            if f:
                findings.append(f)
        return findings

    def _scan_param(self, endpoint, session, param):
        for payload in self.payloads:
            params = dict(endpoint["params"])
            params[param] = payload
            r = session.get(endpoint["url"], params=params)
            if r is None:
                continue
            # Reflected verbatim, unencoded
            if payload in r.text:
                context = self._context(r.text, payload)
                return Finding(
                    self.name, r.url, payload,
                    f"Payload reflected unencoded in {context} context (param: {param})",
                    self.severity,
                )
        return None

    @staticmethod
    def _context(body, payload):
        idx = body.find(payload)
        window = body[max(0, idx - 40):idx].lower()
        if "<script" in window:
            return "script"
        if "href=" in window or "src=" in window:
            return "attribute"
        return "HTML"