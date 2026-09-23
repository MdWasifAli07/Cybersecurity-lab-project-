import os
from jinja2 import Environment

REPORT_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "reports")
)

HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Scan Report - {{ summary.target }}</title>
<style>
 body { font-family: sans-serif; margin: 2rem; color: #222; }
 h1 { color: #1f2933; }
 .summary { background: #f4f4f4; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; }
 table { border-collapse: collapse; width: 100%; }
 th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; vertical-align: top; }
 th { background: #eee; }
 code { background: #f1f1f1; padding: 0 4px; border-radius: 3px; }
 .CRITICAL { color: #fff; background: #b00020; padding: 2px 6px; border-radius: 4px; }
 .HIGH { color: #fff; background: #d35400; padding: 2px 6px; border-radius: 4px; }
 .MEDIUM { color: #333; background: #f1c40f; padding: 2px 6px; border-radius: 4px; }
 .LOW { color: #fff; background: #2980b9; padding: 2px 6px; border-radius: 4px; }
 .INFO { color: #333; background: #bdc3c7; padding: 2px 6px; border-radius: 4px; }
</style>
</head>
<body>
<h1>Web Vulnerability Scan Report</h1>
<div class="summary">
 <p><strong>Target:</strong> {{ summary.target }}</p>
 <p><strong>Total findings:</strong> {{ summary.total }}</p>
 <p><strong>Risk score:</strong> {{ summary.risk_score }}/100</p>
 <p><strong>By severity:</strong>
   CRITICAL={{ summary.by_severity.CRITICAL }},
   HIGH={{ summary.by_severity.HIGH }},
   MEDIUM={{ summary.by_severity.MEDIUM }},
   LOW={{ summary.by_severity.LOW }},
   INFO={{ summary.by_severity.INFO }}
 </p>
</div>
{% if summary.findings %}
<table>
 <thead>
  <tr><th>Severity</th><th>Module</th><th>URL</th><th>Payload</th><th>Evidence</th></tr>
 </thead>
 <tbody>
 {% for f in summary.findings %}
  <tr>
   <td><span class="{{ f.severity }}">{{ f.severity }}</span></td>
   <td>{{ f.module }}</td>
   <td><code>{{ f.url }}</code></td>
   <td><code>{{ f.payload }}</code></td>
   <td>{{ f.evidence }}</td>
  </tr>
 {% endfor %}
 </tbody>
</table>
{% else %}
<p>No findings.</p>
{% endif %}
</body>
</html>
"""


def render_html(summary, output_path=None):
    """Render an HTML report from a summary dict. Returns the file path."""
    if output_path is None:
        os.makedirs(REPORT_DIR, exist_ok=True)
        safe = summary["target"].replace("://", "_").replace("/", "_").replace(":", "_")
        output_path = os.path.join(REPORT_DIR, f"scan_{safe}.html")

    env = Environment()
    template = env.from_string(HTML_TEMPLATE)
    html = template.render(summary=summary)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    return output_path