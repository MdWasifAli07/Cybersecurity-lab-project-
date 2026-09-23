import os

PAYLOAD_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "payloads")
)


def load_payloads(filename):
    """Read a payload file — one payload per line. Blank lines and # comments skipped."""
    path = os.path.join(PAYLOAD_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return [
            line.strip()
            for line in f
            if line.strip() and not line.strip().startswith("#")
        ]