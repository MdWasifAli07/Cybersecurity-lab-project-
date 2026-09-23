import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Radar, ShieldCheck } from 'lucide-react';
import { getScanStatus } from '../api/client';
import { Button } from '../components/ui/Button';

export default function ProgressPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Starting scan');
  const [logs, setLogs] = useState([
    'Initializing reconnaissance engine...',
    'Loading endpoint crawler...',
  ]);

  useEffect(() => {
    let active = true;
    const step = async () => {
      try {
        const response = await getScanStatus(id);

        const value = response?.data?.progress ?? 0;
        const scanStatus = response?.data?.status ?? 'running';
        if (!active) return;
        setProgress(value);
        setStatus(scanStatus);

        const nextLogs = [
          'Initializing reconnaissance engine...',
          'Loading endpoint crawler...',
          'Testing SQL injection payloads...',
          'Reviewing XSS sinks...',
          'Compiling findings report...',
          'Scan complete.',
        ];
        setLogs((prev) => [...prev, nextLogs[Math.min(prev.length, nextLogs.length - 1)]].slice(-6));

        if (scanStatus === 'complete' || value >= 100) {
          setTimeout(() => navigate(`/results/${id}`), 800);
          return;
        }
      } catch (error) {
        if (active) {
          setStatus('Retrying scan');
        }
      }

      const timer = setTimeout(step, 1000);
      return () => clearTimeout(timer);
    };

    const initialTimer = setTimeout(step, 400);
    return () => {
      active = false;
      clearTimeout(initialTimer);
    };
  }, [id, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10 text-slate-100">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-surface/80 p-6 shadow-2xl shadow-slate-950/50">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary">Progress</p>
            <h1 className="mt-2 text-2xl font-bold text-white">Scanning target</h1>
          </div>
          <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.12em] text-primary">
            {status}
          </div>
        </div>

        <div className="relative mb-8 flex items-center justify-center">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-primary/30 bg-primary/5">
            <div className="absolute inset-3 rounded-full border border-primary/20" />
            <div className="absolute inset-1 rounded-full border border-primary/10" />
            <div className="absolute h-24 w-24 rounded-full border border-dashed border-primary/30" />
            <Radar className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span className="font-mono text-primary">{id}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-900">
            <div className="h-full rounded-full bg-gradient-to-r from-primary via-blue to-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 font-mono text-sm text-slate-300">
          {logs.map((log, index) => (
            <div key={`${log}-${index}`} className="mb-2 text-slate-300">
              {log}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="secondary" size="sm" icon={ShieldCheck}>
            Secure feed active
          </Button>
        </div>
      </div>
    </div>
  );
}
