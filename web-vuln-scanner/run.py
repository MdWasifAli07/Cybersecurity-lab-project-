import argparse

LEGAL_BANNER = """
============================================================
  Web Vulnerability Scanner — EDUCATIONAL USE ONLY
  Scan only systems you own or have explicit permission to test.
  Unauthorized scanning is illegal.
============================================================
"""


def cli_scan(url):
    from core.engine import run_scan
    from reporting.reporter import summarize

    print(LEGAL_BANNER)
    print(f"Scanning: {url}\n")

    findings = run_scan(url)
    summary = summarize(url, findings)

    order = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]
    for f in sorted(findings, key=lambda x: order.index(x.severity)):
        print(f"[{f.severity}] {f.module}")
        print(f"   URL:      {f.url}")
        print(f"   Payload:  {f.payload}")
        print(f"   Evidence: {f.evidence}\n")

    print("=" * 60)
    print(f"Total: {summary['total']}   Risk score: {summary['risk_score']}/100")
    for sev in order:
        print(f"  {sev:9} : {summary['by_severity'][sev]}")


def main():
    parser = argparse.ArgumentParser(description="Web Vulnerability Scanner")
    parser.add_argument("--cli", action="store_true", help="Run in CLI mode")
    parser.add_argument("--url", type=str, help="Target URL (CLI mode)")
    args = parser.parse_args()

    if args.cli:
        if not args.url:
            parser.error("--cli requires --url")
        cli_scan(args.url)
    else:
        print(LEGAL_BANNER)
        from app import create_app
        app = create_app()
        app.run(host="127.0.0.1", port=5000, debug=False)


if __name__ == "__main__":
    main()