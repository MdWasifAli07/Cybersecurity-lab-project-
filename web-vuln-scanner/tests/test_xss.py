import os
import sys
import time
import socket
import threading
import pytest
from werkzeug.serving import make_server

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from targets.app import app as target_app, seed_db
from core.http_client import HTTPClient, load_config
from modules.xss import XSSModule


class ServerThread(threading.Thread):
    def __init__(self, app, port):
        super().__init__(daemon=True)
        self.srv = make_server("127.0.0.1", port, app)

    def run(self):
        self.srv.serve_forever()

    def stop(self):
        self.srv.shutdown()


def free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


@pytest.fixture(scope="module")
def target_server():
    seed_db()
    port = free_port()
    server = ServerThread(target_app, port)
    server.start()
    time.sleep(0.5)
    yield f"http://127.0.0.1:{port}"
    server.stop()


def test_xss_detected_on_search(target_server):
    client = HTTPClient(load_config())
    module = XSSModule()

    endpoint = {
        "url": target_server + "/search",
        "method": "GET",
        "params": {"q": "test"},
        "forms": [],
    }

    findings = module.scan(endpoint, client)
    assert findings, "Reflected XSS should be detected on /search?q="
    assert findings[0].severity == "HIGH"
    assert findings[0].module == "Cross-Site Scripting"