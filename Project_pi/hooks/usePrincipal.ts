import { useState, useEffect, useCallback } from 'react';
import { apiFetch, apiUpload } from '../lib/api';

export interface PrincipalData {
  id?: number;
  name: string;
  role: string;
  image: string;
  message: string;
}

export const usePrincipal = () => {
  const [principal, setPrincipal] = useState<PrincipalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrincipal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/principal');
      if (res.success) setPrincipal(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrincipal();
  }, [fetchPrincipal]);

  const updatePrincipal = async (formData: FormData) => {
    const res = await apiUpload('/principal', formData, 'PUT');
    if (res.success) {
      setPrincipal(res.data);
    }
    return res;
  };

  return { principal, loading, error, fetchPrincipal, updatePrincipal };
};
