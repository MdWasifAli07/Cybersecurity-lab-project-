export function Input({ id, label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border bg-slate-950/60 px-3 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${error ? 'border-red-500' : 'border-white/10'} ${className}`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
