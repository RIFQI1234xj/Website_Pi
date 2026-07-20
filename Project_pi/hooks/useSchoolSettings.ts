import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch, apiUpload } from '../lib/api';
import { DEFAULT_SCHOOL_SETTINGS, SchoolSettings } from '../lib/schoolSettings';

export const useSchoolSettings = () => {
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SCHOOL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didInitialFetchRef = useRef(false);

  const fetchSchoolSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/school-settings');
      if (res.success && res.data) {
        setSettings({ ...DEFAULT_SCHOOL_SETTINGS, ...res.data });
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pengaturan sekolah.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (didInitialFetchRef.current) return;
    didInitialFetchRef.current = true;
    fetchSchoolSettings();
  }, [fetchSchoolSettings]);

  const updateSchoolSettings = async (payload: Partial<SchoolSettings> | FormData) => {
    const res =
      payload instanceof FormData
        ? await apiUpload('/school-settings', payload, 'PUT')
        : await apiFetch('/school-settings', {
            method: 'PUT',
            body: JSON.stringify(payload),
          });

    if (res.success && res.data) {
      setSettings({ ...DEFAULT_SCHOOL_SETTINGS, ...res.data });
    }

    return res;
  };

  return { settings, loading, error, fetchSchoolSettings, updateSchoolSettings };
};
