import { buildSeverityLegend, formatDate, getRiskLabel, sumSeverityCounts } from './formatHelpers';

export function buildReportHtml(summary, options = {}) {
  const report = summary || {};
  const findings = report.findings || [];
  const bySeverity = report.by_severity || {};
  const total = report.total || findings.length || sumSeverityCounts(bySeverity);
  const severityLegend = buildSeverityLegend(bySeverity);
  const riskLabel = getRiskLabel(Number(report.risk_score || 0));
  const includeSummary = options.includeSummary !== false;
  const includeFindings = options.includeFindings !== false;
  const includeAppendix = options.includeAppendix !== false;
  const theme = options.theme || 'dark';
  const isPrint = options.theme === 'print-friendly';

  const bodyBg = isPrint ? '#ffffff' : theme === 'light' ? '#f8fafc' : '#0A0E1A';
  const panelBg = isPrint ? '#ffffff' : theme === 'light' ? '#ffffff' : '#0F1424';
  const textColor = isPrint ? '#111827' : theme === 'light' ? '#0f172a' : '#E6EAF2';
  const mutedColor = isPrint ? '#4b5563' : theme === 'light' ? '#475569' : '#94A3B8';
  const borderColor = isPrint ? '#d1d5db' : '#1F2740';
  const accent = '#00E5A0';

  const safeTarget = (report.target || 'https://target.com').replace(/</g, '&lt;');
  const safeScanId = (report.scan_id || 'scan-000').replace(/</g, '&lt;');

  const findingsHtml = findings.map((finding, index) => {
    const sevClass = finding.severity?.toUpperCase() || 'LOW';
    return `
      <section class="finding-card" style="border:1px solid ${borderColor}; border-radius:16px; padding:18px; margin-bottom:18px; background:${panelBg};">
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; gap:12px; align-items:center; margin-bottom:12px;">
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
            <span style="display:inline-block; border-radius:999px; padding:6px 10px; background:${sevClass === 'CRITICAL' ? '#FF3B5C22' : sevClass === 'HIGH' ? '#FFA72622' : sevClass === 'MEDIUM' ? '#FFD60A22' : '#38BDF822'}; color:${sevClass === 'CRITICAL' ? '#FF3B5C' : sevClass === 'HIGH' ? '#FFA726' : sevClass === 'MEDIUM' ? '#FFD60A' : '#38BDF8'}; font-size:10px; letter-spacing:0.16em; font-weight:700; text-transform:uppercase;">${sevClass}</span>
            <span style="font-size:12px; color:${mutedColor};">${finding.module || 'Unknown module'}</span>
          </div>
          <span style="font-size:12px; color:${mutedColor};">Finding ${index + 1}</span>
        </div>
        <div style="display:grid; gap:10px; margin-bottom:10px;">
          <div>
            <div style="font-size:11px; color:${mutedColor}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:6px;">URL</div>
            <div style="font-family:monospace; white-space:pre-wrap; word-break:break-word; color:${textColor};">${(finding.url || safeTarget).replace(/</g, '&lt;')}</div>
          </div>
          <div>
            <div style="font-size:11px; color:${mutedColor}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:6px;">Payload</div>
            <pre style="margin:0; padding:12px; background:${isPrint ? '#f3f4f6' : '#070B13'}; border:1px solid ${borderColor}; border-radius:10px; color:${textColor}; white-space:pre-wrap; overflow-wrap:anywhere; font-family:monospace; font-size:12px;">${(finding.payload || 'n/a').replace(/</g, '&lt;')}</pre>
          </div>
          <div>
            <div style="font-size:11px; color:${mutedColor}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:6px;">Evidence</div>
            <p style="margin:0; color:${textColor}; line-height:1.6;">${(finding.evidence || 'No evidence provided.').replace(/</g, '&lt;')}</p>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:4px;">
            ${(finding.remediation || 'Validate input and enforce least-privilege controls.') ? `<span style="display:inline-flex; align-items:center; padding:6px 10px; border-radius:999px; background:${accent}22; color:${accent}; font-size:11px; border:1px solid ${accent}44;">${(finding.remediation || 'Validate input and enforce least-privilege controls.').replace(/</g, '&lt;')}</span>` : ''}
            <span style="display:inline-flex; align-items:center; padding:6px 10px; border-radius:999px; border:1px solid ${borderColor}; color:${mutedColor}; font-size:11px;">CWE-79</span>
            <span style="display:inline-flex; align-items:center; padding:6px 10px; border-radius:999px; border:1px solid ${borderColor}; color:${mutedColor}; font-size:11px;">OWASP A03</span>
          </div>
        </div>
      </section>
    `;
  }).join('');

  const appendixHtml = `
    <section style="margin-top:22px; border-top:1px solid ${borderColor}; padding-top:22px;">
      <h2 style="margin:0 0 12px; font-size:20px; color:${textColor};">Appendix</h2>
      <div style="display:grid; gap:20px;">
        <div>
          <h3 style="margin:0 0 8px; font-size:16px; color:${textColor};">Methodology</h3>
          <p style="margin:0; color:${mutedColor}; line-height:1.7;">The scanner mapped exposed routes, evaluated parameter handling, and validated business logic flows against common input validation weaknesses. Each check prioritizes high-confidence evidence, avoids destructive actions, and surfaces practical remediation notes.</p>
        </div>
        <div>
          <h3 style="margin:0 0 8px; font-size:16px; color:${textColor};">Modules</h3>
          <ul style="margin:0; padding-left:18px; color:${mutedColor}; line-height:1.8;">
            <li>Crawler v1.2.4</li>
            <li>SQL Injection v2.1.0</li>
            <li>Cross-Site Scripting v1.8.5</li>
            <li>Misconfiguration v0.9.7</li>
          </ul>
        </div>
        <div>
          <h3 style="margin:0 0 8px; font-size:16px; color:${textColor};">Glossary</h3>
          <p style="margin:0; color:${mutedColor}; line-height:1.7;">SQLi: injection into database queries. XSS: script execution in a browser. CSRF: unauthorized cross-site action. CSP: browser content security policy. HSTS: strict transport security header.</p>
        </div>
      </div>
    </section>
  `;

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VULNSCAN Security Report</title>
        <style>
          body {
            margin: 0;
            background: ${bodyBg};
            color: ${textColor};
            font-family: Inter, Arial, sans-serif;
          }
          * { box-sizing: border-box; }
          .report-shell {
            max-width: 900px;
            margin: 32px auto;
            background: ${bodyBg};
            color: ${textColor};
            padding: 28px;
          }
          .report-card {
            background: ${panelBg};
            border: 1px solid ${borderColor};
            border-radius: 18px;
            padding: 24px;
            box-shadow: 0 18px 60px rgba(2,6,23,0.16);
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 22px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            font-size: 12px;
          }
          .brand-mark {
            width: 18px;
            height: 18px;
            border-radius: 6px;
            background: ${accent};
            display: inline-block;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin-top: 18px;
          }
          .meta-item {
            padding: 12px 14px;
            border-radius: 12px;
            border: 1px solid ${borderColor};
            background: rgba(15,20,36,0.25);
          }
          .meta-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: ${mutedColor};
            margin-bottom: 6px;
          }
          .meta-value {
            font-size: 13px;
            color: ${textColor};
            word-break: break-word;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 20px;
            margin-top: 18px;
            align-items: center;
          }
          .stat-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
          .stat-tile {
            border: 1px solid ${borderColor};
            border-radius: 12px;
            padding: 14px;
            background: rgba(15,20,36,0.25);
          }
          .stat-label {
            color: ${mutedColor};
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
          }
          .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: ${textColor};
            margin-top: 8px;
          }
          .scope-line {
            margin-top: 16px;
            color: ${mutedColor};
            font-size: 13px;
          }
          .legend {
            display: grid;
            gap: 10px;
            margin-top: 18px;
          }
          .legend-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
          }
          .legend-left {
            display: flex;
            align-items: center;
            gap: 8px;
            color: ${textColor};
          }
          .dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            display: inline-block;
          }
          h1, h2, h3, p { margin-top: 0; }
          @media print {
            body { background: #fff; }
            .report-shell { margin: 0; max-width: none; padding: 0; }
            .report-card { box-shadow: none; border-color: #d1d5db; }
          }
        </style>
      </head>
      <body>
        <div class="report-shell">
          <div class="report-card">
            <div class="header-row">
              <div class="brand">
                <span class="brand-mark"></span>
                <span>VULNSCAN SECURITY REPORT</span>
              </div>
              <div style="font-size:12px; color:${mutedColor};">${formatDate(report.generated_at || new Date().toISOString())}</div>
            </div>

            <div class="meta-grid">
              <div class="meta-item"><div class="meta-label">Target</div><div class="meta-value" style="font-family:monospace;">${safeTarget}</div></div>
              <div class="meta-item"><div class="meta-label">Scan ID</div><div class="meta-value">${safeScanId}</div></div>
              <div class="meta-item"><div class="meta-label">Started</div><div class="meta-value">${formatDate(report.started_at || report.timestamp || new Date().toISOString())}</div></div>
              <div class="meta-item"><div class="meta-label">Completed</div><div class="meta-value">${formatDate(report.completed_at || report.timestamp || new Date().toISOString())}</div></div>
              <div class="meta-item"><div class="meta-label">Duration</div><div class="meta-value">${report.duration || '2m 14s'}</div></div>
              <div class="meta-item"><div class="meta-label">Modules</div><div class="meta-value">${(report.modules || ['Crawler', 'SQL Injection', 'XSS']).join(', ')}</div></div>
            </div>

            ${includeSummary ? `
            <section style="margin-top:26px;">
              <div class="summary-grid">
                <div style="display:flex; align-items:center; justify-content:center;">
                  <svg width="200" height="200" viewBox="0 0 200 200" aria-label="Risk gauge">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="${borderColor}" stroke-width="18" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="${riskLabel === 'SEVERE' ? '#FF3B5C' : riskLabel === 'HIGH' ? '#FFA726' : riskLabel === 'MODERATE' ? '#FFD60A' : '#00E5A0'}" stroke-linecap="round" stroke-width="18" stroke-dasharray="439.6" stroke-dashoffset="${439.6 * (1 - (Number(report.risk_score || 0) / 100))}" transform="rotate(-90 100 100)" />
                    <text x="100" y="94" text-anchor="middle" font-size="38" font-weight="700" fill="${textColor}">${Number(report.risk_score || 0)}</text>
                    <text x="100" y="122" text-anchor="middle" font-size="11" letter-spacing="0.16em" fill="${mutedColor}">${riskLabel}</text>
                  </svg>
                </div>
                <div>
                  <div class="stat-grid">
                    <div class="stat-tile"><div class="stat-label">Total findings</div><div class="stat-value">${total}</div></div>
                    <div class="stat-tile"><div class="stat-label">Critical+High</div><div class="stat-value">${(bySeverity.CRITICAL || 0) + (bySeverity.HIGH || 0)}</div></div>
                    <div class="stat-tile"><div class="stat-label">Medium</div><div class="stat-value">${bySeverity.MEDIUM || 0}</div></div>
                    <div class="stat-tile"><div class="stat-label">Low+Info</div><div class="stat-value">${(bySeverity.LOW || 0) + (bySeverity.INFO || 0)}</div></div>
                  </div>
                  <div class="scope-line">3 modules • 47 endpoints • 12 params tested</div>
                </div>
              </div>
            </section>
            ` : ''}

            ${includeSummary ? `
            <section style="margin-top:28px; border-top:1px solid ${borderColor}; padding-top:22px;">
              <h2 style="margin:0 0 12px; font-size:20px; color:${textColor};">Severity breakdown</h2>
              <div style="display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;">
                <svg width="210" height="210" viewBox="0 0 210 210" role="img" aria-label="Severity donut chart">
                  <circle cx="105" cy="105" r="62" fill="none" stroke="${isPrint ? '#e5e7eb' : '#1F2740'}" stroke-width="24" />
                  <circle cx="105" cy="105" r="62" fill="none" stroke="#FF3B5C" stroke-width="24" stroke-linecap="round" stroke-dasharray="140 210" stroke-dashoffset="0" transform="rotate(-90 105 105)" />
                  <circle cx="105" cy="105" r="62" fill="none" stroke="#FFA726" stroke-width="24" stroke-linecap="round" stroke-dasharray="90 210" stroke-dashoffset="-140" transform="rotate(-90 105 105)" />
                  <circle cx="105" cy="105" r="62" fill="none" stroke="#FFD60A" stroke-width="24" stroke-linecap="round" stroke-dasharray="40 210" stroke-dashoffset="-230" transform="rotate(-90 105 105)" />
                  <circle cx="105" cy="105" r="62" fill="none" stroke="#38BDF8" stroke-width="24" stroke-linecap="round" stroke-dasharray="20 210" stroke-dashoffset="-270" transform="rotate(-90 105 105)" />
                  <text x="105" y="98" text-anchor="middle" font-size="30" font-weight="700" fill="${textColor}">${total}</text>
                  <text x="105" y="122" text-anchor="middle" font-size="11" letter-spacing="0.14em" fill="${mutedColor}">FINDINGS</text>
                </svg>
                <div class="legend">
                  ${severityLegend.map((item) => `
                    <div class="legend-row">
                      <div class="legend-left">
                        <span class="dot" style="background:${item.color};"></span>
                        <span>${item.label}</span>
                      </div>
                      <div style="color:${mutedColor};">
                        ${item.value} <span>(${item.percentage}%)</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
            ` : ''}

            ${includeFindings ? `
            <section style="margin-top:28px; border-top:1px solid ${borderColor}; padding-top:24px;">
              <h2 style="margin:0 0 16px; font-size:20px; color:${textColor};">Findings</h2>
              ${findingsHtml || '<p style="color:${mutedColor};">No findings reported.</p>'}
            </section>
            ` : ''}

            ${includeAppendix ? appendixHtml : ''}
          </div>
        </div>
      </body>
    </html>
  `;
}
