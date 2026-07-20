// ==============================================
// Hook: usePpdbStatus
// Custom hook untuk mengambil status pendaftaran
// PPDB dari backend API secara reaktif.
// ==============================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from '../lib/api';

// --- TypeScript Interfaces ---

export interface PpdbStatusData {
  tahun_ajaran: string;
  is_open: boolean;
}

interface PpdbStatusResponse {
  status: string;
  data: PpdbStatusData;
}

interface UsePpdbStatusReturn {
  ppdbStatus: PpdbStatusData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePpdbStatus = (): UsePpdbStatusReturn => {
  const [ppdbStatus, setPpdbStatus] = useState<PpdbStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didInitialFetchRef = useRef(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: PpdbStatusResponse = await apiFetch('/ppdb-status');
      if (res.status === 'success' && res.data) {
        setPpdbStatus(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat status PPDB.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (didInitialFetchRef.current) return;
    didInitialFetchRef.current = true;
    fetchStatus();
  }, [fetchStatus]);

  return { ppdbStatus, loading, error, refetch: fetchStatus };
};
