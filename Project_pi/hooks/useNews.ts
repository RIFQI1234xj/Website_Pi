import { useState, useEffect, useCallback } from 'react';
import { apiFetch, apiUpload } from '../lib/api';

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  image: string;
  photos?: string[];
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  created_at?: string;
}

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/news');
      if (res.success) setNews(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const createNews = async (formData: FormData) => {
    const res = await apiUpload('/news', formData, 'POST');
    if (res.success) await fetchNews();
    return res;
  };

  const updateNews = async (id: number, formData: FormData) => {
    const res = await apiUpload(`/news/${id}`, formData, 'PUT');
    if (res.success) await fetchNews();
    return res;
  };

  const deleteNews = async (id: number) => {
    const res = await apiFetch(`/news/${id}`, { method: 'DELETE' });
    if (res.success) await fetchNews();
    return res;
  };

  return { news, loading, error, fetchNews, createNews, updateNews, deleteNews };
};
