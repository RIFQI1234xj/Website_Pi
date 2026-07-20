# Panduan Screenshot untuk Bab 3 - Hosting Azure

Dokumen ini menunjukkan **urutan dan lokasi screenshot** yang harus diambil selama proses hosting.

---

## BAGIAN 1: STATIC WEB APPS (FRONTEND)

### Screenshot 1: Azure Portal Login Page
**Lokasi**: https://portal.azure.com
**Deskripsi**: Menunjukkan halaman login Azure Portal
**Kebutuhan untuk**: Membuktikan akses ke Azure Portal
**Catatan**: Bisa blur email untuk privacy

```
Tangkap:
- Halaman login dengan logo Azure
- Email yang digunakan (bisa di-blur)
```

---

### Screenshot 2: Create Static Web Apps Resource
**Lokasi**: Azure Portal > Create a resource > Search "Static Web Apps"
**Deskripsi**: Menunjukkan halaman marketplace mencari Static Web Apps
**Kebutuhan untuk**: Menunjukkan langkah awal pembuatan resource

```
Tangkap:
- Search bar dengan "Static Web Apps"
- Hasil pencarian yang menunjukkan Static Web Apps option
- Tombol "Create"
```

---

### Screenshot 3: Static Web Apps Configuration Form
**Lokasi**: Create Static Web Apps > Basics tab
**Deskripsi**: Form konfigurasi resource dengan detail yang sudah diisi
**Kebutuhan untuk**: Menunjukkan parameter yang benar

```
Tangkap:
- Subscription selection
- Resource Group: website-pi-resources
- Name: website-pi-frontend
- Plan type: Free
- Deployment details section (boleh di-scroll untuk menunjukkan semua)

Highlight dengan circles/arrows:
- Source: GitHub
- Organization: RIFQI1234xj
- Repository: Website_Pi
- Branch: main
- Build Presets: React
- App location: Project_pi
- Output location: dist
```

---

### Screenshot 4: Review + Create Page
**Lokasi**: Create Static Web Apps > Review + Create tab
**Deskripsi**: Review configuration sebelum deployment
**Kebutuhan untuk**: Konfirmasi semua setting sudah benar

```
Tangkap:
- Summary dari semua configuration
- Tombol "Create" di bawah
```

---

### Screenshot 5: GitHub Action Workflow Created
**Lokasi**: GitHub Repository > Actions tab
**Deskripsi**: Menunjukkan GitHub Action yang dibuat otomatis
**Kebutuhan untuk**: Membuktikan CI/CD setup otomatis

```
Tangkap:
- Actions tab di GitHub
- Workflow yang sedang running/completed
- Name: "Azure Static Web Apps CI/CD" atau sejenis
- Status: Success ✓

Highlight:
- Branch: main
- Trigger reason: push
```

---

### Screenshot 6: Deployment Success
**Lokasi**: GitHub Actions > Workflow > Build and Deploy Job
**Deskripsi**: Menunjukkan deployment berhasil
**Kebutuhan untuk**: Konfirmasi deploy sukses

```
Tangkap:
- Job logs
- Highlight bagian yang menunjukkan:
  - "npm install"
  - "npm run build"
  - "Build successfully created"
  - Status: Completed ✓
```

---

### Screenshot 7: Live URL di Azure Portal
**Lokasi**: Azure Portal > Static Web Apps > Overview
**Deskripsi**: Menunjukkan aplikasi sudah live dengan URL
**Kebutuhan untuk**: Menunjukkan hasil akhir - aplikasi accessible

```
Tangkap:
- Static Web Apps Overview page
- URL: https://<random>.azurestaticapps.net

Highlight:
- Resource name: website-pi-frontend
- Status: Running
- URL yang live (bisa klik untuk test)
```

---

### Screenshot 8: Live Application Running
**Lokasi**: Akses URL dari screenshot sebelumnya
**Deskripsi**: Menunjukkan aplikasi frontend sudah accessible
**Kebutuhan untuk**: Membuktikan aplikasi berjalan dengan baik

```
Tangkap:
- Browser address bar dengan URL Azure
- Homepage aplikasi Website PI yang loaded dengan baik
- Beberapa section (navbar, hero, etc.)
```

---

## BAGIAN 2: APP SERVICE (BACKEND)

### Screenshot 9: Create App Service Resource
**Lokasi**: Azure Portal > Create a resource > Search "App Service"
**Deskripsi**: Menunjukkan pemilihan App Service
**Kebutuhan untuk**: Menunjukkan langkah awal backend

```
Tangkap:
- Search bar dengan "App Service"
- App Service option di hasil
- Tombol "Create"
```

---

### Screenshot 10: App Service Configuration Form
**Lokasi**: Create App Service > Basics tab
**Deskripsi**: Form konfigurasi App Service
**Kebutuhan untuk**: Menunjukkan parameter backend

```
Tangkap:
- Subscription
- Resource Group: website-pi-resources
- Name: website-pi-backend
- Publish: Code
- Runtime stack: PHP 8.1
- Operating System: Linux
- Region: Southeast Asia

Highlight dengan box/arrow:
- Runtime stack selection
- Region selection
```

---

### Screenshot 11: Create PostgreSQL Database
**Lokasi**: Azure Portal > Create a resource > Search "PostgreSQL"
**Deskripsi**: Menunjukkan pemilihan PostgreSQL
**Kebutuhan untuk**: Menunjukkan database setup

```
Tangkap:
- Search result untuk "Azure Database for PostgreSQL"
- Option untuk "Single Server" atau "Flexible Server"
- Tombol "Create"
```

---

### Screenshot 12: PostgreSQL Configuration Form
**Lokasi**: Create PostgreSQL > Basics tab
**Deskripsi**: Konfigurasi database
**Kebutuhan untuk**: Menunjukkan database parameter

```
Tangkap:
- Server name: website-pi-db
- Admin username: adminuser
- Password: (blur atau show dots)
- Region: Southeast Asia
- Pricing tier: Basic

Highlight:
- Server configuration details
```

---

### Screenshot 13: PostgreSQL Connection Strings
**Lokasi**: PostgreSQL Resource > Connection strings
**Deskripsi**: Menunjukkan connection string untuk Laravel
**Kebutuhan untuk**: Menunjukkan data untuk .env file

```
Tangkap:
- Connection strings tab
- PHP connection string (highlight/box)
- Database connection parameters:
  - Host
  - Database
  - Username

Important: BLUR atau REPLACE password dengan ••••••••
```

---

### Screenshot 14: App Service Configuration Settings
**Lokasi**: App Service > Configuration
**Deskripsi**: Application settings yang sudah dikonfigurasi
**Kebutuhan untuk**: Menunjukkan environment variables

```
Tangkap:
- Configuration page
- Application settings list dengan:
  - APP_ENV = production
  - APP_DEBUG = false
  - DB_CONNECTION = pgsql
  - DB_HOST = ...
  - DB_PORT = 5432
  
Highlight:
- Database related settings
- Scroll untuk menunjukkan semua settings

Important: BLUR sensitive values seperti:
- APP_KEY
- DB_PASSWORD
```

---

### Screenshot 15: App Service Save Settings
**Lokasi**: App Service > Configuration > Save button
**Deskripsi**: Konfirmasi save settings
**Kebutuhan untuk**: Menunjukkan settings sudah disimpan

```
Tangkap:
- Notification di top yang menunjukkan "Settings saved successfully"
- atau toast message
```

---

### Screenshot 16: App Service Deployment Center
**Lokasi**: App Service > Deployment center
**Deskripsi**: Setup GitHub deployment
**Kebutuhan untuk**: Menunjukkan CI/CD untuk backend

```
Tangkap:
- Deployment center page
- Source: GitHub selected
- Organization: RIFQI1234xj
- Repository: Website_Pi
- Branch: main
- Tombol "Save"
```

---

### Screenshot 17: GitHub Action for Backend
**Lokasi**: GitHub Repository > Actions
**Deskripsi**: Workflow untuk backend deployment
**Kebutuhan untuk**: Menunjukkan automated deployment

```
Tangkap:
- Actions tab
- Workflow: "Build and deploy PHP app to Azure Web App"
- Status: Completed ✓
- Both jobs: build dan deploy completed

Highlight:
- Composer install step
- PHP version being used
- Deploy step
```

---

### Screenshot 18: App Service Overview with URL
**Lokasi**: App Service > Overview
**Deskripsi**: Backend aplikasi sudah live
**Kebutuhan untuk**: Menunjukkan backend URL

```
Tangkap:
- App Service Overview page
- URL: https://website-pi-backend.azurewebsites.net
- Status: Running

Highlight:
- Resource name
- Status indicator (green)
- URL yang bisa di-klik
```

---

### Screenshot 19: Backend API Health Check
**Lokasi**: Browser akses https://website-pi-backend.azurewebsites.net/api/school-settings
**Deskripsi**: Menunjukkan backend API responding
**Kebutuhan untuk**: Membuktikan backend berjalan

```
Tangkap:
- Browser address bar dengan URL
- JSON response dari API
- Atau health check response

Catatan: Jika menampilkan data sensitif, blur sesuai kebutuhan
```

---

## BAGIAN 3: INTEGRASI & TESTING

### Screenshot 20: Frontend Akses API Backend
**Lokasi**: Live Frontend Application > Console atau Network tab
**Deskripsi**: Menunjukkan frontend sukses akses backend
**Kebutuhan untuk**: Membuktikan komunikasi antar services

```
Tangkap:
- Browser dengan aplikasi frontend running
- DevTools > Network tab
- API calls ke backend (tampilkan 1-2 requests):
  - GET /api/school-settings
  - GET /api/teachers
  - Status: 200 OK

Highlight:
- Request URL menunjukkan backend URL
- Response status 200
```

---

### Screenshot 21: Application Insights
**Lokasi**: App Service > Application Insights
**Deskripsi**: Monitoring setup untuk backend
**Kebutuhan untuk**: Menunjukkan monitoring/logging

```
Tangkap:
- Application Insights page
- Dashboard menunjukkan:
  - Performance metrics
  - Request rate
  - Failed requests
  
Atau setup page jika baru enabled
```

---

### Screenshot 22: Database Backup Configuration
**Lokasi**: PostgreSQL > Backups
**Deskripsi**: Backup settings dikonfigurasi
**Kebutuhan untuk**: Menunjukkan data protection

```
Tangkap:
- Backups page
- Backup retention period: 7+ days
- Automatic backup status: Enabled
```

---

## Kesimpulan

**Total Screenshots yang Diperlukan**: 22

**Breakdown per bagian:**
- Bagian 1 (Frontend): 8 screenshots
- Bagian 2 (Backend): 10 screenshots
- Bagian 3 (Integrasi): 4 screenshots

**Tips saat mengambil screenshot:**

1. **Konsistensi Theme**: Gunakan light mode di Azure untuk consistency
2. **Resolution**: Min 1920x1080 untuk clarity
3. **Blur Sensitive Data**: 
   - Password
   - API Keys
   - Email addresses (optional)
   - Phone numbers
   - Internal IP addresses
4. **Annotate**: Tambahkan circles, arrows, atau text untuk highlight important elements
5. **Urutan**: Ikuti urutan di dokumen ini dari atas ke bawah

---

## Tool untuk Annotate Screenshots

Recommended tools:
- **Snagit** (Windows) - Built-in annotation tools
- **Greenshot** (Free) - Lightweight, good annotation
- **ShareX** (Free) - Powerful, customizable
- **Adobe Markup** / **Preview** (Mac) - Built-in
- **Paint 3D** (Windows) - Simple but effective

---

