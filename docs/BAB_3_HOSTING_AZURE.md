# BAB 3: IMPLEMENTASI DAN HOSTING

## 3.4 Hosting Aplikasi Menggunakan Cloud Computing

### 3.4.1 Pengenalan Microsoft Azure
Dalam implementasi sistem informasi sekolah MI Al-Hasani ini, proses peluncuran aplikasi (*deployment*) menggunakan layanan komputasi awan (*cloud computing*) dari **Microsoft Azure** (melalui program *Azure for Students*). Azure dipilih karena menyediakan infrastruktur *Platform as a Service* (PaaS) tingkat perusahaan yang sangat stabil.

Arsitektur *hosting* dibagi menjadi tiga komponen utama:
1. **Frontend (Antarmuka):** Di-*hosting* menggunakan **Azure Static Web Apps** yang dioptimalkan untuk aplikasi React.
2. **Backend (Logika & API):** Di-*hosting* menggunakan **Azure App Service (Linux)** khusus lingkungan PHP 8.x.
3. **Database (Penyimpanan):** Menggunakan **Azure Database for MySQL** yang aman dan terkelola secara otomatis.

### 3.4.2 Persiapan Lingkungan Deployment
Sebelum proses *hosting* dilakukan, beberapa persiapan wajib telah diselesaikan:
- Mengamankan akun Microsoft Azure dengan saldo *Azure for Students*.
- Mengunggah kode sumber (*source code*) Frontend dan Backend ke repositori GitHub.
- Memastikan file `.env` diubah ke mode produksi (`APP_ENV=production`, `APP_DEBUG=false`).

### 3.4.3 Langkah-Langkah Hosting Database (MySQL)
Database adalah komponen pertama yang harus disiapkan agar *backend* dapat langsung terhubung saat diluncurkan.

1. Buka Azure Portal, cari dan pilih layanan **Azure Database for MySQL - Flexible Server**.
2. Klik **Create**, lalu pilih paket *Burstable* (B1s) untuk mengoptimalkan penggunaan kredit mahasiswa.
3. Masukkan detail server seperti Nama Server, Admin Username, dan Password yang kuat.
4. Pada tab *Networking*, pastikan untuk mencentang **Allow public access from any Azure service within Azure to this server** agar *backend* bisa mengaksesnya.
5. Klik **Review + Create**.

> **[SCREENSHOT: Halaman form pembuatan Azure Database for MySQL yang berisi nama server dan pengaturan komputasi]**

### 3.4.4 Langkah-Langkah Hosting Backend (Laravel)
Setelah *database* siap, langkah selanjutnya adalah meluncurkan API *Backend* Laravel.

1. Buka Azure Portal, cari layanan **App Service**, lalu klik **Create -> Web App**.
2. Isi formulir pembuatan:
   - **Publish:** Code
   - **Runtime stack:** PHP 8.x
   - **Operating System:** Linux
   - **Pricing Plan:** Basic (B1)
3. Klik **Review + Create** untuk membuat App Service.

> **[SCREENSHOT: Halaman pembuatan App Service dengan pilihan Runtime PHP 8.x]**

4. Setelah App Service tercipta, masuk ke menu **Settings > Environment variables**.
5. Tambahkan variabel-variabel lingkungan dari file `.env` Laravel Anda, antara lain:
   - `APP_ENV` = `production`
   - `APP_URL` = `https://<nama-app-service>.azurewebsites.net`
   - `DB_CONNECTION` = `mysql`
   - `DB_HOST` = `<nama-server-mysql>.mysql.database.azure.com`
   - `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (sesuai yang dibuat di tahap 3.4.3)
   
> **[SCREENSHOT: Tabel Environment Variables (App Settings) di dalam menu konfigurasi App Service]**

6. Masuk ke menu **Deployment Center**, pilih **GitHub** sebagai sumber (*source*).
7. Pilih repositori Backend Anda, dan biarkan Azure secara otomatis membuat file alur kerja (*workflow*) *GitHub Actions* untuk mem-*build* dan menyalin kode Laravel Anda ke *server*.

> **[SCREENSHOT: Pengaturan GitHub Action di halaman Deployment Center App Service]**

### 3.4.5 Langkah-Langkah Hosting Frontend (React)
Langkah terakhir adalah meluncurkan antarmuka pengguna (React) agar bisa diakses oleh wali murid dan masyarakat.

1. Di Azure Portal, buat sumber daya baru dan cari **Static Web Apps**.
2. Isi formulir konfigurasi:
   - **Plan type:** Free (Gratis)
   - **Deployment details:** Pilih GitHub dan hubungkan ke repositori Frontend Anda.
   - **Build Presets:** React
   - **App location:** `/` (atau `Project_pi` jika berada di dalam folder)
   - **Output location:** `dist`

> **[SCREENSHOT: Form pembuatan Static Web Apps yang terhubung ke repositori GitHub]**

3. Klik **Review + Create**. Azure akan otomatis mengirimkan *GitHub Actions* ke repositori Anda untuk melakukan kompilasi Vite/React.
4. Pastikan untuk mengubah variabel `VITE_API_BASE_URL` di Frontend Anda agar mengarah ke alamat URL App Service (Backend) yang didapat dari tahap 3.4.4.

> **[SCREENSHOT: Halaman GitHub Actions yang menampilkan proses build & deploy warna hijau (berhasil)]**

### 3.4.6 Konfigurasi Domain Kustom dan CORS
Agar sistem berjalan dengan lancar dan terlihat profesional:

1. **Konfigurasi CORS:** Pada sistem Backend (Laravel), URL dari *Static Web Apps* (Frontend) ditambahkan ke dalam daftar putih (*whitelist*) di pengaturan CORS agar akses pengambilan data tidak diblokir oleh *browser*.
2. **Domain Kustom:** Mendaftarkan nama domain resmi sekolah (misalnya `.sch.id` atau `.me` dari Namecheap) dan menghubungkannya ke *Static Web Apps* melalui menu **Custom domains** di Azure.

> **[SCREENSHOT: Halaman menu Custom Domains di Azure Static Web Apps yang menunjukkan status 'Ready']**

---
*Catatan Implementasi: Pendekatan menggunakan layanan PaaS (App Service dan Static Web Apps) ini tidak hanya mempercepat proses peluncuran, tetapi juga memastikan aplikasi sekolah dapat ditangani (scaling) dan dikelola dengan standar keamanan dari Microsoft Azure.*
