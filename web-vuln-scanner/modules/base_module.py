from abc import ABC, abstractmethod


class ScanModule(ABC):
    """Every vulnerability check must inherit from this."""

    name = "Base Module"
    description = ""
    severity = "INFO"
    enabled = True

    @abstractmethod
    def scan(self, endpoint, session):
        """
        endpoint: dict with keys -> url, method, params, forms
        session:  HTTPClient instance
        returns:  list[Finding]
        """
        pass