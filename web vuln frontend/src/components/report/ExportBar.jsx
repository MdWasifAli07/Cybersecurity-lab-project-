import { Download, FileText, Printer } from 'lucide-react';

export default function ExportBar({ onExportPdf, onExportHtml, onExportJson, onPrint, onPreview }) {
  const actions = [
    { label: 'PDF', icon: Download, onClick: onExportPdf },
    { label: 'HTML', icon: FileText, onClick: onExportHtml },
    { label: 'JSON', icon: Download, onClick: onExportJson },
    { label: 'Preview', icon: FileText, onClick: onPreview },
    { label: 'Print', icon: Printer, onClick: onPrint },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-surface p-3">
      {actions.map(({ label, icon: Icon, onClick }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 transition hover:border-primary/30 hover:text-primary"
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
