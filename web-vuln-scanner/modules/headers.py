from modules.base_module import ScanModule
from core.finding import Finding

class HeadersModule(ScanModule):
    name = "Server Header Leak"
    severity = "LOW"
    def scan(self, endpoint, session):
        r = session.get(endpoint["url"])
        if r and "Server" in r.headers:
            return [Finding(self.name, r.url, "-",
                            f"Server header: {r.headers['Server']}", self.severity)]
        return []