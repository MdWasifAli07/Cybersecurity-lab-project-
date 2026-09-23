import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buildReportHtml } from '../utils/reportGenerator';

export default function ShareReportPage() {
  const { token } = useParams();
  const [share, setShare] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(`vulnscan-share-${token}`);
    if (!raw) {
      setShare(null);
      return;
    }

    try {
      setShare(JSON.parse(raw));
    } catch (error) {
      setShare(null);
    }
  }, [token]);

  const summary = useMemo(() => share?.summary || { target: 'https://target.local', scan_id: 'scan-demo', findings: [] }, [share]);
  const html = useMemo(() => buildReportHtml(summary, { theme: 'light' }), [summary]);

  if (!share) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-300">
        <div className="max-w-md rounded-2xl border border-white/10 bg-surface p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-primary">Shared report</p>
          <h1 className="mt-3 text-2xl font-bold text-white">Link not found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">This share token is invalid or the report has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 rounded-2xl border border-white/10 bg-surface p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-primary">Shared report</p>
          <h1 className="mt-2 text-2xl font-bold text-white">{summary.target}</h1>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
          <iframe title="shared-report" srcDoc={html} className="h-[82vh] w-full bg-white" />
        </div>
      </div>
    </div>
  );
}
