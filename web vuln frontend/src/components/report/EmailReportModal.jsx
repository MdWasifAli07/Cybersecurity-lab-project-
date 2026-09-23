import { Mail, X } from 'lucide-react';
import { useState } from 'react';

export default function EmailReportModal({ open, onClose, onSend, reportLink = '', error = '', sending = false }) {
  const [email, setEmail] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 shadow-xl shadow-slate-950/50">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Send report</p>
              <h3 className="text-lg font-semibold text-white">Email recipient</h3>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 p-2 text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="block text-sm text-slate-300">
          Email address
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-primary/40"
            placeholder="security-team@example.com"
          />
        </label>

        <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-300">
          <p className="uppercase tracking-[0.12em] text-slate-500">Shared link</p>
          <p className="mt-2 break-all font-mono text-[11px] text-slate-200">{reportLink || 'https://report.local/share/...'}</p>
        </div>

        {error ? <p className="mt-3 text-sm text-red-400" role="alert">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSend(email)}
            disabled={sending || !email}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-slate-950"
          >
            {sending ? 'Sending...' : 'Send report'}
          </button>
        </div>
      </div>
    </div>
  );
}
