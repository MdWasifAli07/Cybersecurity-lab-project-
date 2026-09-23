import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FileSaver from 'file-saver';
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
      severity: 'CRITICAL',
      module: 'Authentication',
      url: 'https://target.local/login',
      payload: '<script>fetch("/admin")</script>',
      evidence: 'Unsanitized user input reflected in the response and executed within the browser context.',
      remediation: 'Sanitize and encode all reflected input before rendering.',
    },
  ],
};

export default function ReportPreviewPage() {
  const { scanId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const saveAs = FileSaver.saveAs || FileSaver;
  const summary = location.state?.summary || fallbackSummary;
  const reportHtml = buildReportHtml({ ...fallbackSummary, ...summary, scan_id: summary.scan_id || scanId || 'scan-demo' }, { theme: 'light' });

  const handleDownloadPdf = async () => {
    await exportToPdf({ ...fallbackSummary, ...summary }, { filename: `${summary.scan_id || 'report'}-preview.pdf` });
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${summary.scan_id || 'report'}-preview.html`);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="mx-auto mb-4 flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-primary">Preview</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Report preview</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleDownloadPdf} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-slate-950">
            Download PDF
          </button>
          <button type="button" onClick={handleDownloadHtml} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white">
            Download HTML
          </button>
          <button type="button" onClick={() => navigate(-1)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300">
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
        <iframe title="report-preview" srcDoc={reportHtml} className="h-[80vh] w-full bg-white" />
      </div>
    </div>
  );
}
