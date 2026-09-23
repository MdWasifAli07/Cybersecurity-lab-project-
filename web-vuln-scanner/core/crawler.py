from urllib.parse import urljoin, urlparse, parse_qs
from bs4 import BeautifulSoup


def crawl(start_url, http_client, max_depth=3, max_pages=100):
    """
    Breadth-first crawl limited to the same host as start_url.
    Returns a list of endpoint dicts:
        {"url": ..., "method": "GET", "params": {...}, "forms": [...]}
    """
    start_host = urlparse(start_url).netloc
    visited = set()
    endpoints = {}
    queue = [(start_url, 0)]

    while queue and len(visited) < max_pages:
        url, depth = queue.pop(0)
        if url in visited:
            continue
        visited.add(url)

        r = http_client.get(url)
        if r is None:
            continue
        content_type = r.headers.get("Content-Type", "").lower()
        if "html" not in content_type:
            continue

        # Record this endpoint (deduplicated by path, params merged)
        parsed = urlparse(url)
        base_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        query_params = {k: v[0] for k, v in parse_qs(parsed.query).items()}

        if base_url not in endpoints:
            endpoints[base_url] = {
                "url": base_url,
                "method": "GET",
                "params": {},
                "forms": [],
            }
        endpoints[base_url]["params"].update(query_params)

        if depth >= max_depth:
            continue

        soup = BeautifulSoup(r.text, "html.parser")

        # Discover links
        for a in soup.find_all("a", href=True):
            link = urljoin(url, a["href"])
            p = urlparse(link)
            if p.netloc != start_host:
                continue
            if p.scheme not in ("http", "https"):
                continue
            # Drop fragments
            link = link.split("#")[0]
            if link and link not in visited:
                queue.append((link, depth + 1))

        # Discover forms
        for form in soup.find_all("form"):
            action = urljoin(url, form.get("action") or url)
            method = (form.get("method") or "get").lower()
            fields = []
            for inp in form.find_all(["input", "select", "textarea"]):
                name = inp.get("name")
                if name:
                    fields.append(name)
            endpoints[base_url]["forms"].append({
                "action": action,
                "method": method,
                "fields": fields,
            })

    return list(endpoints.values())