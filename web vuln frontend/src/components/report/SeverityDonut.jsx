import { buildSeverityLegend } from '../../utils/formatHelpers';

export default function SeverityDonut({ bySeverity = {} }) {
  const legend = buildSeverityLegend(bySeverity);
  const total = legend.reduce((sum, item) => sum + item.value, 0);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative">
        <svg width="210" height="210" viewBox="0 0 210 210" aria-label="Severity donut">
          <circle cx="105" cy="105" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="22" />
          {legend.map((item) => {
            const dash = (item.value / (total || 1)) * circumference;
            const segment = (
              <circle
                key={item.label}
                cx="105"
                cy="105"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="22"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 105 105)"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
            );
            offset += dash;
            return segment;
          })}
          <text x="105" y="98" textAnchor="middle" fontSize="30" fontWeight="700" fill="#E6EAF2">
            {total}
          </text>
          <text x="105" y="122" textAnchor="middle" fontSize="10" letterSpacing="3" fill="#94A3B8">
            FINDINGS
          </text>
        </svg>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm uppercase tracking-[0.14em] text-slate-300">{item.label}</span>
            </div>
            <div className="text-right text-sm text-slate-300">
              <span className="font-semibold text-white">{item.value}</span>
              <span className="ml-2 text-slate-400">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
