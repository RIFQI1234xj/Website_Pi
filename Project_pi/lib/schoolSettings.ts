export interface SchoolSettings {
  id?: number;
  school_name: string;
  npsn: string | null;
  email: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  website: string | null;
  address: string | null;
  postal_code: string | null;
  school_status: string | null;
  accreditation: string | null;
  established_year: number | null;
  welcome_title: string | null;
  welcome_highlight: string | null;
  welcome_tagline_1: string | null;
  welcome_tagline_2: string | null;
  welcome_tagline_3: string | null;
  hero_images: string[];
  map_embed_url: string | null;
  map_link: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  brochure_images: string[];
}

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  school_name: 'MI Al-Hasani',
  npsn: '60706775',
  email: 'misalhasani@gmail.com',
  phone: '(0251) 8256657',
  whatsapp_number: '6281385086531',
  website: 'https://mialhasani.sch.id',
  address: 'Jl. Kp. Babakansirna 02/02\nDs. Jogjogan, Kec. Cisarua\nKab. Bogor, Jawa Barat',
  postal_code: '16750',
  school_status: 'Swasta',
  accreditation: 'B',
  established_year: 1995,
  welcome_title: 'Selamat Datang di',
  welcome_highlight: 'MI AL-HASANI',
  welcome_tagline_1: 'Tempat di Mana Ilmu Pengetahuan',
  welcome_tagline_2: 'dan',
  welcome_tagline_3: 'Nilai - Nilai Islami Berpadu',
  hero_images: ['galeri-prestasi.jpg', 'galeri-maulid.jpg', 'galeri-shalat.jpg'],
  map_embed_url:
    'https://maps.google.com/maps?q=MTsS+AL+HASANI,+Jl.+Jogjogan,+Cisarua,+Bogor&t=&z=16&ie=UTF8&iwloc=&output=embed',
  map_link: 'https://maps.google.com/?q=MTsS+AL+HASANI,+Jl.+Jogjogan,+Cisarua,+Bogor',
  facebook_url: null,
  instagram_url: null,
  youtube_url: null,
  twitter_url: null,
  brochure_images: [],
};

export const ensureUrl = (value: string | null | undefined): string | null => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

export const normalizePhoneNumber = (value: string | null | undefined): string =>
  (value || '').replace(/[^\d]/g, '');

export const getAddressWithPostalCode = (settings: SchoolSettings): string => {
  const address = settings.address || '';
  return settings.postal_code ? `${address}\nKode Pos: ${settings.postal_code}` : address;
};
