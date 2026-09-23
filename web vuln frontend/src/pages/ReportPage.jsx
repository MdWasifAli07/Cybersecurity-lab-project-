import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FileSaver from 'file-saver';
import { useScan } from '../context/ScanContext';
import ExportBar from '../components/report/ExportBar';
import ReportAppendix from '../components/report/ReportAppendix';
import ReportFooter from '../components/report/ReportFooter';
import ReportFindings from '../components/report/ReportFindings';
import ReportHeader from '../components/report/ReportHeader';
import ReportSummary from '../components/report/ReportSummary';
import SeverityDonut from '../components/report/SeverityDonut';
import { buildReportHtml } from '../utils/reportGenerator';
import { exportToPdf } from '../utils/pdfExporter';

const fallbackSummary = {
  target: 'https://target.local',
  scan_id: 'scan-demo',
  total: 12,
  risk_score: 84,
  by_severity: { CRITICAL: 2, HIGH: 4, MEDIUM: 3, LOW: 2, INFO: 1 },
  findings: [
    {
      id: 'f-1',
      severity: 'CRITICAL',
      module: 'Authentication',
      url: 'https://target.local/login',
      payload: "<script>fetch('/admin')</script>",
      evidence: 'Unsanitized user input reflected in the response and executed within the browser context.',
      remediation: 'Sanitize and encode all reflected input before rendering.',
    },
    {
      id: 'f-2',
      severity: 'HIGH',
      module: 'Payment API',
      url: 'https://target.local/payments/charge',
      payload: "'; DROP TABLE users; --",
      evidence: 'The request parameter is concatenated into a SQL statement without parameterization.',
      remediation: 'Use prepared statements and strict server-side validation.',
    },
  ],
};

export default function ReportPage() {
  const { scanId } = useParams();
  const { currentScan } = useScan();
  const navigate = useNavigate();
  const location = useLocation();

  const summary = useMemo(() => {
    const payload = location.state?.summary || currentScan?.summary || fallbackSummary;
    return {
      ...fallbackSummary,
      ...payload,
      scan_id: payload.scan_id || scanId || 'scan-demo',
      target: payload.target || currentScan?.target || 'https://target.local',
    };
  }, [currentScan, location.state, scanId]);

  const reportHtml = useMemo(() => buildReportHtml(summary), [summary]);
  const saveAs = FileSaver.saveAs || FileSaver;

  const handleExportPdf = async () => {
    await exportToPdf(summary, { filename: `${summary.scan_id || 'report'}-vulnscan.pdf` });
  };

  const handleExportHtml = () => {
    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${summary.scan_id || 'report'}-vulnscan.html`);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json;charset=utf-8' });
    saveAs(blob, `${summary.scan_id || 'report'}-vulnscan.json`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePreview = () => {
    navigate(`/results/${summary.scan_id || scanId || 'scan-demo'}/report/preview`, { state: { summary } });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-primary">Assessment report</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Executive security summary</h1>
        </div>
        <ExportBar
          onExportPdf={handleExportPdf}
          onExportHtml={handleExportHtml}
          onExportJson={handleExportJson}
          onPrint={handlePrint}
          onPreview={handlePreview}
        />
      </div>

      <div className="space-y-6">
        <ReportHeader summary={summary} />
        <ReportSummary summary={summary} />
        <SeverityDonut bySeverity={summary.by_severity || {}} />
        <div className="rounded-2xl border border-white/10 bg-surface p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Findings</h2>
          <ReportFindings findings={summary.findings || []} />
        </div>
        <ReportAppendix />
        <ReportFooter summary={summary} />
      </div>

    </div>
  );
}
