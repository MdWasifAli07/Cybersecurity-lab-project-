from urllib.parse import urlparse
from modules.base_module import ScanModule
from core.finding import Finding
from core.payload_loader import load_payloads

REQUIRED_HEADERS = [
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Strict-Transport-Security",
]


class MisconfigModule(ScanModule):
    name = "Security Misconfiguration"
    description = "Detects missing security headers and exposed sensitive paths."
    severity = "MEDIUM"

    def __init__(self):
        self.paths = load_payloads("sensitive_paths.txt")
        self._scanned_hosts = set()

    def scan(self, endpoint, session):
        findings = []
        base = endpoint["url"]
        parsed = urlparse(base)
        host = parsed.netloc

        # --- Header audit (every endpoint) ---
        r = session.get(base)
        if r is not None:
            for h in REQUIRED_HEADERS:
                if h not in r.headers:
                    findings.append(Finding(
                        self.name, base, "-",
                        f"Missing security header: {h}",
                        "LOW",
                    ))

        # --- Sensitive path probing (once per host) ---
        if host in self._scanned_hosts:
            return findings
        self._scanned_hosts.add(host)

        root = f"{parsed.scheme}://{host}"
        for path in self.paths:
            url = root + path
            r = session.get(url)
            if r is None:
                continue
            if r.status_code == 200 and len(r.text.strip()) > 0:
                sev = "HIGH" if (".env" in path or ".git" in path) else "MEDIUM"
                findings.append(Finding(
                    self.name, url, "-",
                    f"Sensitive path accessible (HTTP {r.status_code}, {len(r.text)} bytes)",
                    sev,
                ))
        return findings