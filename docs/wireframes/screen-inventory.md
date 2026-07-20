# Screen Inventory — Sistem Informasi Profil Sekolah dan PPDB MI Al-Hasani

Tanggal Analisis: 14 Juli 2026  
Sumber: Implementasi aktual frontend (React/Vite) dan backend (Laravel 11)

---

## RINGKASAN PROYEK

**Frontend:** React + TypeScript + Vite (`Project_pi/`)  
**Backend:** Laravel 11 + Sanctum + SQLite (`mialhasani-backend/`)  
**Autentikasi:** Laravel Sanctum (token-based), disimpan di localStorage  
**Data PPDB:** Disimpan di localStorage browser (bukan database backend)  
**Router:** React Router v6 (BrowserRouter)

---

## DAFTAR HALAMAN

### A. ANTARMUKA PENGUNJUNG (Publik)

---

### 01 — Beranda

| Atribut | Detail |
|---|---|
| **URL / Route** | `/` |
| **Komponen Sumber** | `pages/Home.tsx` |
| **Jenis Pengguna** | Pengunjung |
| **Fungsi Utama** | Landing page utama sistem informasi sekolah |
| **Data Ditampilkan** | Profil singkat sekolah (dari `school_settings`), berita terbaru (dari `news`), program unggulan (dari `programs`), galeri (dari `galleries`), info kontak, hero images |
| **Tindakan Pengguna** | Klik menu navigasi, klik tombol menuju PPDB, klik berita untuk detail, scroll antar seksi |
| **Catatan** | Navbar: Beranda, Profil, Program, Berita, Galeri, PPDB, Kontak. Konten hero dapat dikonfigurasi via `school_settings` |

---

### 02 — Profil Sekolah

| Atribut | Detail |
|---|---|
| **URL / Route** | `/profil` (hash: `#identitas`, `#sejarah`, `#visi-misi`, `#kepala-sekolah`, `#guru`, `#fasilitas`) |
| **Komponen Sumber** | `pages/Profile.tsx` |
| **Jenis Pengguna** | Pengunjung |
| **Fungsi Utama** | Menampilkan informasi lengkap profil sekolah dengan tab navigasi |
| **Data Ditampilkan** | Identitas sekolah (school_name, npsn, email, phone, address, postal_code, school_status, accreditation, established_year), sejarah, visi misi, profil kepala sekolah (name, role, message, image dari tabel `principals`), data guru (name, role, subject, image dari tabel `teachers`), fasilitas |
| **Tindakan Pengguna** | Klik tab (Identitas, Sejarah, Visi Misi, Kepala Sekolah, Guru, Fasilitas) |

---

### 03 — Daftar Berita

| Atribut | Detail |
|---|---|
| **URL / Route** | `/berita` |
| **Komponen Sumber** | `pages/News.tsx` |
| **Jenis Pengguna** | Pengunjung |
| **Fungsi Utama** | Menampilkan daftar seluruh berita dan artikel |
| **Data Ditampilkan** | `news.title`, `news.category`, `news.date`, `news.image`, `news.excerpt` |
| **Tindakan Pengguna** | Klik berita untuk menuju halaman detail |
| **Catatan** | Kategori: Prestasi, Kegiatan, Pengumuman, Artikel Islami |

---

### 04 — Detail Berita

| Atribut | Detail |
|---|---|
| **URL / Route** | `/berita/:newsId` |
| **Komponen Sumber** | `pages/NewsDetail.tsx` |
| **Jenis Pengguna** | Pengunjung |
| **Fungsi Utama** | Menampilkan isi lengkap satu berita |
| **Data Ditampilkan** | `news.title`, `news.category`, `news.date`, `news.author`, `news.image`, `news.content`, berita terkait |
| **Tindakan Pengguna** | Tombol kembali ke daftar berita, klik berita terkait |
| **Catatan** | Tidak terdapat tombol bagikan di implementasi aktual |

---

### 05 — Galeri

| Atribut | Detail |
|---|---|
| **URL / Route** | `/galeri` |
| **Komponen Sumber** | `pages/Gallery.tsx` |
| **Jenis Pengguna** | Pengunjung |
| **Fungsi Utama** | Menampilkan daftar foto galeri dengan filter kategori |
| **Data Ditampilkan** | `galleries.title`, `galleries.category`, `galleries.image`, `galleries.description` |
| **Tindakan Pengguna** | Filter berdasarkan kategori, klik foto untuk detail galeri |

---

### 06 — Informasi PPDB

| Atribut | Detail |
|---|---|
| **URL / Route** | `/ppdb` |
| **Komponen Sumber** | `pages/PPDBGuide.tsx` |
| **Jenis Pengguna** | Pengunjung |
| **Fungsi Utama** | Menampilkan panduan, persyaratan, alur pendaftaran, dan status PPDB |
| **Data Ditampilkan** | Status PPDB (is_open dari `ppdb_settings`), tahun ajaran, alur 4 langkah, dokumen yang dibutuhkan (KK dan Akta) |
| **Tindakan Pengguna** | Centang persetujuan syarat, klik "Daftar Sekarang", lihat modal alur pendaftaran, lihat modal syarat & ketentuan |
| **Catatan** | Tombol Daftar Sekarang hanya aktif jika PPDB dibuka DAN pengguna mencentang persetujuan |

---

### 07 — Formulir Pendaftaran PPDB

| Atribut | Detail |
|---|---|
| **URL / Route** | `/ppdb/daftar` |
| **Komponen Sumber** | `pages/PPDBForm.tsx` |
| **Jenis Pengguna** | Pengunjung |
| **Fungsi Utama** | Formulir pendaftaran calon peserta didik baru bertahap 4 langkah |
| **Data Diinput** | Langkah 1: studentName, birthPlace, birthDate, gender, address. Langkah 2: parentName, whatsappNumber. Langkah 3: kkFile (KK), aktaFile (Akta). Langkah 4: ringkasan semua data |
| **Tindakan Pengguna** | Isi formulir per langkah, navigasi Sebelumnya/Selanjutnya, upload dokumen, kirim pendaftaran |
| **Catatan** | Data disimpan di localStorage. Format file: JPG, PNG, PDF, maks 2MB |

---

### 08 — Pendaftaran Berhasil

| Atribut | Detail |
|---|---|
| **URL / Route** | `/ppdb/daftar` (modal overlay) |
| **Komponen Sumber** | `pages/PPDBForm.tsx` (showSuccess state) |
| **Jenis Pengguna** | Pengunjung |
| **Fungsi Utama** | Konfirmasi pendaftaran berhasil dengan nomor registrasi |
| **Data Ditampilkan** | Nomor registrasi (format: PPDB-2026-XXX), instruksi simpan nomor |
| **Tindakan Pengguna** | Klik "Kembali ke Halaman PPDB" |

---

### 09 — Kontak

| Atribut | Detail |
|---|---|
| **URL / Route** | `/kontak` |
| **Komponen Sumber** | `pages/Contact.tsx` |
| **Jenis Pengguna** | Pengunjung |
| **Fungsi Utama** | Menampilkan informasi kontak sekolah dan embed peta |
| **Data Ditampilkan** | school_name, address, phone, email, whatsapp_number, map_embed_url, facebook_url, instagram_url, youtube_url |
| **Tindakan Pengguna** | Klik tombol WhatsApp, klik media sosial, lihat peta embed |
| **Catatan** | Tidak terdapat formulir pengiriman pesan di implementasi aktual |

---

### B. ANTARMUKA ADMINISTRATOR (Dilindungi Autentikasi)

---

### 10 — Login Administrator

| Atribut | Detail |
|---|---|
| **URL / Route** | `/admin/login` |
| **Komponen Sumber** | `pages/admin/AdminLogin.tsx` |
| **Jenis Pengguna** | Administrator |
| **Fungsi Utama** | Autentikasi administrator ke sistem |
| **Data Diinput** | email, password |
| **Tindakan Pengguna** | Isi email dan kata sandi, klik Login |
| **Catatan** | API: POST `/api/login`. Token disimpan di localStorage. Redirect ke dashboard jika berhasil. |

---

### 11 — Dashboard Administrator

| Atribut | Detail |
|---|---|
| **URL / Route** | `/admin` |
| **Komponen Sumber** | `pages/admin/Dashboard.tsx` |
| **Jenis Pengguna** | Administrator |
| **Fungsi Utama** | Ringkasan statistik konten dan navigasi utama |
| **Data Ditampilkan** | Kartu: jumlah Tenaga Pendidik, jumlah Berita Tayang, jumlah Album Galeri. Diagram pie distribusi berita per kategori. |
| **Tindakan Pengguna** | Navigasi ke halaman admin lain melalui sidebar |
| **Catatan** | Dashboard TIDAK menampilkan statistik PPDB. Fokus pada konten sekolah. |

---

### 12 — Kelola Konten (Berita sebagai representatif)

| Atribut | Detail |
|---|---|
| **URL / Route** | `/admin/news` |
| **Komponen Sumber** | `pages/admin/AdminNews.tsx` |
| **Jenis Pengguna** | Administrator |
| **Fungsi Utama** | CRUD berita dan artikel sekolah |
| **Data Ditampilkan** | Tabel: title, category, date, author, gambar. Pencarian berdasarkan judul/kategori. |
| **Tindakan Pengguna** | Tambah berita, edit berita, hapus berita (modal konfirmasi), cari berita |

---

### 13 — Formulir Tambah/Edit Berita

| Atribut | Detail |
|---|---|
| **URL / Route** | `/admin/news` (modal overlay) |
| **Komponen Sumber** | `pages/admin/AdminNews.tsx` (showModal state) |
| **Jenis Pengguna** | Administrator |
| **Fungsi Utama** | Form input data berita baru atau edit berita yang ada |
| **Data Diinput** | title, category (Prestasi/Kegiatan/Pengumuman/Artikel Islami), content, date, author, image |
| **Tindakan Pengguna** | Isi form, upload gambar, klik Simpan atau Batal |
| **Catatan** | excerpt tidak diinput manual — dibuat otomatis dari 120 karakter pertama content |

---

### 14 — Data Pendaftar PPDB

| Atribut | Detail |
|---|---|
| **URL / Route** | `/admin/ppdb` |
| **Komponen Sumber** | `pages/admin/AdminPPDB.tsx` |
| **Jenis Pengguna** | Administrator |
| **Fungsi Utama** | Mengelola data pendaftar PPDB dan konfigurasi sistem PPDB |
| **Data Ditampilkan** | Statistik (total, pending, approved, rejected), tabel: id (no. registrasi), studentName, parentName, submittedAt, status |
| **Tindakan Pengguna** | Pencarian, filter status, filter tahun ajaran, klik Detail, hapus, ekspor CSV, refresh data |
| **Catatan** | Data dari localStorage. Konfigurasi PPDB dari API backend. |

---

### 15 — Detail dan Verifikasi Pendaftar

| Atribut | Detail |
|---|---|
| **URL / Route** | `/admin/ppdb` (panel detail) |
| **Komponen Sumber** | `pages/admin/AdminPPDB.tsx` (showDetail state) |
| **Jenis Pengguna** | Administrator |
| **Fungsi Utama** | Melihat detail lengkap pendaftar dan mengubah status verifikasi |
| **Data Ditampilkan** | id, studentName, birthPlace, birthDate, gender, address, parentName, whatsappNumber, kkFileName, aktaFileName, status, submittedAt, tahunAjaran |
| **Tindakan Pengguna** | Lihat dokumen KK, lihat akta kelahiran, ubah status Diterima/Ditolak, hubungi via WhatsApp, cetak bukti |
| **Catatan** | Tidak ada field catatan administrator. Status: pending/approved/rejected |

---

### 16 — Pengaturan PPDB

| Atribut | Detail |
|---|---|
| **URL / Route** | `/admin/ppdb` (panel konfigurasi di bagian atas) |
| **Komponen Sumber** | `pages/admin/AdminPPDB.tsx` (Config Panel) |
| **Jenis Pengguna** | Administrator |
| **Fungsi Utama** | Mengatur status buka/tutup PPDB |
| **Data Diinput** | tahun_ajaran (read-only, otomatis), is_open (toggle) |
| **Tindakan Pengguna** | Toggle status buka/tutup, klik Simpan Konfigurasi |
| **Catatan** | Merupakan bagian dari halaman AdminPPDB, bukan halaman terpisah. Tidak ada field tanggal mulai/selesai atau kuota. |

---

### 17 — Pengaturan Sekolah

| Atribut | Detail |
|---|---|
| **URL / Route** | `/admin/settings` |
| **Komponen Sumber** | `pages/admin/AdminSettings.tsx` |
| **Jenis Pengguna** | Administrator |
| **Fungsi Utama** | Mengelola seluruh identitas dan pengaturan informasi sekolah |
| **Data Diinput** | school_name, npsn, email, phone, whatsapp_number, website, address, postal_code, school_status, accreditation, established_year, welcome_title, welcome_highlight, welcome_tagline_1/2/3, hero_images, map_embed_url, map_link, facebook_url, instagram_url, youtube_url, twitter_url |
| **Tindakan Pengguna** | Edit semua field, upload/hapus hero images, klik Simpan Pengaturan |
| **Catatan** | Tidak ada field visi/misi di AdminSettings. Hero_images mendukung upload multiple. |

---

## PERBEDAAN YANG DITEMUKAN

1. **PPDB Storage:** Data pendaftar disimpan di localStorage (bukan database Laravel)
2. **Pengaturan PPDB:** Tidak ada tanggal mulai/selesai dan kuota — hanya toggle buka/tutup
3. **Kontak:** Tidak ada formulir pesan — hanya info kontak statis
4. **Dashboard:** Tidak menampilkan statistik PPDB — hanya statistik konten
5. **Detail Pendaftar:** Tidak ada field catatan/komentar administrator

---

## MODEL DATA RINGKASAN

| Tabel | Field Utama |
|---|---|
| `users` | id, name, email, password |
| `news` | id, title, category, image, excerpt, content, author, date |
| `teachers` | id, name, role, description, image, order, subject |
| `programs` | id, title, description, image, category, schedule, is_active |
| `galleries` | id, title, category, image, description |
| `principals` | id, name, role, image, message |
| `school_settings` | id, school_name, npsn, email, phone, whatsapp_number, website, address, postal_code, school_status, accreditation, established_year, welcome_title, welcome_highlight, welcome_tagline_1-3, hero_images, map_embed_url, map_link, facebook_url, instagram_url, youtube_url, twitter_url |
| `ppdb_settings` | id, tahun_ajaran, is_open |
| `ppdb_applicants` | (localStorage) id, tahunAjaran, studentName, birthPlace, birthDate, gender, address, parentName, whatsappNumber, kkFileName, aktaFileName, status, submittedAt |
