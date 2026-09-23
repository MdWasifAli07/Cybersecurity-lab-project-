export default function ReportAppendix() {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">Appendix</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Methodology</h3>
          <p className="text-sm leading-6 text-slate-300">
            The scanner mapped exposed routes, evaluated parameter handling, and validated business logic flows against common input validation weaknesses.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Modules</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Crawler v1.2.4</li>
            <li>SQL Injection v2.1.0</li>
            <li>Cross-Site Scripting v1.8.5</li>
            <li>Misconfiguration v0.9.7</li>
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Glossary</h3>
          <p className="text-sm leading-6 text-slate-300">
            SQLi = injection into database queries. XSS = script execution in a browser. CSRF = unauthorized cross-site action. CSP = browser content security policy.
          </p>
        </div>
      </div>
    </div>
  );
}
