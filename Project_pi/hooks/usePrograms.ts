import { useState, useEffect, useCallback } from 'react';
import { apiFetch, apiUpload } from '../lib/api';

export interface ProgramItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  category: string;
  schedule?: string;
  is_active: boolean;
}

export const usePrograms = () => {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/programs');
      if (res.success) setPrograms(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const createProgram = async (formData: FormData) => {
    const res = await apiUpload('/programs', formData, 'POST');
    if (res.success) await fetchPrograms();
    return res;
  };

  const updateProgram = async (id: number, formData: FormData) => {
    const res = await apiUpload(`/programs/${id}`, formData, 'PUT');
    if (res.success) await fetchPrograms();
    return res;
  };

  const deleteProgram = async (id: number) => {
    const res = await apiFetch(`/programs/${id}`, { method: 'DELETE' });
    if (res.success) await fetchPrograms();
    return res;
  };

  return { programs, loading, error, fetchPrograms, createProgram, updateProgram, deleteProgram };
};
