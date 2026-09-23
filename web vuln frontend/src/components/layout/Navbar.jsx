import { Menu, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Modules', href: '#modules' },
];

export function Navbar({ compact = false }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="VULNSCAN home">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary shadow-neon">
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-mono text-lg font-semibold tracking-[0.26em] text-slate-100">VULNSCAN</span>
        </Link>

        {!compact && (
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {!compact && (
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/scan">
              <Button variant="primary" size="sm">
                Launch Scanner
              </Button>
            </Link>
          </div>
        )}

        {!compact && (
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      {!compact && open && (
        <div className="border-t border-white/5 bg-bg/95 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm text-slate-200" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <Link to="/scan" onClick={() => setOpen(false)}>
              <Button variant="primary" size="sm" className="w-full">
                Launch Scanner
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
