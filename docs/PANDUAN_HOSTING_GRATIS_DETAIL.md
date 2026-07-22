# PANDUAN DETAIL HOSTING GRATIS (AIVEN + RENDER + VERCEL)

## TAHAP 1: Membuat Database MySQL (Aiven)
1. Buka browser dan akses **[console.aiven.io](https://console.aiven.io)**. Daftar atau masuk menggunakan akun Google/GitHub Anda.
2. Di halaman utama, klik tombol biru **Create service** (Buat layanan).
3. Pilih logo **MySQL**.
4. Di bagian *Cloud provider*, biarkan bawaan (misal Google Cloud).
5. **SANGAT PENTING:** Pada bagian *Service plan* (Paket Layanan), klik dan pilih **Free Plan** ($0).
6. Di bagian *Service name*, beri nama layanannya (misal: `mialhasani-db`), lalu klik tombol **Create free service**.
7. Tunggu sekitar 5 menit sampai lampu indikator layanannya berubah menjadi hijau (Aktif).
8. Setelah aktif, klik layanan tersebut. Di halaman *Overview*, cari bagian **Connection Information**.
9. Pilih **General** pada *dropdown* pilihan koneksinya.
📸 **[AMBIL SCREENSHOT DI SINI UNTUK BAB 3: Halaman parameter koneksi database MySQL pada portal Aiven]**
10. Biarkan halaman Aiven ini terbuka karena kita akan butuh menyalin isinya (Host, Port, User, Password) ke Render di Tahap 2.

---

## TAHAP 2: Membuat Server Backend Laravel (Render)
*Catatan: Pastikan Anda sudah melakukan Push kode terbaru (termasuk file Dockerfile) ke GitHub.*

1. Buka tab baru dan akses **[dashboard.render.com](https://dashboard.render.com)**. Masuk menggunakan akun GitHub Anda.
2. Klik tombol **New +** di pojok kanan atas, lalu pilih **Web Service**.
3. Pilih opsi **Build and deploy from a Git repository**, lalu klik Next.
4. Hubungkan dengan repositori GitHub `Website_Pi` Anda dan klik **Connect**.
5. Isi pengaturan halamannya dengan teliti:
   - **Name**: `api-mialhasani` (Ini akan menjadi link backend Anda).
   - **Region**: Singapore (atau yang terdekat dari Indonesia).
   - **Branch**: `main`
   - **Root Directory**: ketik `mialhasani-backend` (Sangat Penting!).
   - **Environment**: pilih `Docker` (Sangat Penting!).
   - **Instance Type**: Pastikan Anda mengeklik opsi **Free** ($0/month).
6. *Scroll* ke bagian paling bawah, klik menu **Environment Variables**, lalu klik **Add Environment Variable**. Masukkan data-data berikut satu per satu:
   - `APP_ENV` = `production`
   - `APP_KEY` = `base64:9nuL0N67lD9yhdxy1MQmGL3v61VloZv4llUJRhhgOm0=`
   - `DB_CONNECTION` = `mysql`
   - `DB_HOST` = *(Salin/Copy dari baris 'Host' di halaman Aiven tadi)*
   - `DB_PORT` = *(Salin/Copy dari baris 'Port' di Aiven)*
   - `DB_DATABASE` = `defaultdb` *(Nama database bawaan dari Aiven)*
   - `DB_USERNAME` = *(Salin/Copy dari baris 'User' di Aiven)*
   - `DB_PASSWORD` = *(Salin/Copy dari baris 'Password' di Aiven)*
📸 **[AMBIL SCREENSHOT DI SINI UNTUK BAB 3: Halaman pengaturan Environment Variables pada portal Render]**
7. Jika 8 data tersebut sudah lengkap, klik tombol **Create Web Service** di paling bawah.
8. Render akan mulai memproses *deploy*. Tunggu 5-10 menit sampai muncul tulisan **Live** (berwarna hijau) di pojok kiri atas log.

---

## TAHAP 3: Menjalankan Migrasi Database (Remote dari Laptop)
*Karena Render baru saja membatasi fitur Shell untuk pengguna gratis, kita akan melakukan trik cerdas: meremote database Aiven langsung dari laptop Anda!*

1. Buka VSCode di laptop Anda.
2. Buka file `.env` di dalam folder `mialhasani-backend`.
3. Ubah pengaturan database di file `.env` tersebut menggunakan data dari Aiven:
   - `DB_HOST` = *(Isi dengan Host Aiven)*
   - `DB_PORT` = *(Isi dengan Port Aiven)*
   - `DB_DATABASE` = `defaultdb`
   - `DB_USERNAME` = `avnadmin`
   - `DB_PASSWORD` = *(Isi dengan Password Aiven)*
4. Buka terminal di VSCode (pastikan posisinya di dalam folder `mialhasani-backend`).
5. Ketik perintah ini dan tekan Enter: `php artisan migrate --force`
6. Ketik perintah ini dan tekan Enter: `php artisan db:seed --force`
📸 **[AMBIL SCREENSHOT DI SINI UNTUK BAB 3: Tepat saat terminal VSCode Anda memunculkan teks hijau (sukses) setelah menjalankan perintah di atas]**
*(Jika semuanya berhasil, Backend dan Database Anda sudah 100% online!).*

---

## TAHAP 4: Menghubungkan Frontend React (Vercel)
1. Buka **[vercel.com](https://vercel.com)** dan masuk dengan GitHub.
2. Klik tombol **Add New...** lalu pilih **Project**.
3. Cari repositori `Website_Pi`, lalu klik tombol **Import**.
4. Di bagian konfigurasi Vercel:
   - **Project Name**: `mialhasani-sekolah` (atau terserah Anda).
   - **Framework Preset**: Biarkan otomatis (Vite).
   - **Root Directory**: Klik tulisan *Edit*, lalu pilih folder `Project_pi`.
5. Buka bagian **Environment Variables** (tepat di bawah Root Directory), lalu masukkan data berikut:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: *(Isi dengan URL web Render Anda ditambah /api, contoh: https://api-mialhasani.onrender.com/api)*
   - Lalu klik tombol **Add**.
📸 **[AMBIL SCREENSHOT DI SINI UNTUK BAB 3: Form penambahan Environment Variables di Vercel sebelum proses Deploy]**
6. Klik tombol biru **Deploy**.
7. Tunggu hingga layar menampilkan kembang api (berhasil). Klik tombol **Continue to Dashboard** lalu klik tombol **Visit**.
📸 **[AMBIL SCREENSHOT DI SINI UNTUK BAB 3: Tampilan halaman utama website yang telah berhasil diakses secara online melalui URL Vercel]**
