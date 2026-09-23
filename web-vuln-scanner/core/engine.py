from core.crawler import crawl
from core.http_client import HTTPClient, load_config
from core.registry import load_modules


def run_scan(target_url, enabled_modules=None, progress_callback=None):
    """
    Full pipeline: crawl → run every enabled module → aggregate findings.
    """
    config = load_config()
    session = HTTPClient(config)

    crawler_cfg = config.get("crawler", {})
    endpoints = crawl(
        target_url, session,
        max_depth=crawler_cfg.get("max_depth", 3),
        max_pages=crawler_cfg.get("max_pages", 100),
    )

    modules = load_modules(enabled_modules)
    findings = []

    for ep in endpoints:
        for mod in modules:
            try:
                results = mod.scan(ep, session)
                findings.extend(results)
            except Exception as e:
                print(f"[engine] Module '{mod.name}' failed on {ep['url']}: {e}")
        if progress_callback:
            progress_callback(len(findings))

    return findings