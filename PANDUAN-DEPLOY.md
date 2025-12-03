# 🚀 PANDUAN LENGKAP DEPLOY APLIKASI

## 📁 STRUKTUR PROJECT ANDA

```
tubes dari ai/
├── client/                 → FRONTEND (React + Vite)
├── compro-backend-master/  → BACKEND (Node.js + Express)
├── package.json            → Config frontend
└── .env                    → Environment variables
```

---

## 🎯 RENCANA DEPLOYMENT

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (React)  →  Vercel          (GRATIS)              │
│  BACKEND (Node.js) →  Railway/Render  (GRATIS / $5/bulan)   │
│  DATABASE (MongoDB)→  MongoDB Atlas   (GRATIS 512MB)        │
└─────────────────────────────────────────────────────────────┘
```

---

# TAHAP 1: SETUP DATABASE (MongoDB Atlas)

## Langkah 1.1: Buat Akun MongoDB Atlas
1. Buka https://www.mongodb.com/cloud/atlas
2. Klik **"Try Free"**
3. Daftar dengan email atau Google account

## Langkah 1.2: Buat Cluster Gratis
1. Pilih **"Build a Database"**
2. Pilih **"M0 FREE"** (Shared - Free forever)
3. Pilih region: **Singapore** (terdekat dengan Indonesia)
4. Cluster name: `mahasiswa-cluster` (atau bebas)
5. Klik **"Create Cluster"**

## Langkah 1.3: Setup Database Access
1. Di sidebar kiri, klik **"Database Access"**
2. Klik **"Add New Database User"**
3. Isi:
   - Username: `admin` (atau bebas)
   - Password: `passwordkuat123` (catat ini!)
   - Role: **"Read and write to any database"**
4. Klik **"Add User"**

## Langkah 1.4: Setup Network Access
1. Di sidebar kiri, klik **"Network Access"**
2. Klik **"Add IP Address"**
3. Klik **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Klik **"Confirm"**

## Langkah 1.5: Dapatkan Connection String
1. Kembali ke **"Database"** di sidebar
2. Klik **"Connect"** pada cluster Anda
3. Pilih **"Connect your application"**
4. Copy connection string, formatnya seperti ini:
   ```
   mongodb+srv://admin:Afandi02@mahasiswa-cluster.e2i6rhf.mongodb.net/?appName=mahasiswa-cluster
   ```
5. Ganti `<password>` dengan password yang Anda buat tadi
6. Tambahkan nama database di URL:
   ```
   mongodb+srv://admin:passwordkuat123@mahasiswa-cluster.xxxxx.mongodb.net/mahasiswa_db?retryWrites=true&w=majority
   ```

**⚠️ SIMPAN URL INI! Akan digunakan nanti.**

---

# TAHAP 2: PERSIAPAN CODE UNTUK PRODUCTION

## Langkah 2.1: Update Environment Variables Backend

Buat file `.env.production` di folder `compro-backend-master/`:

```env
PORT=5001
MONGO_URI=mongodb+srv://admin:PASSWORD_ANDA@cluster.xxxxx.mongodb.net/mahasiswa_db?retryWrites=true&w=majority
JWT_SECRET=rahasia_super_aman_untuk_production_2024_random_string_panjang
NODE_ENV=production
GEMINI_API_KEY=AIzaSyDolFEygS8Xb5Z8SXUbcRq4CYVUsjjHuu0
```

## Langkah 2.2: Update API URL di Frontend

Edit file `client/lib/api-config.ts`:

```typescript
// Ganti baris ini:
export const API_BASE_URL = 'http://localhost:5001/api';

// Menjadi:
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
```

## Langkah 2.3: Tambahkan Start Script di Backend

Edit file `compro-backend-master/package.json`, tambahkan script:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

---

# TAHAP 3: DEPLOY BACKEND KE RAILWAY

## Langkah 3.1: Persiapkan Repository
1. Buka https://github.com dan login
2. Klik **"New repository"**
3. Nama: `compro-backend` (atau bebas)
4. Visibility: **Public** atau **Private**
5. Klik **"Create repository"**

## Langkah 3.2: Upload Backend ke GitHub

Buka terminal di folder `compro-backend-master/`:

```powershell
cd "e:\semester 7\compro\tubes dari ai\compro-backend-master"

# Inisialisasi git
git init

# Buat .gitignore
echo "node_modules/`n.env`n.env.local" | Out-File -Encoding utf8 .gitignore

# Tambahkan semua file
git add .
git commit -m "Initial commit - backend"

# Hubungkan ke GitHub (ganti USERNAME dengan username GitHub Anda)
git branch -M main
git remote add origin https://github.com/USERNAME/compro-backend.git
git push -u origin main
```

## Langkah 3.3: Deploy ke Railway
1. Buka https://railway.app
2. Login dengan **GitHub**
3. Klik **"New Project"**
4. Pilih **"Deploy from GitHub repo"**
5. Pilih repository `compro-backend`
6. Railway akan otomatis detect Node.js

## Langkah 3.4: Set Environment Variables di Railway
1. Klik project yang baru dibuat
2. Klik tab **"Variables"**
3. Tambahkan variable berikut (klik "New Variable" untuk setiap variable):

   | Variable | Value |
   |----------|-------|
   | `PORT` | `5001` |
   | `MONGO_URI` | `mongodb+srv://admin:xxx@cluster.mongodb.net/mahasiswa_db?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `rahasia_super_aman_untuk_production_2024` |
   | `NODE_ENV` | `production` |
   | `GEMINI_API_KEY` | `AIzaSyDolFEygS8Xb5Z8SXUbcRq4CYVUsjjHuu0` |

4. Railway akan auto-redeploy

## Langkah 3.5: Dapatkan URL Backend
1. Klik tab **"Settings"**
2. Scroll ke **"Domains"**
3. Klik **"Generate Domain"**
4. Anda akan dapat URL seperti: `compro-backend-production-68cf.up.railway.app`

**⚠️ SIMPAN URL INI! Akan digunakan di frontend.**

---

# TAHAP 4: DEPLOY FRONTEND KE VERCEL

## Langkah 4.1: Persiapkan Frontend Repository

Buat repository baru untuk frontend:

```powershell
cd "e:\semester 7\compro\tubes dari ai"

# Buat folder khusus frontend untuk deploy
mkdir deploy-frontend
Copy-Item -Path "client/*" -Destination "deploy-frontend/" -Recurse
Copy-Item -Path "package.json" -Destination "deploy-frontend/"
Copy-Item -Path "vite.config.ts" -Destination "deploy-frontend/"
Copy-Item -Path "tsconfig.json" -Destination "deploy-frontend/"
Copy-Item -Path "tailwind.config.ts" -Destination "deploy-frontend/"
Copy-Item -Path "postcss.config.js" -Destination "deploy-frontend/"
Copy-Item -Path "index.html" -Destination "deploy-frontend/"

cd deploy-frontend
```

Atau cara lebih mudah - upload seluruh folder `tubes dari ai` sebagai satu repo.

## Langkah 4.2: Upload ke GitHub

```powershell
cd "e:\semester 7\compro\tubes dari ai"

git init
echo "node_modules/`n.env`n.env.local`ndist/" | Out-File -Encoding utf8 .gitignore
git add .
git commit -m "Initial commit - fullstack app"
git branch -M main
git remote add origin https://github.com/USERNAME/compro-frontend.git
git push -u origin main
```

## Langkah 4.3: Deploy ke Vercel
1. Buka https://vercel.com
2. Login dengan **GitHub**
3. Klik **"New Project"**
4. Import repository `compro-frontend`
5. Vercel akan detect sebagai Vite project

## Langkah 4.4: Konfigurasi Build Settings
Di halaman deploy, set:

- **Framework Preset**: Vite
- **Build Command**: `npm run build` atau `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` atau `pnpm install`

## Langkah 4.5: Set Environment Variables
Klik **"Environment Variables"** dan tambahkan:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://compro-backend-production.up.railway.app/api` |

(Gunakan URL backend dari Railway yang Anda dapat di Tahap 3.5)

## Langkah 4.6: Deploy
1. Klik **"Deploy"**
2. Tunggu proses build selesai
3. Anda akan dapat URL seperti: `https://compro-frontend.vercel.app`

---

# TAHAP 5: IMPORT DATA KE DATABASE

## Langkah 5.1: Install MongoDB Tools (jika belum ada)
Download dari: https://www.mongodb.com/try/download/database-tools

## Langkah 5.2: Import Data JSON

Anda punya data di folder `compro-backend-master/data_json/`. Untuk import:

### Opsi A: Melalui MongoDB Compass (GUI - Lebih Mudah)
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Buka dan paste connection string MongoDB Atlas
3. Connect
4. Klik database `mahasiswa_db`
5. Untuk setiap collection, klik **"Add Data"** > **"Import File"**
6. Pilih file JSON yang sesuai

### Opsi B: Melalui Script (di aplikasi Anda)
Jika ada file `seed.js`, jalankan setelah backend terdeploy:
```bash
node seed.js
```

---

# TAHAP 6: TESTING APLIKASI

## Langkah 6.1: Test Backend
Buka browser dan akses:
- `https://YOUR-BACKEND-URL.railway.app` → Harus muncul "API Mahasiswa Backend is running..."
- `https://YOUR-BACKEND-URL.railway.app/api-docs` → Swagger documentation

## Langkah 6.2: Test Frontend
Buka browser dan akses:
- `https://YOUR-FRONTEND-URL.vercel.app`
- Coba login dan test semua fitur

---

# 📋 CHECKLIST FILE YANG PERLU DIUBAH/DIBUAT

## Backend (`compro-backend-master/`)
- [x] `package.json` - Pastikan ada script `"start": "node index.js"`
- [x] `.gitignore` - Tambahkan `node_modules/`, `.env`
- [ ] `.env` - JANGAN di-upload ke GitHub (masukkan di Railway)

## Frontend (`client/` atau root folder)
- [x] `client/lib/api-config.ts` - Update API_BASE_URL menggunakan env variable
- [ ] `.env.production` - Buat file dengan `VITE_API_URL`

---

# 🔧 TROUBLESHOOTING

## Error: "Application Error" di Railway
- Cek logs di Railway dashboard
- Pastikan semua environment variables sudah diset
- Pastikan `package.json` punya script `start`

## Error: "CORS" di Frontend
Tambahkan di backend `index.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

## Error: "MongoDB Connection Failed"
- Pastikan IP `0.0.0.0/0` sudah ditambahkan di Network Access MongoDB Atlas
- Cek connection string sudah benar
- Cek password tidak ada karakter spesial yang perlu di-encode

---

# 🎉 SELESAI!

Setelah semua langkah selesai, aplikasi Anda akan live di:
- **Frontend**: `https://nama-project.vercel.app`
- **Backend**: `https://nama-project.up.railway.app`
- **Database**: MongoDB Atlas (cloud)

**Total Biaya: GRATIS** (selama dalam limit free tier)

---

# 📞 BUTUH BANTUAN?

Jika ada langkah yang bingung, silakan tanyakan!
