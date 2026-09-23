export function formatDate(value, options = {}) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(date);
}

export function formatDuration(start, end) {
  if (!start || !end) return 'N/A';
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  const seconds = Math.max(0, Math.floor((diffMs % 60000) / 1000));
  return `${minutes}m ${seconds}s`;
}

export function getRiskLabel(score) {
  if (score >= 81) return 'SEVERE';
  if (score >= 51) return 'HIGH';
  if (score >= 21) return 'MODERATE';
  return 'LOW RISK';
}

export function getRiskColor(score) {
  if (score >= 81) return '#FF3B5C';
  if (score >= 51) return '#FFA726';
  if (score >= 21) return '#FFD60A';
  return '#00E5A0';
}

export function slugify(value = 'report') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'report';
}

export function sumSeverityCounts(bySeverity = {}) {
  return Object.values(bySeverity || {}).reduce((sum, value) => sum + Number(value || 0), 0);
}

export function buildSeverityLegend(bySeverity = {}) {
  const order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const total = sumSeverityCounts(bySeverity);

  return order.map((label) => {
    const value = Number(bySeverity[label] || 0);
    return {
      label,
      value,
      percentage: total ? Math.round((value / total) * 100) : 0,
      color:
        label === 'CRITICAL'
          ? '#FF3B5C'
          : label === 'HIGH'
            ? '#FFA726'
            : label === 'MEDIUM'
              ? '#FFD60A'
              : '#38BDF8',
    };
  });
}
