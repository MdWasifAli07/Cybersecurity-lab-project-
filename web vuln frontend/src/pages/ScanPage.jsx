import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ShieldCheck, TimerReset } from 'lucide-react';
import { createScan } from '../api/client';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { Navbar } from '../components/layout/Navbar';
import { useScan } from '../context/ScanContext';

const Modules = [
  { id: 'crawler', name: 'Crawler', severity: 'LOW', description: 'Discover exposed endpoints, files, and hidden routes.' },
  { id: 'sqli', name: 'SQL Injection', severity: 'CRITICAL', description: 'Probe input validation and query logic weaknesses.' },
  { id: 'xss', name: 'XSS', severity: 'HIGH', description: 'Test for reflected, stored, and DOM-based injection.' },
];

export default function ScanPage() {
  const navigate = useNavigate();
  const { setScanId, setLastTarget } = useScan();
  const [target, setTarget] = useState('https://target.com');
  const [selectedModules, setSelectedModules] = useState(['crawler', 'sqli', 'xss']);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleModule = (moduleId) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const validateUrl = (value) => /^https?:\/\//i.test(value.trim());

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateUrl(target)) {
      setError('Enter a valid http or https URL.');
      return;
    }

    if (!authorized) {
      setError('You must confirm you are authorized to test this target.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createScan({
        target: target.trim(),
        modules: selectedModules,
        authorized,
      });

      const scanId = response?.data?.scan_id || response?.data?.id || `scan-${Date.now()}`;
      setScanId(scanId);
      setLastTarget(target.trim());
      navigate(`/scan/${scanId}/progress`);
    } catch (err) {
      setError('Unable to start the scan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-slate-100">
      <Navbar compact />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Scanner</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Start a security scan</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-5">
              <Input
                id="target-url"
                label="Target URL"
                type="url"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="https://example.com"
                error={error && !validateUrl(target) ? error : ''}
                className="font-mono"
              />
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Modules</h2>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{selectedModules.length} selected</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {Modules.map((module) => (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className={`rounded-xl border p-4 text-left transition-all ${selectedModules.includes(module.id) ? 'border-primary/40 bg-primary/10' : 'border-white/10 bg-slate-950/50 hover:border-primary/20'}`}
                    aria-label={`Toggle ${module.name}`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="font-semibold text-white">{module.name}</span>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${module.severity === 'CRITICAL' ? 'border-critical/20 bg-critical/10 text-critical' : module.severity === 'HIGH' ? 'border-high/20 bg-high/10 text-high' : 'border-low/20 bg-low/10 text-low'}`}>
                        {module.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{module.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <Checkbox
                id="authorization"
                checked={authorized}
                onChange={(e) => setAuthorized(e.target.checked)}
                label="I confirm I have authorization to test this target."
              />
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <span>Only run scans against systems you own or are explicitly authorized to test.</span>
              </div>
              {error && !validateUrl(target) ? null : error && !authorized ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
            </Card>

            <Button type="submit" size="lg" loading={loading} icon={ArrowRight} className="w-full sm:w-auto" aria-label="Start scan">
              Start Scan
            </Button>
          </form>

          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="mb-4 text-lg font-semibold text-white">What we’ll check</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>• Endpoint discovery and route inventory</li>
                <li>• SQL injection and input validation flaws</li>
                <li>• Reflected/stored XSS conditions</li>
                <li>• Basic misconfiguration and exposure checks</li>
              </ul>
            </Card>

            <Card className="p-5">
              <h3 className="mb-4 text-lg font-semibold text-white">Legal notice</h3>
              <p className="text-sm text-slate-300">This tool is for educational use and authorized security testing only.</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary"><TimerReset className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm text-slate-400">Estimated time</p>
                  <p className="text-xl font-semibold text-white">~ 1–2 minutes</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
