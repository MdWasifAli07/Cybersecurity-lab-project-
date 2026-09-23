export function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`rounded-xl border border-white/5 bg-surface/80 p-4 shadow-lg shadow-slate-950/10 backdrop-blur-sm transition-all duration-200 ${hover ? 'hover:border-primary/40 hover:shadow-neon' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
