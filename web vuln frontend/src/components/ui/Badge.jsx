const severityStyles = {
  CRITICAL: 'bg-critical/15 text-critical border-critical/30',
  HIGH: 'bg-high/15 text-high border-high/30',
  MEDIUM: 'bg-medium/15 text-medium border-medium/30',
  LOW: 'bg-low/15 text-low border-low/30',
  INFO: 'bg-blue/15 text-blue border-blue/30',
};

export function Badge({ children, severity = 'INFO', className = '' }) {
  const tone = severityStyles[severity] || severityStyles.INFO;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone} ${className}`}>
      {children}
    </span>
  );
}
