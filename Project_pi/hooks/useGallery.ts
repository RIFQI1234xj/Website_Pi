import { useState, useEffect, useCallback } from 'react';
import { apiFetch, apiUpload } from '../lib/api';

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string | null;
  photos?: string[] | null;
  description?: string | null;
}

export const useGallery = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/galleries');
      if (res.success) setGalleries(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const createGallery = async (formData: FormData) => {
    const res = await apiUpload('/galleries', formData, 'POST');
    if (res.success) await fetchGalleries();
    return res;
  };

  const updateGallery = async (id: number, formData: FormData) => {
    const res = await apiUpload(`/galleries/${id}`, formData, 'PUT');
    if (res.success) await fetchGalleries();
    return res;
  };

  const deleteGallery = async (id: number) => {
    const res = await apiFetch(`/galleries/${id}`, { method: 'DELETE' });
    if (res.success) await fetchGalleries();
    return res;
  };

  return { galleries, loading, error, fetchGalleries, createGallery, updateGallery, deleteGallery };
};
