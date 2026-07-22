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
 * Ambil token dari localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

/**
 * Simpan token ke localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem('admin_token', token);
};

/**
 * Hapus token (logout)
 */
export const removeToken = (): void => {
  localStorage.removeItem('admin_token');
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
 * Login dan simpan token
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
 * Logout dan hapus token
 */
export const logout = async () => {
  try {
    await apiFetch('/logout', { method: 'POST' });
  } finally {
    removeToken();
  }
};
