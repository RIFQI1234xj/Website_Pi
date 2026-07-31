// ==============================================
// API Client — Pusat Komunikasi dengan Backend
// ==============================================

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000/api';
const DEFAULT_IMAGE_BASE_URL = 'http://127.0.0.1:8000/api/media';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const VITE_ENV = (import.meta as any).env as Record<string, string | undefined> | undefined;

export const API_BASE_URL = trimTrailingSlash(
  VITE_ENV?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
);

/**
 * Base URL untuk gambar yang disimpan di backend Laravel
 * Gambar lama (statis) ada di /images/nama.jpg (frontend)
 * Gambar baru (uploaded) ada di http://127.0.0.1:8000/images/nama.jpg (backend)
 */
export const IMAGE_BASE_URL = trimTrailingSlash(
  VITE_ENV?.VITE_IMAGE_BASE_URL ||
    (API_BASE_URL.endsWith('/api')
      ? `${API_BASE_URL}/media`
      : DEFAULT_IMAGE_BASE_URL)
);

const encodeFilename = (filename: string): string =>
  filename
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

const escapeSvgText = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const getFallbackImage = (label = 'Foto MI Al-Hasani'): string => {
  const safeLabel = escapeSvgText(label);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#115e59" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" />
      <circle cx="190" cy="160" r="110" fill="rgba(255,255,255,0.08)" />
      <circle cx="1040" cy="690" r="180" fill="rgba(250,204,21,0.12)" />
      <text x="50%" y="45%" text-anchor="middle" fill="#f8fafc" font-family="Arial, sans-serif" font-size="54" font-weight="700">
        MI Al-Hasani
      </text>
      <text x="50%" y="55%" text-anchor="middle" fill="#d1fae5" font-family="Arial, sans-serif" font-size="30">
        ${safeLabel}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const setImageFallback = (
  image: HTMLImageElement,
  label = 'Foto MI Al-Hasani'
): void => {
  if (image.dataset.fallbackApplied === 'true') {
    return;
  }

  image.dataset.fallbackApplied = 'true';
  image.src = getFallbackImage(label);
};

export const isDummyImageSource = (value: string | null | undefined): boolean =>
  Boolean(value && /picsum\.photos/i.test(value));

/**
 * Helper untuk mendapatkan URL gambar yang benar
 * - Jika gambar mengandung timestamp prefix (uploaded), gunakan backend URL
 * - Jika gambar tanpa prefix, coba dari frontend dulu
 */
export const getImageUrl = (filename: string | null | undefined): string => {
  if (!filename) return '';
  // Jika sudah URL lengkap (blob: atau http), langsung return
  if (filename.startsWith('http') || filename.startsWith('blob:')) {
    // Optimasi jika ini adalah URL Cloudinary untuk mempercepat loading (convert ke WebP)
    if (filename.includes('res.cloudinary.com') && filename.includes('/upload/')) {
      return filename.replace('/upload/', '/upload/q_auto,f_auto,w_1920,c_limit/');
    }
    return filename;
  }
  // Semua gambar diambil dari endpoint media backend
  return `${IMAGE_BASE_URL}/${encodeFilename(filename)}`;
};

/**
 * Ambil token Admin dari localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

/**
 * Simpan token Admin ke localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem('admin_token', token);
};

/**
 * Hapus token Admin (logout admin)
 */
export const removeToken = (): void => {
  localStorage.removeItem('admin_token');
};

/**
 * Ambil token Pendaftar PPDB dari localStorage
 */
export const getPpdbToken = (): string | null => {
  return localStorage.getItem('ppdb_token');
};

/**
 * Simpan token Pendaftar PPDB ke localStorage
 */
export const setPpdbToken = (token: string): void => {
  localStorage.setItem('ppdb_token', token);
};

/**
 * Hapus token Pendaftar PPDB (logout pendaftar)
 */
export const removePpdbToken = (): void => {
  localStorage.removeItem('ppdb_token');
};

/**
 * Wrapper fetch dengan Authorization header otomatis
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getToken();

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    removeToken();
    throw new Error('Sesi telah berakhir. Silakan login kembali.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }

  return data;
};

/**
 * Upload FormData (multipart/form-data) — untuk file upload
 * PENTING: Jangan set Content-Type manually, browser akan otomatis set boundary
 */
export const apiUpload = async (
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<any> => {
  const token = getToken();

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Untuk PUT via FormData, Laravel memerlukan _method spoofing
  if (method === 'PUT') {
    formData.append('_method', 'PUT');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST', // Selalu POST, karena FormData + PUT butuh _method
    headers,
    body: formData,
  });

  if (response.status === 401) {
    removeToken();
    throw new Error('Sesi telah berakhir. Silakan login kembali.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }

  return data;
};

/**
 * Wrapper fetch khusus Pendaftar PPDB — pakai ppdb_token
 */
export const ppdbApiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getPpdbToken();

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removePpdbToken();
    throw new Error('Sesi telah berakhir. Silakan login kembali.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }

  return data;
};

/**
 * Login Admin dan simpan token
 */
export const login = async (email: string, password: string) => {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data.token) {
    setToken(data.token);
  }

  return data;
};

/**
 * Logout Admin dan hapus token
 */
export const logout = async () => {
  try {
    await apiFetch('/logout', { method: 'POST' });
  } finally {
    removeToken();
  }
};

/**
 * Register Pendaftar PPDB — buat akun baru
 */
export const ppdbRegister = async (
  nik: string,
  username: string,
  name: string,
  password: string,
  passwordConfirmation: string
) => {
  const data = await fetch(`${API_BASE_URL}/ppdb/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      nik,
      username,
      name,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  const json = await data.json();

  if (!data.ok) {
    // Ambil pesan error pertama dari Laravel validation
    const firstError =
      json.errors
        ? Object.values(json.errors as Record<string, string[]>)[0]?.[0]
        : null;
    throw new Error(firstError || json.message || 'Gagal membuat akun.');
  }

  if (json.token) {
    setPpdbToken(json.token);
  }

  return json;
};

/**
 * Login Pendaftar PPDB dan simpan token
 */
export const ppdbLogin = async (username: string, password: string) => {
  const data = await fetch(`${API_BASE_URL}/ppdb/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const json = await data.json();

  if (!data.ok) {
    const firstError =
      json.errors
        ? Object.values(json.errors as Record<string, string[]>)[0]?.[0]
        : null;
    throw new Error(firstError || json.message || 'Email atau password salah.');
  }

  if (json.token) {
    setPpdbToken(json.token);
  }

  return json;
};

/**
 * Logout Pendaftar PPDB dan hapus token
 */
export const ppdbLogout = async () => {
  const token = getPpdbToken();
  try {
    if (token) {
      await fetch(`${API_BASE_URL}/ppdb/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
    }
  } finally {
    removePpdbToken();
  }
};

/**
 * Reset Password Pendaftar PPDB
 */
export const ppdbResetPassword = async (
  username: string,
  nik: string,
  password: string,
  passwordConfirmation: string
) => {
  const data = await fetch(`${API_BASE_URL}/ppdb/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      username,
      nik,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  const json = await data.json();

  if (!data.ok) {
    const firstError =
      json.errors
        ? Object.values(json.errors as Record<string, string[]>)[0]?.[0]
        : null;
    throw new Error(firstError || json.message || 'Gagal reset password.');
  }

  return json;
};
