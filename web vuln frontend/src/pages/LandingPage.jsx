import { ArrowRight, BookOpenText, GitBranch, ShieldCheck, Sparkles, Terminal, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const features = [
  { icon: 'Crawl', title: 'Crawler', desc: 'Map endpoints and hidden surfaces before probing.' },
  { icon: 'SQLi', title: 'SQLi', desc: 'Detect injection patterns in query strings and forms.' },
  { icon: 'XSS', title: 'XSS', desc: 'Find reflected and stored injection risks quickly.' },
  { icon: 'Mcfg', title: 'Misconfig', desc: 'Flag weak headers, debug flags, and exposed files.' },
  { icon: 'Report', title: 'Reports', desc: 'Summarize risk with severity distribution and evidence.' },
  { icon: 'Modular', title: 'Modular', desc: 'Choose only the checks relevant to the target.' },
];

const steps = [
  'Enter URL',
  'Pick modules',
  'Get report',
];

const moduleTabs = [
  {
    name: 'Recon',
    title: 'Endpoint discovery',
    payload: 'crawler --depth 3 --output endpoints.json',
    summary: 'Validates routes, auth gaps, and hidden admin surfaces.',
  },
  {
    name: 'Injection',
    title: 'SQLi & XSS payloads',
    payload: "sqlmap -u 'https://target.com/login' --batch",
    summary: 'Exercises injection sinks with common payloads and filters.',
  },
  {
    name: 'Hardening',
    title: 'Headers and configs',
    payload: 'scan --headers --tls --misconfig',
    summary: 'Checks for missing protections and insecure defaults.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-slate-100">
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="grid-bg absolute inset-0 opacity-80" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Educational security tool
              </div>
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find the holes before attackers do.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-slate-300">
                Run a focused web security audit for common weaknesses, prioritize risk, and surface high-confidence findings with clear evidence.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/scan">
                  <Button variant="primary" size="lg" icon={ArrowRight}>
                    Launch Scanner
                  </Button>
                </Link>
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="lg" icon={GitBranch}>
                    GitHub
                  </Button>
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-xs uppercase tracking-[0.18em] text-slate-400">
                <span>OWASP-aware</span>
                <span>Fast scans</span>
                <span>Actionable reports</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <div className="terminal relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_30px_80px_rgba(9,11,18,0.8)]">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-critical" />
                  <span className="h-2.5 w-2.5 rounded-full bg-high" />
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </div>
                <div className="font-mono text-sm text-slate-200">
                  <div className="mb-3 text-primary">$ vulnscan --target https://target.com</div>
                  <div className="mb-2 text-slate-300">[✓] Crawling endpoints...</div>
                  <div className="mb-2 text-critical">[!] SQL Injection detected on /login</div>
                  <div className="mb-2 text-high">[!] Reflected XSS on /search?q=</div>
                  <div className="text-primary">[✓] Report generated.</div>
                </div>
                <div className="scan-line absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/10 via-primary/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-primary">Features</p>
              <h2 className="text-3xl font-bold text-white">Security checks with clarity</h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="p-5">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  {feature.icon === 'Crawl' && <BookOpenText className="h-5 w-5" />}
                  {feature.icon === 'SQLi' && <Terminal className="h-5 w-5" />}
                  {feature.icon === 'XSS' && <Wand2 className="h-5 w-5" />}
                  {feature.icon === 'Mcfg' && <ShieldCheck className="h-5 w-5" />}
                  {feature.icon === 'Report' && <Sparkles className="h-5 w-5" />}
                  {feature.icon === 'Modular' && <GitBranch className="h-5 w-5" />}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-300">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-slate-950/50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-primary">How it works</p>
            <h2 className="text-3xl font-bold text-white">Three quick steps to a security report</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <Card key={step} className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {index + 1}
                  </div>
                  <p className="text-lg font-semibold text-white">{step}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    {index === 0 && 'Provide a target URL and choose the scope for the scan.'}
                    {index === 1 && 'Select the checks that match your application and risk profile.'}
                    {index === 2 && 'Review findings, evidence, and a focused risk summary.'}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="modules" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-primary">Modules</p>
          <h2 className="text-3xl font-bold text-white">Practical payloads for common weaknesses</h2>
          <div className="mt-10 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <div className="mb-6 flex flex-wrap gap-3">
              {moduleTabs.map((tab, index) => (
                <button
                  key={tab.name}
                  type="button"
                  className={`rounded-full border px-3 py-2 text-sm font-medium ${index === 0 ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 bg-white/5 text-slate-200'} `}
                  aria-label={tab.name}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-sm text-slate-200">
                <div className="text-primary">$ {moduleTabs[0].payload}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-surface p-4">
                <p className="text-lg font-semibold text-white">{moduleTabs[0].title}</p>
                <p className="mt-2 text-sm text-slate-300">{moduleTabs[0].summary}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 to-blue/10 p-6 md:p-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-primary">Ready to scan?</p>
                <h3 className="text-3xl font-bold text-white">Start with a focused web security check.</h3>
              </div>
              <Link to="/scan">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Start a scan
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
