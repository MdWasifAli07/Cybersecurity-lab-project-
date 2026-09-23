import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ScanPage from './pages/ScanPage';
import NotFound from './pages/NotFound';
import { ScanProvider } from './context/ScanContext';
import { Spinner } from './components/ui/Spinner';

const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const ReportPage = lazy(() => import('./pages/ReportPage'));
const ReportPreviewPage = lazy(() => import('./pages/ReportPreviewPage'));
const ShareReportPage = lazy(() => import('./pages/ShareReportPage'));

export default function App() {
  return (
    <ScanProvider>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner size="lg" /></div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/scan/:id/progress" element={<ProgressPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/results/:scanId/report" element={<ReportPage />} />
          <Route path="/results/:scanId/report/preview" element={<ReportPreviewPage />} />
          <Route path="/report/share/:token" element={<ShareReportPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ScanProvider>
  );
}
