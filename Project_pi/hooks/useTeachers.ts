import { useState, useEffect, useCallback } from 'react';
import { apiFetch, apiUpload } from '../lib/api';

export interface TeacherItem {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  order: number;
  subject?: string;
  is_active?: boolean | number;
}

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/teachers');
      if (res.success) setTeachers(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const createTeacher = async (formData: FormData) => {
    const res = await apiUpload('/teachers', formData, 'POST');
    if (res.success) await fetchTeachers();
    return res;
  };

  const updateTeacher = async (id: number, formData: FormData) => {
    const res = await apiUpload(`/teachers/${id}`, formData, 'PUT');
    if (res.success) await fetchTeachers();
    return res;
  };

  const deleteTeacher = async (id: number) => {
    const res = await apiFetch(`/teachers/${id}`, { method: 'DELETE' });
    if (res.success) await fetchTeachers();
    return res;
  };

  return { teachers, loading, error, fetchTeachers, createTeacher, updateTeacher, deleteTeacher };
};
