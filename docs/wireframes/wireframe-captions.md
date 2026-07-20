# Wireframe Captions — Bab III Perancangan Antarmuka
## Sistem Informasi Profil Sekolah dan PPDB MI Al-Hasani

Dokumen ini berisi keterangan resmi (caption) untuk setiap wireframe yang digunakan sebagai lampiran pada Bab III Perancangan Antarmuka dalam laporan akademik.

---

## A. ANTARMUKA PENGUNJUNG (Publik)

---

**Gambar 3.1 — Wireframe Halaman Beranda**
> Halaman utama (*landing page*) sistem informasi MI Al-Hasani yang dapat diakses oleh pengunjung umum tanpa autentikasi. Terdiri dari komponen navigasi atas (*navbar*) berisi tautan ke semua halaman, seksi *hero* dengan gambar slideshow yang dapat dikonfigurasi, profil singkat sekolah, program unggulan dalam format *card grid*, berita terbaru, galeri foto kegiatan, dan informasi kontak. Semua konten bersifat dinamis dan diambil dari API backend melalui *endpoint* `/api/school-settings`, `/api/news`, `/api/programs`, dan `/api/galleries`.
>
> **File:** `docs/wireframes/png/01-beranda.png` | **Route:** `/` | **Komponen:** `Home.tsx`

---

**Gambar 3.2 — Wireframe Halaman Profil Sekolah**
> Halaman profil sekolah yang menampilkan informasi lengkap tentang MI Al-Hasani melalui sistem tab navigasi berbasis *URL hash*. Tab yang tersedia meliputi: Identitas Sekolah (data dari tabel `school_settings`), Sejarah, Visi & Misi, Kepala Sekolah (data dari tabel `principals`), Tenaga Pendidik (data dari tabel `teachers`), dan Fasilitas (konten statis). Wireframe ini menampilkan kondisi tab Identitas Sekolah dalam keadaan aktif.
>
> **File:** `docs/wireframes/png/02-profil-sekolah.png` | **Route:** `/profil` | **Komponen:** `Profile.tsx`

---

**Gambar 3.3 — Wireframe Halaman Daftar Berita**
> Halaman yang menampilkan seluruh berita dan artikel yang diterbitkan oleh sekolah dalam format *grid card*. Setiap kartu berita menampilkan: gambar (*news.image*), kategori (*news.category*), tanggal (*news.date*), judul (*news.title*), dan ringkasan otomatis (*news.excerpt*). Terdapat panel filter kategori di sisi kanan (Semua, Kegiatan, Prestasi, Pengumuman, Artikel Islami) serta daftar berita populer. Data bersumber dari API `/api/news`.
>
> **File:** `docs/wireframes/png/03-daftar-berita.png` | **Route:** `/berita` | **Komponen:** `News.tsx`

---

**Gambar 3.4 — Wireframe Halaman Detail Berita**
> Halaman yang menampilkan isi lengkap satu berita setelah pengguna mengklik salah satu berita dari daftar. Menampilkan: kategori, tanggal, nama penulis, gambar utama berukuran penuh, dan konten teks berita (*news.content*) secara lengkap. Di bagian bawah ditampilkan berita terkait, sementara *sidebar* menampilkan daftar berita terbaru dan pilihan kategori. Tidak terdapat fitur berbagi berita di implementasi aktual.
>
> **File:** `docs/wireframes/png/04-detail-berita.png` | **Route:** `/berita/:newsId` | **Komponen:** `NewsDetail.tsx`

---

**Gambar 3.5 — Wireframe Halaman Galeri**
> Halaman galeri kegiatan sekolah yang menampilkan foto-foto dokumentasi dalam format *grid* 4 kolom. Setiap item galeri menampilkan foto utama (*galleries.image*), judul (*galleries.title*), kategori, dan deskripsi singkat. Terdapat panel filter kategori di bagian atas halaman untuk menyaring foto berdasarkan kategori. Data bersumber dari API `/api/galleries`.
>
> **File:** `docs/wireframes/png/05-galeri.png` | **Route:** `/galeri` | **Komponen:** `Gallery.tsx`

---

**Gambar 3.6 — Wireframe Halaman Informasi PPDB**
> Halaman panduan Penerimaan Peserta Didik Baru (PPDB) yang menampilkan status sistem PPDB (buka/tutup berdasarkan `ppdb_settings.is_open`), alur pendaftaran 4 langkah, dokumen persyaratan (KK dan Akta Kelahiran), serta tautan brosur sekolah. Tombol "Daftar Sekarang" hanya aktif apabila sistem PPDB berstatus dibuka *dan* pengunjung telah mencentang kotak persetujuan syarat & ketentuan. Apabila PPDB ditutup, modal peringatan akan muncul secara otomatis.
>
> **File:** `docs/wireframes/png/06-informasi-ppdb.png` | **Route:** `/ppdb` | **Komponen:** `PPDBGuide.tsx`

---

**Gambar 3.7 — Wireframe Formulir Pendaftaran PPDB (4 Langkah)**
> Formulir pendaftaran calon peserta didik baru yang dirancang bertahap dalam 4 langkah berurutan. Langkah 1: Data Calon Siswa (nama, tempat lahir, tanggal lahir, jenis kelamin, alamat); Langkah 2: Data Orang Tua/Wali (nama, nomor WhatsApp); Langkah 3: Unggah Dokumen (KK dan Akta Kelahiran, format JPG/PNG/PDF, maks. 2MB, mendukung *drag & drop*); Langkah 4: Ringkasan dan konfirmasi pengiriman. Navigasi antar langkah menggunakan tombol Sebelumnya/Selanjutnya. Data formulir disimpan sementara di *localStorage* browser.
>
> **File:** `docs/wireframes/png/07-formulir-ppdb.png` | **Route:** `/ppdb/daftar` | **Komponen:** `PPDBForm.tsx`

---

**Gambar 3.8 — Wireframe Konfirmasi Pendaftaran Berhasil**
> Tampilan konfirmasi yang muncul sebagai *modal overlay* setelah pendaftar berhasil mengirimkan formulir. Menampilkan ikon sukses, pesan konfirmasi, dan nomor registrasi unik (format: PPDB-2026-XXX) yang dibuat secara otomatis oleh sistem berdasarkan data yang tersimpan di *localStorage*. Pendaftar diinstruksikan untuk menyimpan nomor registrasi tersebut sebagai bukti pendaftaran. Tombol "Kembali ke Halaman PPDB" mengarahkan pengguna ke halaman informasi PPDB.
>
> **File:** `docs/wireframes/png/08-pendaftaran-berhasil.png` | **Route:** `/ppdb/daftar` (modal) | **Komponen:** `PPDBForm.tsx`

---

**Gambar 3.9 — Wireframe Halaman Kontak**
> Halaman yang menyediakan informasi kontak lengkap MI Al-Hasani, meliputi alamat (*school_settings.address*, *postal_code*), nomor telepon (*phone*), nomor WhatsApp (*whatsapp_number*), email (*email*), dan tautan media sosial (Facebook, Instagram, YouTube). Terdapat peta lokasi sekolah yang ditampilkan melalui *embed Google Maps* (*map_embed_url*) beserta tautan untuk membuka peta di aplikasi Google Maps (*map_link*). Tidak terdapat formulir pengiriman pesan di implementasi aktual.
>
> **File:** `docs/wireframes/png/09-kontak.png` | **Route:** `/kontak` | **Komponen:** `Contact.tsx`

---

## B. ANTARMUKA ADMINISTRATOR (Dilindungi Autentikasi)

---

**Gambar 3.10 — Wireframe Halaman Login Administrator**
> Halaman autentikasi untuk mengakses panel administrasi. Menggunakan tata letak dua kolom: sisi kiri menampilkan ilustrasi/branding sekolah, sisi kanan menampilkan formulir login dengan kolom email dan kata sandi. Sistem menggunakan Laravel Sanctum untuk autentikasi berbasis *token*; setelah berhasil login, *token* disimpan di *localStorage* dan administrator diarahkan ke halaman *dashboard*. Apabila kredensial tidak valid, pesan kesalahan ditampilkan di atas formulir.
>
> **File:** `docs/wireframes/png/10-login-admin.png` | **Route:** `/admin/login` | **Komponen:** `AdminLogin.tsx`

---

**Gambar 3.11 — Wireframe Dashboard Administrator**
> Halaman ringkasan utama panel administrasi yang dapat diakses setelah login. Menampilkan tiga kartu statistik konten: jumlah Tenaga Pendidik, jumlah Berita Tayang, dan jumlah Album Galeri — semuanya diambil dari data database melalui API. Terdapat pula diagram lingkaran (*pie chart*) yang menggambarkan distribusi berita berdasarkan kategori dan tombol akses cepat ke halaman pengelolaan konten. *Dashboard* tidak menampilkan statistik PPDB; statistik tersebut tersedia di halaman PPDB Online. Navigasi sidebar berisi grup: Utama, Konten, Data Sekolah, dan Sistem.
>
> **File:** `docs/wireframes/png/11-dashboard-admin.png` | **Route:** `/admin` | **Komponen:** `Dashboard.tsx`

---

**Gambar 3.12 — Wireframe Halaman Kelola Konten (Berita & Artikel)**
> Halaman pengelolaan konten berita sekolah dengan pola CRUD (*Create, Read, Update, Delete*). Menampilkan tabel data berita yang berisi kolom: gambar thumbnail, judul, kategori, tanggal, penulis, dan tombol aksi (Edit/Hapus). Tersedia kolom pencarian untuk menyaring berita berdasarkan judul atau kategori. Tombol "Tambah Berita" di pojok kanan atas membuka modal formulir. Konfirmasi penghapusan ditampilkan melalui modal dialog. Pola antarmuka CRUD yang sama diterapkan pada halaman Galeri Foto, Program Sekolah, dan Data Guru.
>
> **File:** `docs/wireframes/png/12-kelola-konten.png` | **Route:** `/admin/news` | **Komponen:** `AdminNews.tsx`

---

**Gambar 3.13 — Wireframe Formulir Tambah/Edit Berita**
> Modal formulir untuk menambahkan berita baru atau mengedit berita yang sudah ada. Formulir ditampilkan sebagai *overlay* di atas halaman daftar berita. Field yang tersedia: judul (*title*), kategori (pilihan: Prestasi/Kegiatan/Pengumuman/Artikel Islami), tanggal publikasi (*date*), nama penulis (*author*, default: Admin), area teks konten (*content*), dan unggah gambar (*image*, format JPG/JPEG/PNG). Field *excerpt* tidak diisi manual — dibuat secara otomatis dari 120 karakter pertama konten.
>
> **File:** `docs/wireframes/png/13-form-konten.png` | **Route:** `/admin/news` (modal) | **Komponen:** `AdminNews.tsx`

---

**Gambar 3.14 — Wireframe Halaman Data Pendaftar PPDB**
> Halaman pengelolaan data PPDB yang mencakup panel konfigurasi sistem dan tabel data pendaftar. Panel konfigurasi (bagian atas) memungkinkan administrator mengubah status buka/tutup PPDB. Empat kartu statistik menampilkan jumlah total pendaftar, serta rincian berdasarkan status: Menunggu Verifikasi, Diterima, dan Ditolak. Tabel data pendaftar memuat kolom: nomor registrasi, nama calon siswa, nama orang tua, tanggal pendaftaran, tahun ajaran, status, dan tombol aksi (Detail/Hapus). Tersedia fungsi pencarian, filter status, filter tahun ajaran, ekspor CSV, dan cetak laporan. Data pendaftar bersumber dari *localStorage* browser.
>
> **File:** `docs/wireframes/png/14-data-pendaftar.png` | **Route:** `/admin/ppdb` | **Komponen:** `AdminPPDB.tsx`

---

**Gambar 3.15 — Wireframe Halaman Detail dan Verifikasi Pendaftar**
> Halaman detail yang menampilkan seluruh informasi satu pendaftar PPDB dan memungkinkan administrator melakukan verifikasi. Menampilkan: nomor registrasi, data calon siswa (nama, tempat/tanggal lahir, jenis kelamin, alamat), data orang tua (nama, nomor WhatsApp), pratinjau dokumen persyaratan (KK dan Akta Kelahiran dari *localStorage*), serta status verifikasi saat ini. Administrator dapat mengubah status melalui tombol "Diterima" (*approved*) atau "Ditolak" (*rejected*), menghubungi orang tua melalui WhatsApp, atau mencetak bukti pendaftaran. Tidak terdapat field catatan administrator di implementasi aktual.
>
> **File:** `docs/wireframes/png/15-verifikasi-pendaftar.png` | **Route:** `/admin/ppdb` (panel detail) | **Komponen:** `AdminPPDB.tsx`

---

**Gambar 3.16 — Wireframe Halaman Pengaturan PPDB**
> Antarmuka konfigurasi sistem PPDB yang merupakan bagian dari halaman PPDB Online. Administrator dapat mengubah status pendaftaran (buka/tutup) melalui *toggle switch* yang memperbarui nilai `ppdb_settings.is_open` di database melalui API. Tahun ajaran diisi secara otomatis berdasarkan kalender dan tidak dapat diedit secara manual. Perubahan konfigurasi ini berdampak langsung pada antarmuka pengunjung: status PPDB yang ditampilkan, keaktifan tombol pendaftaran, dan aksesibilitas halaman formulir. Tidak terdapat field tanggal mulai/selesai pendaftaran atau kuota di implementasi aktual.
>
> **File:** `docs/wireframes/png/16-pengaturan-ppdb.png` | **Route:** `/admin/ppdb` (panel konfigurasi) | **Komponen:** `AdminPPDB.tsx`

---

**Gambar 3.17 — Wireframe Halaman Pengaturan Sekolah**
> Halaman pengelolaan seluruh data identitas dan konfigurasi sekolah yang akan ditampilkan di halaman publik. Pengaturan dikelompokkan menjadi beberapa seksi: Identitas Sekolah (nama, NPSN, status, akreditasi, tahun berdiri), Kontak & Lokasi (email, telepon, WhatsApp, website, alamat, kode pos, *embed* peta), Konten Beranda (teks sambutan: *welcome_title*, *welcome_highlight*, *welcome_tagline_1-3*), Gambar Hero (mendukung unggah banyak gambar, *hero_images*), dan Media Sosial (Facebook, Instagram, YouTube, Twitter). Semua perubahan disimpan melalui API `PUT /api/school-settings`. Data visi dan misi sekolah tidak dapat diedit melalui halaman ini.
>
> **File:** `docs/wireframes/png/17-pengaturan-sekolah.png` | **Route:** `/admin/settings` | **Komponen:** `AdminSettings.tsx`

---

## CATATAN PERANCANGAN

1. **Prinsip Desain**: Semua wireframe menggunakan gaya *low-fidelity* monokrom (hitam, putih, abu-abu) dengan resolusi 1600×1000 piksel, sesuai standar perancangan antarmuka untuk laporan akademik.
2. **Placeholder**: Elemen gambar ditampilkan sebagai kotak dengan tanda silang diagonal. Teks data ditampilkan dalam kurung siku `[field_name]` untuk mengidentifikasi sumber data dari model.
3. **Konsistensi Layout**: Halaman publik menggunakan *navbar* horizontal di bagian atas dan *footer* di bagian bawah. Halaman administrator menggunakan *sidebar* navigasi di sisi kiri dengan konten utama di sisi kanan.
4. **Implementasi Aktual vs. Ekspektasi**: Beberapa perbedaan antara implementasi aktual dan ekspektasi umum sistem PPDB telah didokumentasikan. Wireframe mencerminkan implementasi aktual, bukan ekspektasi.
