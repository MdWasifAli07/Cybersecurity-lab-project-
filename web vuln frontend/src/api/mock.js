const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const mockScanResponse = {
  scan_id: 'scan-2026-001',
};

const mockStatus = {
  status: 'complete',
  progress: 100,
};

const mockResults = {
  target: 'https://target.com',
  total: 6,
  by_severity: {
    CRITICAL: 2,
    HIGH: 2,
    MEDIUM: 1,
    LOW: 1,
  },
  risk_score: 86,
  findings: [
    {
      id: 'f-001',
      severity: 'CRITICAL',
      module: 'SQL Injection',
      url: 'https://target.com/login',
      payload: "admin' OR '1'='1",
      evidence: 'Boolean-based injection successfully returned auth bypass in query parameter.',
      timestamp: '2026-09-18T10:24:00Z',
    },
    {
      id: 'f-002',
      severity: 'CRITICAL',
      module: 'Authentication',
      url: 'https://target.com/api/session',
      payload: 'jwt_token=eyJhbGciOiJub25lIn0',
      evidence: 'Token validation accepts unsigned JWT and reveals session secret.',
      timestamp: '2026-09-18T10:24:30Z',
    },
    {
      id: 'f-003',
      severity: 'HIGH',
      module: 'Reflected XSS',
      url: 'https://target.com/search?q=hello',
      payload: '<script>alert(1)</script>',
      evidence: 'Payload executes in the browser when rendered in search results.',
      timestamp: '2026-09-18T10:25:00Z',
    },
    {
      id: 'f-004',
      severity: 'HIGH',
      module: 'Misconfiguration',
      url: 'https://target.com/admin',
      payload: 'Debug mode enabled',
      evidence: 'Server reveals stack traces and environment variables.',
      timestamp: '2026-09-18T10:25:40Z',
    },
    {
      id: 'f-005',
      severity: 'MEDIUM',
      module: 'Headers',
      url: 'https://target.com/',
      payload: 'Missing X-Frame-Options',
      evidence: 'Clickjacking protections are absent from the response headers.',
      timestamp: '2026-09-18T10:26:20Z',
    },
    {
      id: 'f-006',
      severity: 'LOW',
      module: 'Crawl',
      url: 'https://target.com/robots.txt',
      payload: 'Disallow root admin area',
      evidence: 'Sensitive endpoint discovery reveals hidden admin surface.',
      timestamp: '2026-09-18T10:27:15Z',
    },
  ],
};

const mockProgressSequence = [
  12,
  27,
  41,
  59,
  73,
  88,
  100,
];

export const mockApi = {
  isEnabled: useMock,
  async createScan(payload) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return { data: { ...mockScanResponse, target: payload.target, modules: payload.modules } };
  },
  async getStatus(scanId) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return { data: { ...mockStatus, scan_id: scanId } };
  },
  async getResults(scanId) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return { data: { ...mockResults, scan_id: scanId } };
  },
  progressSequence: mockProgressSequence,
};

export default mockApi;
