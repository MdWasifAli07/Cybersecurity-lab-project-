import { useEffect, useMemo, useState } from 'react';
import { Download, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getScanResults } from '../api/client';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { useScan } from '../context/ScanContext';

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lastTarget } = useScan();
  const [results, setResults] = useState(null);
  const [sortKey, setSortKey] = useState('severity');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getScanResults(id);
        setResults(response.data);
      } catch (error) {
        setResults({
          target: lastTarget,
          total: 0,
          by_severity: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
          risk_score: 0,
          findings: [],
        });
      }
    };

    fetchResults();
  }, [id, lastTarget]);

  const orderedFindings = useMemo(() => {
    if (!results?.findings) return [];
    const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const filtered = filter === 'ALL' ? results.findings : results.findings.filter((f) => f.severity === filter);
    return [...filtered].sort((a, b) => {
      if (sortKey === 'severity') return severityOrder[b.severity] - severityOrder[a.severity];
      return a.url.localeCompare(b.url);
    });
  }, [results, filter, sortKey]);

  if (!results) {
    return <div className="flex min-h-screen items-center justify-center"><span className="text-slate-300">Loading report...</span></div>;
  }

  const severityTotals = Object.entries(results.by_severity || {});
  const maxSeverity = Math.max(...severityTotals.map(([, value]) => value), 1);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id || 'scan'}-results.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHtml = () => {
    const html = `<!doctype html><html><head><title>Vulnscan Report</title><style>body{font-family:Arial,sans-serif;background:#0A0E1A;color:#E6EAF2;padding:40px}h1{color:#00E5A0}table{border-collapse:collapse;width:100%}td,th{padding:10px;border:1px solid #1F2740}code{font-family:monospace}</style></head><body><h1>VULNSCAN report</h1><p>Target: ${results.target}</p><p>Risk score: ${results.risk_score}</p><table><tr><th>Severity</th><th>Module</th><th>URL</th></tr>${(results.findings || []).map((f) => `<tr><td>${f.severity}</td><td>${f.module}</td><td>${f.url}</td></tr>`).join('')}</table></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id || 'scan'}-results.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-bg text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/5 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary">Report</p>
            <p className="mt-2 font-mono text-lg text-slate-200">{results.target}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm" icon={Download} onClick={() => navigate(`/results/${id}/report`, { state: { summary: results } })}>Generate Report</Button>
            <Button variant="secondary" size="sm" icon={Download} onClick={downloadHtml}>Download HTML</Button>
            <Button variant="secondary" size="sm" icon={Download} onClick={downloadJson}>Download JSON</Button>
            <Button variant="primary" size="sm" icon={RefreshCcw} onClick={() => navigate('/scan')}>New Scan</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-slate-400">Total</p>
            <p className="mt-3 text-3xl font-bold text-white">{results.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-400">Risk Score</p>
            <p className="mt-3 text-3xl font-bold text-primary">{results.risk_score}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-400">Critical+High</p>
            <p className="mt-3 text-3xl font-bold text-white">{(results.by_severity?.CRITICAL || 0) + (results.by_severity?.HIGH || 0)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-400">Timestamp</p>
            <p className="mt-3 text-sm font-medium text-slate-200">{new Date().toLocaleString()}</p>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-5">
            <h3 className="mb-5 text-lg font-semibold text-white">Severity distribution</h3>
            <div className="space-y-4">
              {severityTotals.map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-slate-300">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className={`h-full rounded-full ${label === 'CRITICAL' ? 'bg-critical' : label === 'HIGH' ? 'bg-high' : label === 'MEDIUM' ? 'bg-medium' : 'bg-low'}`}
                      style={{ width: `${(value / maxSeverity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Findings</h3>
              <div className="flex flex-wrap gap-2">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-full border px-2.5 py-1 text-xs uppercase tracking-[0.12em] ${filter === item ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 bg-white/5 text-slate-300'}`}
                    aria-label={`Filter ${item}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {orderedFindings.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-950/40 p-6 text-center">
                <div className="mb-4 rounded-full border border-primary/20 bg-primary/10 p-4 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-white">No findings detected</h4>
                <p className="mt-2 max-w-xs text-sm text-slate-300">This target looks clean based on the selected modules and checks.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-950/80 text-slate-300">
                      <tr>
                        <th className="px-4 py-3 font-medium">Severity</th>
                        <th className="px-4 py-3 font-medium">Module</th>
                        <th className="px-4 py-3 font-medium">URL</th>
                        <th className="px-4 py-3 font-medium">Payload</th>
                        <th className="px-4 py-3 font-medium">Evidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderedFindings.map((finding) => (
                        <tr key={finding.id} className="border-t border-white/5 bg-slate-950/30">
                          <td className="px-4 py-3 align-top">
                            <Badge severity={finding.severity}>{finding.severity}</Badge>
                          </td>
                          <td className="px-4 py-3 align-top text-slate-200">{finding.module}</td>
                          <td className="px-4 py-3 align-top font-mono text-xs text-slate-300">{finding.url}</td>
                          <td className="px-4 py-3 align-top font-mono text-xs text-slate-300">{finding.payload}</td>
                          <td className="px-4 py-3 align-top text-slate-300">{finding.evidence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
