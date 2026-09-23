export function Checkbox({ id, checked, onChange, label, className = '' }) {
  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-white/10 bg-slate-900 accent-primary"
        aria-label={label || 'Checkbox'}
      />
      <span className="text-sm text-slate-200">{label}</span>
    </label>
  );
}
