export default function ExportPdfButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110">
      Export PDF
    </button>
  );
}
