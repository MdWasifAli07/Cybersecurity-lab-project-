import os
import logging
import requests
import yaml

logger = logging.getLogger(__name__)

CONFIG_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "config.yaml")
)


def load_config():
    """Load the YAML config once."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


class HTTPClient:
    """Thin wrapper over requests.Session with sane defaults."""

    def __init__(self, config=None):
        self.config = config or load_config()
        scan_cfg = self.config.get("scan", {})
        self.timeout = scan_cfg.get("timeout", 10)
        self.follow_redirects = scan_cfg.get("follow_redirects", True)

        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": scan_cfg.get("user_agent", "VulnScanner/1.0 (Educational)")
        })

    def get(self, url, params=None, **kwargs):
        try:
            return self.session.get(
                url, params=params, timeout=self.timeout,
                allow_redirects=self.follow_redirects, **kwargs
            )
        except requests.RequestException as e:
            logger.warning("GET %s failed: %s", url, e)
            return None

    def post(self, url, data=None, **kwargs):
        try:
            return self.session.post(
                url, data=data, timeout=self.timeout,
                allow_redirects=self.follow_redirects, **kwargs
            )
        except requests.RequestException as e:
            logger.warning("POST %s failed: %s", url, e)
            return None