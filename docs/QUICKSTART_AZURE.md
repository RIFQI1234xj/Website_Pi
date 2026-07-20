# Quick Start Guide - Azure Deployment

Panduan cepat untuk deployment Website_Pi ke Azure dalam 30 menit.

---

## ⚡ Persiapan (5 menit)

### Checklist:
- [ ] Akun Azure sudah dibuat (https://azure.microsoft.com)
- [ ] Akun GitHub sudah login
- [ ] Repository Website_Pi sudah di-push ke GitHub (branch: main)
- [ ] VS Code + Azure Tools extension terinstall

---

## 🚀 Deployment Frontend (10 menit)

### Step 1: Buat Static Web Apps Resource
```
1. Portal Azure → Create a resource
2. Cari: "Static Web Apps"
3. Isi form:
   - Name: website-pi-frontend
   - Plan: Free
   - Source: GitHub
   - Auth, Org: RIFQI1234xj / Website_Pi / main
4. Build config:
   - App location: Project_pi
   - Output location: dist
5. Create → Tunggu ~2 menit
```

### Step 2: Verifikasi Deploy
```
1. GitHub → Actions
2. Tunggu workflow "Azure Static Web Apps CI/CD" selesai (✓)
3. Azure Portal → Static Web Apps → Overview
4. Copy URL: https://xxxxx.azurestaticapps.net
5. Buka di browser, aplikasi harus loading
```

✅ **Frontend Done!**

---

## 🔧 Deployment Backend (15 menit)

### Step 1: Buat App Service
```
1. Portal Azure → Create a resource
2. Cari: "App Service"
3. Isi form:
   - Name: website-pi-backend
   - Runtime: PHP 8.1
   - OS: Linux
   - Region: Southeast Asia
4. Create → Tunggu ~1 menit
```

### Step 2: Buat PostgreSQL Database
```
1. Portal Azure → Create a resource
2. Cari: "Azure Database for PostgreSQL"
3. Isi form:
   - Name: website-pi-db
   - Admin: adminuser
   - Password: BuatPassword123!
   - Region: Southeast Asia
4. Create → Tunggu ~3 menit
```

### Step 3: Ambil Connection String
```
1. Portal Azure → PostgreSQL Resource
2. Connection strings → Copy PHP connection string
3. Simpan somewhere (akan digunakan di step berikutnya)
```

### Step 4: Setup Environment Variables di App Service
```
1. Portal Azure → App Service → Configuration
2. Click "New application setting" dan tambahkan:

APP_ENV               production
APP_DEBUG             false
DB_CONNECTION         pgsql
DB_HOST              website-pi-db.postgres.database.azure.com
DB_PORT              5432
DB_DATABASE          postgres
DB_USERNAME          adminuser@website-pi-db
DB_PASSWORD          BuatPassword123!

3. Click "Save"
```

### Step 5: Setup GitHub Deployment
```
1. Portal Azure → App Service → Deployment center
2. Source: GitHub
3. Authorize → Auth dengan GitHub
4. Select: RIFQI1234xj / Website_Pi / main
5. Build: PHP / 8.1
6. Create workflow file otomatis
```

### Step 6: Verifikasi Deploy
```
1. GitHub → Actions
2. Tunggu workflow "Build and deploy PHP app" selesai (✓)
3. Azure Portal → App Service → Overview
4. Copy URL: https://website-pi-backend.azurewebsites.net
5. Test: curl https://website-pi-backend.azurewebsites.net/api/school-settings
```

✅ **Backend Done!**

---

## 🔗 Integrasi Frontend + Backend (5 menit)

### Update Frontend Environment

Edit file `Project_pi/.env.production`:
```
VITE_API_URL=https://website-pi-backend.azurewebsites.net/api
```

Update `Project_pi/lib/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL 
  || 'https://website-pi-backend.azurewebsites.net/api';
```

### Commit & Push ke GitHub
```bash
git add .
git commit -m "Configure production API URL for Azure"
git push origin main
```

→ GitHub Actions otomatis build & deploy frontend baru

### Test Integrasi
```
1. Buka https://xxxxx.azurestaticapps.net di browser
2. Buka DevTools (F12) → Network tab
3. Refresh page
4. Lihat network requests ke backend
5. Status harus 200 OK
```

✅ **Integrasi Done!**

---

## ✓ Final Checklist

- [ ] Frontend URL accessible dan aplikasi loading
- [ ] Backend URL accessible dan API responding (test dengan curl atau Postman)
- [ ] Frontend bisa fetch data dari backend (check Network tab di DevTools)
- [ ] Tidak ada CORS errors di console
- [ ] Database migrations sudah berjalan (check Application Insights logs)
- [ ] Static files (CSS, JS) loading correctly

---

## 🆘 Troubleshooting Cepat

### Frontend blank page / error
```
→ Check Azure Portal > Static Web Apps > Overview > URL
→ Check GitHub Actions logs
→ Rebuild: git push (trigger action)
```

### Backend API error 404/500
```
→ Check App Service > Logs stream
→ Check if environment variables saved (refresh page)
→ Check PostgreSQL connection
→ Run: php artisan migrate --force (via App Service console)
```

### CORS error di frontend
```
→ Update DB_HOST di App Service configuration
→ Restart App Service
→ Clear browser cache
```

### Frontend can't reach backend
```
→ Verify API_URL di .env.production
→ Check if backend service is running (Azure Portal)
→ Check Azure NSG/Firewall rules
```

---

## 📊 Biaya/Bulan

```
Static Web Apps (Frontend)    Gratis (tier Free)
App Service (Backend)        ~$50-70  (B1 - Basic)
PostgreSQL Database          ~$50-70  (Basic tier)
─────────────────────────────────────
Total                        ~$100-140/bulan
```

---

## 📚 Dokumen Lengkap

Untuk informasi lebih detail, lihat file-file lain di folder docs/:

1. **BAB_3_HOSTING_AZURE.md** 
   - Dokumentasi lengkap untuk skripsi
   - Penjelasan detail setiap step
   - Cocok untuk di-copy ke skripsi

2. **AZURE_DEPLOYMENT_CONFIG.md**
   - Konfigurasi file yang detail
   - GitHub Actions workflow complete
   - Environment variables documentation

3. **SCREENSHOT_GUIDE.md**
   - 22 screenshots yang perlu diambil
   - Lokasi dan detail setiap screenshot
   - Tips annotation

---

## 🎯 Sukses Indicators

✅ Semua selesai jika:

1. Buka https://xxxxx.azurestaticapps.net
   - Homepage loading dengan baik
   - Navbar, hero, content terlihat

2. Buka https://website-pi-backend.azurewebsites.net/api/teachers
   - JSON response terlihat (array guru)
   - Status 200 OK

3. Di aplikasi frontend, klik halaman Teachers/News/Gallery
   - Data loaded dari backend
   - No CORS errors

4. Check GitHub Actions
   - 2 workflows completed (frontend & backend)
   - Both status: ✓ Completed

---

**Waktu Estimasi Total: 30-45 menit**

Selamat! 🎉 Website_Pi Anda sudah live di Azure!

