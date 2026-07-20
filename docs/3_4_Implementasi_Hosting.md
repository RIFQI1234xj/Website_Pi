## 3.4 Implementasi Layanan Cloud Hosting (Microsoft Azure)

Pada tahapan ini, sistem informasi sekolah yang telah dibangun di lingkungan pengembang (*localhost*) diimplementasikan ke lingkungan produksi (*production*) agar dapat diakses secara publik melalui jaringan internet. Layanan komputasi awan (*cloud computing*) yang digunakan pada penelitian ini adalah Microsoft Azure melalui program *Azure for Students*. 

Penggunaan layanan *cloud* dipilih karena memiliki tingkat ketersediaan tinggi (*high availability*), skalabilitas yang baik, serta kemudahan dalam pengelolaan infrastruktur (*Platform as a Service*).

### 3.4.1 Spesifikasi Lingkungan Server
Kebutuhan infrastruktur awan yang dialokasikan pada Microsoft Azure untuk menjalankan sistem ini terdiri dari tiga komponen utama, yaitu:

1. **Layanan Basis Data (Database):** 
   Menggunakan *Azure Database for MySQL - Flexible Server* dengan spesifikasi komputasi tingkat *Burstable* (B1s). Layanan ini bertugas untuk menyimpan seluruh data operasional sekolah secara terpusat dan aman.
2. **Layanan Logika Sistem (Backend API):** 
   Menggunakan *Azure App Service* dengan sistem operasi Linux dan *runtime* PHP 8.x. Layanan ini berfungsi sebagai penyedia *Application Programming Interface* (API) yang menjembatani antara basis data dan antarmuka pengguna.
3. **Layanan Antarmuka (Frontend):** 
   Menggunakan *Azure Static Web Apps* edisi gratis (Free Tier) yang secara khusus dioptimalkan untuk mengeksekusi kerangka kerja (*framework*) React.js yang telah dikompilasi menggunakan Vite.

### 3.4.2 Tahapan Penyebaran (Deployment) Sistem
Proses penyebaran sistem ke lingkungan produksi dilakukan melalui beberapa tahapan sistematis untuk memastikan integritas data dan keamanan aplikasi.

#### A. Konfigurasi Basis Data (MySQL)
Langkah pertama adalah membangun fondasi data. Konfigurasi dilakukan melalui portal Azure dengan menetapkan nama peladen (*server*), kredensial administrator, dan aturan jaringan (*firewall rules*) agar *server* basis data dapat menerima koneksi dari layanan Azure lainnya.

> **[SCREENSHOT: Tampilan antarmuka pembuatan Azure Database for MySQL di Portal Azure]**

Setelah basis data terbentuk, sistem ORM (*Object-Relational Mapping*) dari kerangka kerja Laravel digunakan untuk melakukan migrasi struktur tabel ke dalam basis data produksi.

#### B. Penyebaran Layanan Backend (App Service)
Penyebaran *backend* dilakukan dengan mengintegrasikan repositori kontrol versi (GitHub) dengan *Azure App Service*. Proses ini memanfaatkan fitur integrasi dan pengiriman berkesinambungan (*Continuous Integration / Continuous Deployment* - CI/CD).

1. Sumber daya *App Service* dibuat dengan pengaturan *runtime* PHP 8.x.
> **[SCREENSHOT: Konfigurasi pembuatan App Service untuk lingkungan PHP]**

2. Variabel lingkungan (*Environment Variables*) diatur pada menu *Application Settings*. Variabel lokal seperti kredensial basis data dan mode pengembang (`APP_DEBUG=true`) disesuaikan menjadi mode produksi (`APP_ENV=production`).
> **[SCREENSHOT: Tampilan tabel Environment Variables pada menu konfigurasi App Service]**

3. Repositori *backend* dihubungkan melalui menu *Deployment Center*, yang secara otomatis memicu skrip *GitHub Actions* untuk melakukan instalasi dependensi (Composer) dan menyalin kode ke peladen Azure.
> **[SCREENSHOT: Halaman pengaturan Deployment Center yang terhubung ke GitHub]**

#### C. Penyebaran Layanan Frontend (Static Web Apps)
Penyebaran antarmuka pengguna (Frontend) merupakan tahap akhir dari proses *hosting*. Pendekatan yang sama (CI/CD) digunakan untuk mengotomatisasi proses kompilasi kode React.

1. Sumber daya *Static Web Apps* dikonfigurasi untuk menarik (*pull*) kode dari repositori *frontend* di GitHub.
> **[SCREENSHOT: Form pembuatan Static Web Apps dan pengaturan repositori]**

2. Pada tahap ini, variabel `VITE_API_BASE_URL` disesuaikan agar antarmuka mengarah ke URL (*Uniform Resource Locator*) dari *App Service Backend* yang telah dibuat pada tahap sebelumnya. Hal ini dilakukan agar aplikasi React dapat mengambil dan mengirim data melalui jaringan internet.
> **[SCREENSHOT: Halaman riwayat GitHub Actions yang menunjukkan proses kompilasi (build) React berhasil]**

### 3.4.3 Pengaturan Domain dan Keamanan Lintas Domain (CORS)
Untuk memastikan sistem dapat diakses secara profesional dan aman, dilakukan penyesuaian pada kebijakan *Cross-Origin Resource Sharing* (CORS) di sisi *backend*. Alamat URL publik dari *Azure Static Web Apps* dimasukkan ke dalam senarai putih (*whitelist*) pada konfigurasi CORS Laravel. Hal ini mencegah *browser* memblokir pertukaran data antar *domain* yang berbeda.

Sebagai penyempurnaan, alamat IP dari *Static Web Apps* dapat dihubungkan dengan nama *domain* kustom resmi sekolah melalui pengaturan *Custom Domains* di Azure Portal, sehingga sistem dapat diakses melalui alamat yang mudah diingat oleh masyarakat.

> **[SCREENSHOT: Halaman pengelolaan Custom Domains yang berstatus sukses (Ready) pada Azure]**
