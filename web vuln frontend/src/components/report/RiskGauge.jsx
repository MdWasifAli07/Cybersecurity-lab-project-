import { useMemo } from 'react';
import { getRiskColor, getRiskLabel } from '../../utils/formatHelpers';

export default function RiskGauge({ score = 0 }) {
  const safeScore = Math.min(100, Math.max(0, Number(score || 0)));
  const strokeDasharray = 2 * Math.PI * 70;
  const offset = strokeDasharray * (1 - safeScore / 100);
  const riskColor = getRiskColor(safeScore);
  const riskLabel = getRiskLabel(safeScore);

  const ringStyles = useMemo(
    () => ({
      strokeDasharray,
      strokeDashoffset: offset,
      stroke: riskColor,
    }),
    [offset, riskColor, strokeDasharray]
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-[0_0_25px_rgba(0,229,160,0.2)]">
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke={riskColor}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="100" y="92" textAnchor="middle" fontSize="38" fontWeight="700" fill="#E6EAF2">
          {safeScore}
        </text>
        <text x="100" y="120" textAnchor="middle" fontSize="10" letterSpacing="3" fill="#94A3B8">
          {riskLabel}
        </text>
      </svg>
    </div>
  );
}
