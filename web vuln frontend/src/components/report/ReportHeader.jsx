import { Shield } from 'lucide-react';
import { formatDate } from '../../utils/formatHelpers';

export default function ReportHeader({ summary = {} }) {
  const modules = summary.modules || ['Crawler', 'SQL Injection', 'XSS'];

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6 shadow-lg shadow-slate-950/30">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-neon">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">VulnScan</p>
            <h1 className="text-xl font-bold text-white sm:text-2xl">Security Report</h1>
          </div>
        </div>
        <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-primary">
          {summary.status || 'Complete'}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Target</p>
          <p className="mt-2 break-words font-mono text-sm text-slate-100">{summary.target || 'https://target.com'}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Scan ID</p>
          <p className="mt-2 text-sm text-slate-100">{summary.scan_id || 'scan-000'}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Started</p>
          <p className="mt-2 text-sm text-slate-100">{formatDate(summary.started_at || summary.timestamp || new Date().toISOString())}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Finished</p>
          <p className="mt-2 text-sm text-slate-100">{formatDate(summary.completed_at || summary.timestamp || new Date().toISOString())}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Duration</p>
          <p className="mt-2 text-sm text-slate-100">{summary.duration || '2m 14s'}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Modules</p>
          <p className="mt-2 text-sm text-slate-100">{modules.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
