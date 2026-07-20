import { GalleryItem, NewsItem, Teacher } from "./types";

export const TEACHERS: Teacher[] = [
  { id: 1, name: "Eneng Heti Nurhayati, S.Pd.I", role: "Kepala Sekolah", image: "galeri-prestasi.jpg", subject: "Manajemen Sekolah" },
  { id: 2, name: "Siti Aminah, S.Pd", role: "Guru Kelas 1", image: "galeri-maulid.jpg", subject: "Tematik" },
  { id: 3, name: "Budi Santoso, S.Pd", role: "Guru PJOK", image: "galeri-shalat.jpg", subject: "Pendidikan Jasmani" },
  { id: 4, name: "Rina Wati, S.Ag", role: "Guru PAI", image: "galeri-prestasi.jpg", subject: "Pendidikan Agama Islam" },
  // Data Tambahan untuk demo layout
  { id: 5, name: "Ahmad Fauzi, S.Pd", role: "Guru Matematika", image: "galeri-shalat.jpg", subject: "Matematika & SAINS" },
  { id: 6, name: "Dewi Sartika, S.Pd", role: "Guru B. Inggris", image: "galeri-maulid.jpg", subject: "Bahasa Inggris" },
  { id: 7, name: "Ujang Solihin", role: "Staff Tata Usaha", image: "galeri-prestasi.jpg", subject: "Administrasi" },
  { id: 8, name: "Nurul Hidayah, S.Pd", role: "Guru Kelas 2", image: "galeri-shalat.jpg", subject: "Tematik" },
];

export const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    title: "Siswa MI Al-Hasani Juara 1 Tahfidz Quran Tingkat Kota",
    category: "Prestasi",
    date: "12 Oktober 2023",
    image: "galeri-prestasi.jpg",
    excerpt: "Alhamdulillah, ananda Ahmad berhasil meraih juara pertama dalam lomba Tahfidz...",
  },
  {
    id: 2,
    title: "Kegiatan Shalat Dhuha Berjamaah Rutin",
    category: "Kegiatan",
    date: "10 Oktober 2023",
    image: "galeri-shalat.jpg",
    excerpt: "Pembiasaan shalat Dhuha setiap pagi sebelum KBM dimulai untuk membentuk karakter...",
  },
  {
    id: 3,
    title: "Penerimaan Peserta Didik Baru (PPDB) 2024",
    category: "Pengumuman",
    date: "01 Oktober 2023",
    image: "galeri-maulid.jpg",
    excerpt: "Telah dibuka pendaftaran siswa baru tahun ajaran 2024/2025. Segera daftar...",
  },
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 1,
    title: "Upacara Kemerdekaan RI",
    category: "Acara",
    imageUrl: "galeri-prestasi.jpg"
  },
  {
    id: 2,
    title: "Praktik Manasik Haji Cilik",
    category: "Kegiatan",
    imageUrl: "galeri-shalat.jpg"
  },
  {
    id: 3,
    title: "Juara Umum Porseni",
    category: "Prestasi",
    imageUrl: "galeri-prestasi.jpg"
  },
  {
    id: 4,
    title: "Kegiatan Pramuka",
    category: "Ekskul",
    imageUrl: "galeri-maulid.jpg"
  },
  {
    id: 5,
    title: "Peringatan Maulid Nabi",
    category: "Religi",
    imageUrl: "galeri-maulid.jpg"
  },
  {
    id: 6,
    title: "Kunjungan Edukatif Museum",
    category: "Kegiatan",
    imageUrl: "galeri-shalat.jpg"
  }
];
