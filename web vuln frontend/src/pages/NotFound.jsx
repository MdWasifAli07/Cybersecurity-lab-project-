import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8 text-center shadow-lg shadow-slate-950/50">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-sm text-slate-300">The route you requested does not exist or has moved.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="primary">Return home</Button>
        </Link>
      </div>
    </div>
  );
}
