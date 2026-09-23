import ReportFindingCard from './ReportFindingCard';

export default function ReportFindings({ findings = [] }) {
  return (
    <div className="space-y-4">
      {findings.map((finding, index) => (
        <ReportFindingCard key={finding.id || `${finding.module}-${index}`} finding={finding} index={index} defaultOpen={index === 0} />
      ))}
    </div>
  );
}
