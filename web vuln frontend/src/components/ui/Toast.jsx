import { useEffect } from 'react';

export function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (!visible) return undefined;
    const t = setTimeout(() => onClose && onClose(), 4000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed right-4 top-4 z-50 rounded-xl border border-primary/30 bg-surface/95 px-4 py-3 text-sm text-slate-100 shadow-neon backdrop-blur-sm">
      {message}
    </div>
  );
}
