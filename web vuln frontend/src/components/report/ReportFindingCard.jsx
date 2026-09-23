import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Copy, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../ui/Badge';

export default function ReportFindingCard({ finding, index, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const payloadText = useMemo(() => JSON.stringify(finding, null, 2), [finding]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payloadText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      // TODO: optional clipboard fallback
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 data-[print-avoid-break]:break-inside-avoid" data-print-avoid-break="true">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
        aria-label={`Toggle finding ${index + 1}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Badge severity={finding.severity || 'LOW'}>{finding.severity || 'LOW'}</Badge>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">{finding.module || 'Security finding'}</div>
            <div className="mt-1 truncate font-mono text-xs text-slate-400">{finding.url || 'https://target.com'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleCopy();
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300"
            aria-label="Copy finding JSON"
          >
            <Copy className="h-4 w-4" />
          </button>
          <ChevronDown className={`h-4 w-4 text-slate-300 transition ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 border-t border-white/10 px-4 py-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">URL</p>
                <p className="break-all font-mono text-xs text-slate-200">{finding.url || 'https://target.com'}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">Module</p>
                <p className="text-sm text-slate-200">{finding.module || 'Security finding'}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3 md:col-span-2">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">Payload</p>
                <pre className="overflow-x-auto rounded-lg border border-white/10 bg-slate-950 p-3 font-mono text-xs text-slate-100">{finding.payload || 'No payload captured'}</pre>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3 md:col-span-2">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">Evidence</p>
                <p className="text-sm leading-6 text-slate-200">{finding.evidence || 'No evidence captured.'}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">Remediation tip</p>
                <p className="text-sm text-slate-200">{finding.remediation || 'Validate input, enforce least privilege, and add safe output encoding.'}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">Tags</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-200">CWE-79</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-200">OWASP A03</span>
                </div>
              </div>
            </div>
            {copied && <div className="px-4 pb-4 text-xs text-primary">Finding copied to clipboard.</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
