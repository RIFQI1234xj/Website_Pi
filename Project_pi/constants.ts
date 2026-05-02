import { GalleryItem, NewsItem, Teacher } from "./types";

export const TEACHERS: Teacher[] = [
  { id: 1, name: "Eneng Heti Nurhayati, S.Pd.I", role: "Kepala Sekolah", image: "https://picsum.photos/200/200?random=1", subject: "Manajemen Sekolah" },
  { id: 2, name: "Siti Aminah, S.Pd", role: "Guru Kelas 1", image: "https://picsum.photos/200/200?random=2", subject: "Tematik" },
  { id: 3, name: "Budi Santoso, S.Pd", role: "Guru PJOK", image: "https://picsum.photos/200/200?random=3", subject: "Pendidikan Jasmani" },
  { id: 4, name: "Rina Wati, S.Ag", role: "Guru PAI", image: "https://picsum.photos/200/200?random=4", subject: "Pendidikan Agama Islam" },
  // Data Tambahan untuk demo layout
  { id: 5, name: "Ahmad Fauzi, S.Pd", role: "Guru Matematika", image: "https://picsum.photos/200/200?random=5", subject: "Matematika & SAINS" },
  { id: 6, name: "Dewi Sartika, S.Pd", role: "Guru B. Inggris", image: "https://picsum.photos/200/200?random=6", subject: "Bahasa Inggris" },
  { id: 7, name: "Ujang Solihin", role: "Staff Tata Usaha", image: "https://picsum.photos/200/200?random=7", subject: "Administrasi" },
  { id: 8, name: "Nurul Hidayah, S.Pd", role: "Guru Kelas 2", image: "https://picsum.photos/200/200?random=8", subject: "Tematik" },
];

export const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    title: "Siswa MI Al-Hasani Juara 1 Tahfidz Quran Tingkat Kota",
    category: "Prestasi",
    date: "12 Oktober 2023",
    image: "https://picsum.photos/600/400?random=10",
    excerpt: "Alhamdulillah, ananda Ahmad berhasil meraih juara pertama dalam lomba Tahfidz...",
  },
  {
    id: 2,
    title: "Kegiatan Shalat Dhuha Berjamaah Rutin",
    category: "Kegiatan",
    date: "10 Oktober 2023",
    image: "https://picsum.photos/600/400?random=11",
    excerpt: "Pembiasaan shalat Dhuha setiap pagi sebelum KBM dimulai untuk membentuk karakter...",
  },
  {
    id: 3,
    title: "Penerimaan Peserta Didik Baru (PPDB) 2024",
    category: "Pengumuman",
    date: "01 Oktober 2023",
    image: "https://picsum.photos/600/400?random=12",
    excerpt: "Telah dibuka pendaftaran siswa baru tahun ajaran 2024/2025. Segera daftar...",
  },
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 1,
    title: "Upacara Kemerdekaan RI",
    category: "Acara",
    imageUrl: "https://picsum.photos/800/600?random=101"
  },
  {
    id: 2,
    title: "Praktik Manasik Haji Cilik",
    category: "Kegiatan",
    imageUrl: "https://picsum.photos/800/600?random=102"
  },
  {
    id: 3,
    title: "Juara Umum Porseni",
    category: "Prestasi",
    imageUrl: "https://picsum.photos/800/600?random=103"
  },
  {
    id: 4,
    title: "Kegiatan Pramuka",
    category: "Ekskul",
    imageUrl: "https://picsum.photos/800/600?random=104"
  },
  {
    id: 5,
    title: "Peringatan Maulid Nabi",
    category: "Religi",
    imageUrl: "https://picsum.photos/800/600?random=105"
  },
  {
    id: 6,
    title: "Kunjungan Edukatif Museum",
    category: "Kegiatan",
    imageUrl: "https://picsum.photos/800/600?random=106"
  }
];