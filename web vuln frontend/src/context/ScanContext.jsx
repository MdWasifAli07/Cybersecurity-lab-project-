import { createContext, useContext, useMemo, useState } from 'react';

const ScanContext = createContext(null);

export function ScanProvider({ children }) {
  const [scanId, setScanId] = useState('');
  const [lastTarget, setLastTarget] = useState('https://target.com');
  const [scanData, setScanData] = useState(null);

  const value = useMemo(
    () => ({
      scanId,
      setScanId,
      lastTarget,
      setLastTarget,
      scanData,
      setScanData,
    }),
    [scanId, lastTarget, scanData]
  );

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
}

export function useScan() {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within ScanProvider');
  }
  return context;
}
