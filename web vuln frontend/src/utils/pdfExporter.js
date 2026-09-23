import html2pdf from 'html2pdf.js';
import { buildReportHtml } from './reportGenerator';

export async function exportToPdf(summary, options = {}) {
  const filename = options.filename || 'vulnscan_report.pdf';
  const html = buildReportHtml(summary, options);

  return html2pdf()
    .from(html)
    .set({
      margin: [10, 10, 10, 10],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#0A0E1A' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    })
    .save();
}
