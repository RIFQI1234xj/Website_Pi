# Azure Deployment Architecture Diagram

## System Architecture Setelah Deployment

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INTERNET / END USERS                             │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
        ┌────────────────────┴───────────────────────┐
        │                                             │
        ▼                                             ▼
┌──────────────────────┐               ┌──────────────────────┐
│   FRONTEND (SWA)     │               │   BACKEND (API)      │
│                      │               │                      │
│ Static Web Apps      │               │ App Service          │
│ URL: https://xxxx    │ ──HTTP/REST──▶│ URL: https://yyyy    │
│ .azurestaticapps.net │               │ .azurewebsites.net   │
│                      │               │                      │
│ - React/Vite app     │               │ - Laravel API        │
│ - CDN cached         │               │ - PHP 8.1            │
│ - Zero cost*         │               │ - Linux             │
└──────────────────────┘               │ - $50-70/month      │
                                       │                      │
                                       │  ┌────────────────┐  │
                                       │  │  PostgreSQL DB │  │
                                       │  │                │  │
                                       │  │ database=pi    │  │
                                       │  │ users/data     │  │
                                       │  │ $50-70/month   │  │
                                       │  └────────────────┘  │
                                       └──────────────────────┘

GitHub Action Pipeline:
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   git push  │───▶│ GitHub Build │───▶│ Auto Deploy  │
│  (trigger)  │    │  & Test CI   │    │  to Azure    │
└─────────────┘    └──────────────┘    └──────────────┘
```

---

## Deployment Flow Step-by-Step

```
┌─────────────────────────────────────────┐
│ 1. PREPARE GITHUB REPOSITORY            │
├─────────────────────────────────────────┤
│ • Push code ke main branch              │
│ • Create .env files                     │
│ • Commit & Push                         │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 2. CREATE AZURE RESOURCES               │
├─────────────────────────────────────────┤
│ • Static Web Apps (Frontend)            │
│   └─ Connect to GitHub                  │
│ • App Service (Backend)                 │
│   └─ Connect to GitHub                  │
│ • PostgreSQL Database                   │
│   └─ Setup backup & firewall            │
│ • App Service Config                    │
│   └─ Set environment variables          │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 3. GITHUB ACTIONS CI/CD                 │
├─────────────────────────────────────────┤
│ Frontend Pipeline:                      │
│ • npm install                           │
│ • npm run build                         │
│ • Deploy to Static Web Apps             │
│                                         │
│ Backend Pipeline:                       │
│ • composer install                      │
│ • Generate APP_KEY                      │
│ • Run php artisan commands              │
│ • Deploy to App Service                 │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 4. APPLICATIONS LIVE                    │
├─────────────────────────────────────────┤
│ Frontend:                               │
│ https://website-pi.azurestaticapps.net  │
│                                         │
│ Backend:                                │
│ https://website-pi.azurewebsites.net    │
│                                         │
│ Database: PostgreSQL (internal)         │
└─────────────────────────────────────────┘
```

---

## File Structure untuk Deployment

```
Website_Pi/ (GitHub Repository)
│
├── Project_pi/                  (Frontend)
│   ├── .env.example
│   ├── .env.production          (⭐ CREATE - untuk Azure)
│   ├── lib/
│   │   ├── api.ts               (⭐ UPDATE API_URL)
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── mialhasani-backend/          (Backend)
│   ├── .env                     (⭐ UPDATE untuk Azure)
│   ├── app/
│   ├── routes/
│   ├── composer.json
│   └── ...
│
├── .github/
│   ├── workflows/
│   │   ├── azure-static-web-apps-deploy.yml   (⭐ AUTO CREATED)
│   │   └── azure-app-service-deploy.yml       (⭐ AUTO CREATED)
│
└── docs/                        (📄 DOCUMENTATION)
    ├── BAB_3_HOSTING_AZURE.md                  (← FOR SKRIPSI)
    ├── AZURE_DEPLOYMENT_CONFIG.md
    ├── SCREENSHOT_GUIDE.md
    ├── QUICKSTART_AZURE.md
    └── azure-architecture.md                  (← THIS FILE)
```

---

## Environment Variables Reference

### Frontend (.env.production)
```
VITE_API_URL=https://website-pi-backend.azurewebsites.net/api
VITE_APP_NAME=Website PI Sekolah
NODE_ENV=production
```

### Backend (.env)
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://website-pi-backend.azurewebsites.net

DB_CONNECTION=pgsql
DB_HOST=website-pi-db.postgres.database.azure.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=adminuser@website-pi-db
DB_PASSWORD=••••••••••

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

---

## Resource Naming Convention

Untuk consistency, gunakan naming ini di Azure:

```
Project: website-pi

Resources:
├── Resource Group: website-pi-resources
├── Static Web Apps: website-pi-frontend
├── App Service: website-pi-backend
├── App Service Plan: website-pi-plan
├── PostgreSQL: website-pi-db
├── Key Vault: website-pi-vault (optional)
└── Application Insights: website-pi-insights (optional)

GitHub:
├── Organization: RIFQI1234xj
├── Repository: Website_Pi
├── Branch: main (production)
└── Branch: develop (optional - staging)
```

---

## Network Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        PUBLIC INTERNET                         │
└────────────────────────────────────────────────────────────────┘
                  │                            │
          (HTTPS - Port 443)            (HTTPS - Port 443)
                  │                            │
         ┌────────▼──────────┐        ┌───────▼────────────┐
         │  AZURE STATIC     │        │  AZURE APP SERVICE │
         │  WEB APPS (CDN)   │        │  (Linux Container) │
         │                   │        │                    │
         │ Region: Global    │        │ Region: SEA        │
         │ IP: Azure Edge    │        │ IP: Azure Compute  │
         └─────────┬─────────┘        └────────┬───────────┘
                   │                           │
                   │    (Internal Azure        │
                   │    Network - private)     │
                   │                           │
                   └─────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │  AZURE DATABASE FOR      │
                    │  POSTGRESQL (Private)    │
                    │                          │
                    │ Region: SEA              │
                    │ Firewall: App Service IP │
                    │ Backup: Enabled          │
                    └──────────────────────────┘

Security Features:
✓ HTTPS/SSL (auto-managed by Azure)
✓ Firewall (PostgreSQL blocks external access)
✓ CORS configured (Frontend ↔ Backend only)
✓ Database encrypted at rest
✓ Backups automated (7+ days retention)
```

---

## Performance Optimization

```
FRONTEND OPTIMIZATION
├── Static Web Apps CDN
│   ├── Global edge locations
│   ├── Zero Cold Start
│   ├── Automatic HTTPS
│   └── Built-in staging environments
│
└── Code Level
    ├── Vite bundling (optimized build)
    ├── Tree shaking
    ├── Code splitting
    └── Image optimization

BACKEND OPTIMIZATION
├── App Service Auto-scale (optional)
│   ├── CPU threshold: 80%
│   ├── Memory threshold: 85%
│   └── Scale-out: +1 to +3 instances
│
├── Database Optimization
│   ├── Connection pooling (PgBouncer)
│   ├── Query optimization
│   ├── Indexes on frequently accessed columns
│   └── Read replicas (optional - scale-up)
│
└── Caching Strategy
    ├── Laravel route cache
    ├── Config cache
    └── Application-level caching
```

---

## Monitoring & Alerting Setup

```
Application Insights
├── Exceptions & Failures
│   └── Alert if error rate > 1%
│
├── Performance
│   ├── Response time
│   ├── Server response time (target: < 500ms)
│   └── Dependency duration
│
├── Availability
│   ├── Health checks
│   ├── Synthetic monitors
│   └── Alert if down
│
└── Usage
    ├── Page views
    ├── Users
    └── Custom events
```

---

## Disaster Recovery

```
BACKUP STRATEGY

Frontend:
├── GitHub repository (source of truth)
├── Azure Static Web Apps (auto-deployed)
└── CDN cache (auto-restored on rebuild)

Backend:
├── GitHub repository (source code)
├── Azure App Service (auto-deployed)
└── PostgreSQL Backups:
    ├── Automatic daily backups
    ├── Retention: 7 days (configurable)
    ├── Geo-redundant (optional)
    └── Point-in-time restore available

Recovery Procedure:
1. Restore PostgreSQL from backup (point-in-time)
2. Re-deploy application (git push triggers CD)
3. Run migrations (php artisan migrate --force)
4. Clear cache (php artisan cache:clear)
```

---

## Cost Analysis

```
MONTHLY COST BREAKDOWN

Tier 1 - Development/Testing:
├── Static Web Apps: FREE ($0)
├── App Service: B1 ($50/month)
├── PostgreSQL: B-series ($50/month)
└── Total: ~$100/month

Tier 2 - Production:
├── Static Web Apps: Standard ($10/month)
├── App Service: S1 ($75/month)
├── PostgreSQL: GP-series ($200+/month)
└── Total: ~$300+/month

Tier 3 - High Traffic:
├── Static Web Apps: Standard ($10/month)
├── App Service: P1V2 ($150/month)
├── PostgreSQL: Multi-region ($500+/month)
├── Application Insights: ($5/month)
└── Total: ~$700+/month

Savings Tips:
✓ Use Free tier for Static Web Apps
✓ Start with B1 for App Service
✓ Use B-series for PostgreSQL testing
✓ Auto-scale (pay only for what you use)
✓ Reserved instances (30% discount)
```

---

## Checklist untuk Go-Live

```
PRE-DEPLOYMENT
☐ Kode sudah di-test locally
☐ Database schema sudah finalized
☐ Environment variables sudah disiapkan
☐ GitHub repository sudah public/private sesuai

DEPLOYMENT
☐ Static Web Apps resource dibuat & linked
☐ App Service resource dibuat & configured
☐ PostgreSQL database dibuat & accessible
☐ GitHub Actions workflows berjalan sukses
☐ Frontend accessible di Azure URL
☐ Backend API responding dengan baik

POST-DEPLOYMENT
☐ Frontend-Backend integrasi tested
☐ Database backups configured
☐ Application Insights enabled
☐ SSL/HTTPS verified (green lock)
☐ CORS errors resolved
☐ Custom domain (optional) configured
☐ Monitoring alerts setup
☐ Load testing (optional)

DOCUMENTATION
☐ Deployment steps documented
☐ Screenshots captured
☐ Environment variables documented (no secrets!)
☐ Troubleshooting guide written
☐ Team trained on deployment process
```

---

## Quick Reference Commands

```bash
# Generate Laravel APP_KEY
php artisan key:generate

# Run migrations on Azure (App Service Console)
php artisan migrate --force

# Clear caches on Azure
php artisan config:clear
php artisan route:clear
php artisan cache:clear

# Check Laravel version
php artisan --version

# List environment variables
env

# Test API endpoint
curl https://website-pi-backend.azurewebsites.net/api/school-settings

# Monitor deployment
git log --oneline -n 5
```

---

**Last Updated**: 2026-07-21
**Version**: 1.0
**Status**: ✅ Ready for Production

