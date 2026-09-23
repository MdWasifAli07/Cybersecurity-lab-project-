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
from core.crawler import crawl


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


def test_crawler_finds_pages(target_server):
    client = HTTPClient(load_config())
    endpoints = crawl(target_server + "/", client, max_depth=2, max_pages=50)
    paths = {ep["url"].replace(target_server, "") for ep in endpoints}
    assert any("/login" in p for p in paths), paths
    assert any("/search" in p for p in paths), paths
    assert any("/admin" in p for p in paths), paths


def test_crawler_extracts_form_fields(target_server):
    client = HTTPClient(load_config())
    endpoints = crawl(target_server + "/", client, max_depth=2, max_pages=50)
    login_eps = [ep for ep in endpoints if ep["url"].endswith("/login")]
    assert login_eps, "login endpoint not discovered"
    forms = login_eps[0]["forms"]
    assert forms, "login form not detected"
    fields = forms[0]["fields"]
    assert "username" in fields and "password" in fields