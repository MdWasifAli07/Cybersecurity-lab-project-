import RiskGauge from './RiskGauge';

export default function ReportSummary({ summary = {} }) {
  const bySeverity = summary.by_severity || { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const total = summary.total || (Object.values(bySeverity).reduce((sum, value) => sum + Number(value || 0), 0));
  const criticalHigh = (bySeverity.CRITICAL || 0) + (bySeverity.HIGH || 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
        <div className="flex justify-center">
          <RiskGauge score={summary.risk_score || 0} />
        </div>

        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Total findings</p>
              <p className="mt-3 text-3xl font-bold text-white">{total}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Critical + High</p>
              <p className="mt-3 text-3xl font-bold text-white">{criticalHigh}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Medium</p>
              <p className="mt-3 text-3xl font-bold text-white">{bySeverity.MEDIUM || 0}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Low + Info</p>
              <p className="mt-3 text-3xl font-bold text-white">{(bySeverity.LOW || 0) + (bySeverity.INFO || 0)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-slate-300">
            3 modules • 47 endpoints • 12 params tested
          </div>
        </div>
      </div>
    </div>
  );
}
