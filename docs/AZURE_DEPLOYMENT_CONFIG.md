# Konfigurasi Azure Deployment - File Panduan

## File-File yang Perlu Dipersiapkan

### 1. Frontend - Project_pi/.env.production

Buat file `.env.production` di root folder Project_pi:

```env
VITE_API_URL=https://website-pi-backend.azurewebsites.net/api
VITE_APP_NAME=Website PI Sekolah
NODE_ENV=production
```

**Catatan**: File `.env.example` sudah ada di repository. Gunakan sebagai template.

---

### 2. Frontend - lib/api.ts

Pastikan file `lib/api.ts` sudah dikonfigurasi untuk development dan production:

```typescript
const isDevelopment = import.meta.env.DEV;

const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8000/api' 
  : import.meta.env.VITE_API_URL || 'https://website-pi-backend.azurewebsites.net/api';

// Gunakan API_BASE_URL dalam semua fetch/axios calls
```

---

### 3. Backend - mialhasani-backend/.env.production

Update konfigurasi production di file `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://website-pi-backend.azurewebsites.net
APP_KEY=base64:xxxxxxxxxxxxx  # Generate dengan: php artisan key:generate

DB_CONNECTION=pgsql
DB_HOST=website-pi-db.postgres.database.azure.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=adminuser@website-pi-db
DB_PASSWORD=YourSecurePassword123!

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file

CORS_ALLOWED_ORIGINS=https://<your-static-web-app>.azurestaticapps.net,https://yourdomain.com
```

---

### 4. Backend - mialhasani-backend/routes/api.php

Pastikan API routes tidak memerlukan authentication yang berlebihan:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    TeacherController,
    NewsController,
    GalleryController,
    ProgramController,
    PrincipalController,
    ApplicantController,
    SchoolSettingController,
    PpdbStatusController,
};

Route::middleware('api')->prefix('v1')->group(function () {
    // Public Routes
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/programs', [ProgramController::class, 'index']);
    Route::get('/principal', [PrincipalController::class, 'show']);
    Route::get('/school-settings', [SchoolSettingController::class, 'index']);
    
    // PPDB Routes
    Route::post('/ppdb/apply', [ApplicantController::class, 'store']);
    Route::get('/ppdb/status/{id}', [PpdbStatusController::class, 'show']);
    
    // Auth Routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    
    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::put('/teachers/{id}', [TeacherController::class, 'update']);
        Route::post('/news', [NewsController::class, 'store']);
        Route::put('/news/{id}', [NewsController::class, 'update']);
        Route::delete('/news/{id}', [NewsController::class, 'destroy']);
        // ... route proteksi lainnya
    });
});
```

---

### 5. GitHub Actions Workflow untuk Frontend

File: `.github/workflows/azure-static-web-apps-deploy.yml`

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
    paths:
      - 'Project_pi/**'
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "Project_pi"
          api_location: ""
          output_location: "dist"
          skip_app_build: false
          skip_api_build: true
          app_build_command: "npm install && npm run build"

      - name: Close Pull Request Job
        if: github.event_name == 'pull_request' && github.event.action == 'closed'
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

---

### 6. GitHub Actions Workflow untuk Backend

File: `.github/workflows/azure-app-service-deploy.yml`

```yaml
name: Build and deploy PHP app to Azure Web App

on:
  push:
    branches:
      - main
    paths:
      - 'mialhasani-backend/**'
  workflow_dispatch:

env:
  AZURE_WEBAPP_NAME: website-pi-backend
  AZURE_WEBAPP_PACKAGE_PATH: 'mialhasani-backend'
  PHP_VERSION: '8.1'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ env.PHP_VERSION }}
          extensions: mbstring,pgsql,pdo_pgsql
          tools: composer

      - name: Get composer cache directory
        id: composer-cache
        run: echo "dir=$(composer config cache-files-dir)" >> $GITHUB_OUTPUT

      - name: Cache composer dependencies
        uses: actions/cache@v3
        with:
          path: ${{ steps.composer-cache.outputs.dir }}
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Run composer install
        run: |
          cd ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
          composer install --no-interaction --prefer-dist --optimize-autoloader

      - name: Generate APP_KEY
        run: |
          cd ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
          php artisan key:generate --env=production

      - name: Prepare deployment
        run: |
          cd ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
          mkdir -p bootstrap/cache
          chmod -R 755 storage bootstrap/cache
          rm -rf node_modules

      - name: Upload artifact for deployment job
        uses: actions/upload-artifact@v3
        with:
          name: php-app
          path: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: 'Production'
      url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}

    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v3
        with:
          name: php-app

      - name: 'Deploy to Azure Web App'
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_APP_SERVICE_PUBLISH_PROFILE }}
          package: .

      - name: Run migrations
        run: |
          az webapp remote-build --resource-group website-pi-resources --name ${{ env.AZURE_WEBAPP_NAME }}
        env:
          AZURE_WEBAPP_PUBLISH_PROFILE: ${{ secrets.AZURE_APP_SERVICE_PUBLISH_PROFILE }}
```

---

## Langkah-Langkah Persiapan di GitHub

### 1. Setup Secrets di GitHub Repository

Pergi ke: Settings > Secrets and variables > Actions

**Tambahkan secrets berikut:**

#### Untuk Static Web Apps (Frontend):
- **AZURE_STATIC_WEB_APPS_API_TOKEN**: Copy dari Azure Portal setelah Static Web Apps resource dibuat

#### Untuk App Service (Backend):
- **AZURE_APP_SERVICE_PUBLISH_PROFILE**: Download dari Azure App Service > Deployment center

---

## Perintah-Perintah Penting

### Generate APP_KEY untuk Backend:
```bash
cd mialhasani-backend
php artisan key:generate
```

### Local Testing Sebelum Deploy:
```bash
# Frontend
cd Project_pi
npm install
npm run build
npm run dev

# Backend
cd mialhasani-backend
php artisan migrate
php artisan serve
```

### Clear Cache Setelah Deploy (di App Service Console):
```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

---

## Troubleshooting

### Frontend tidak bisa akses API:
- Cek CORS configuration di backend
- Verify API_URL sudah benar di `.env.production`
- Check browser console untuk error details

### Backend error 500:
- Check Application Insights logs
- Verify database connection string
- Run migrations dengan: `php artisan migrate --force`

### Database connection timeout:
- Verify firewall rules di Azure PostgreSQL
- Check VNet configuration
- Ensure DB_HOST includes `.postgres.database.azure.com`

---

