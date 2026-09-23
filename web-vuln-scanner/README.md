# Web Vulnerability Scanner

A modular, educational web vulnerability scanner with a Flask UI.

> ⚠️ **LEGAL NOTICE** — This tool is for **educational and authorized testing only**.
> Never scan systems you do not own or have explicit written permission to test.

## Features
- Crawls a target to discover URLs, query parameters, and forms
- Plugin-based scan modules:
  - SQL Injection (error-based + time-based)
  - Reflected Cross-Site Scripting (XSS)
  - Security Misconfiguration (missing headers, sensitive paths)
- Web UI (Flask) + CLI mode
- HTML and JSON report export
- Ships with a deliberately vulnerable demo target for safe testing

## Architecture
```
UI (Flask) → Engine → Crawler → Modules → Reporter → UI
```

## Installation
```bash
pip install -r requirements.txt
```

## Usage

### Start the vulnerable demo (for testing)
```bash
python targets/app.py
# runs on http://127.0.0.1:5001
```

### Start the scanner UI
```bash
python run.py
# open http://127.0.0.1:5000
```

### Configure report email
The React report page sends email through the Flask API. Configure an SMTP provider
before starting Flask:

PowerShell:
```powershell
$env:SMTP_HOST = "smtp.example.com"
$env:SMTP_PORT = "587"
$env:SMTP_USER = "scanner@example.com"
$env:SMTP_PASSWORD = "your-smtp-password"
$env:SMTP_FROM = "scanner@example.com"
$env:SMTP_USE_TLS = "true"
python run.py
```

`SMTP_PASSWORD` should be an app password when the provider requires one. Without
`SMTP_HOST` and `SMTP_FROM`, the API returns a clear configuration error instead of
claiming that the message was sent.

### CLI mode
```bash
python run.py --cli --url http://127.0.0.1:5001/
```

## Adding a new module
1. Create `modules/your_module.py`
2. Subclass `ScanModule` from `modules/base_module.py`
3. Implement `scan(self, endpoint, session) -> list[Finding]`

The registry auto-discovers it — no engine changes needed.

## Running tests
```bash
pytest tests/ -v
```