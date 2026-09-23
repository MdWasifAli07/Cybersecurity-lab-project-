export default function ShareLinkButton({ onClick, text = 'Share Link' }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-primary/40 hover:text-primary">
      {text}
    </button>
  );
}
