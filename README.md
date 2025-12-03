# 🎓 COMPRO - Complete Academic Management System

Sistem manajemen akademik mahasiswa lengkap dengan frontend React dan backend Node.js yang terintegrasi dengan AI untuk rekomendasi mata kuliah.

## 🎯 Overview

COMPRO adalah aplikasi web full-stack yang membantu mahasiswa dalam:
- 📊 Monitoring data akademik real-time
- 🎯 Mendapatkan rekomendasi mata kuliah berbasis AI
- 📈 Simulasi prediksi IPK
- 📱 Interface yang user-friendly

## 🏗️ Arsitektur

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│                     │  HTTP   │                     │  API    │                     │
│    FRONTEND         │ ──────▶ │      BACKEND        │ ──────▶ │      DATABASE       │
│                     │  8080   │                     │  27017  │                     │
│  React + TypeScript │ ◀────── │   Node.js + API     │ ◀────── │      MongoDB        │
│  Tailwind + Vite    │         │   Express + JWT     │         │   + Docker          │
│                     │         │   + Gemini AI       │         │                     │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
        Port 8080                       Port 5001                      Port 27017
```

## 🚀 Setup Lengkap (Laptop Baru)

### 1. Prerequisites
```bash
#Install Docker Desktop
Download dari: https://www.docker.com/products/docker-desktop/

# Install Node.js v18+  
Download dari: https://nodejs.org/

# Install Git
Download dari: https://git-scm.com/
```

### 2. Clone/Download Project(kalau sudah silahkan di skip langkah ini)
```bash
# Jika dari Git
git clone <repository-url>
cd compro-project

# Atau ekstrak ZIP dan masuk ke folder
cd "semester 7/compro/backend frontend"
```

### 3. Setup Backend (15 menit)
```bash
# Masuk ke folder backend
cd compro-backend-master

# Start Docker containers (backend + database)
docker-compose up -d

# Tunggu containers running (cek Docker Desktop)
# Seed database dengan data mahasiswa
node seed.js

# Verify backend: http://localhost:5001/api-docs
```

### 4. Setup Frontend (5 menit)  
```bash
# Buka terminal baru, ke folder frontend
cd "../"  # kembali ke root "backend frontend"

# Install dependencies
npm install

# Start development server
npm run dev

# Verify frontend: http://localhost:8080
```

### 5. Test Aplikasi
1. Buka http://localhost:8080
2. Login dengan NIM: `1301221234`, Password: `1301221234`
3. Test semua fitur: Dashboard, Integrasi Minat, Simulasi IPK

## 🔑 Akun Login

| NIM | Password | Nama | Angkatan | Status |
|-----|----------|------|----------|---------|
| 1301221234 | 1301221234 | Iwan Awan Setiawan | 2022 | Tingkat III |
| 1301215432 | 1301215432 | Daffa Muhammad Pratama | 2022 | Tingkat III |
| 1301230001 | 1301230001 | Farunada Firda | 2023 | Tingkat II |
| 1301230021 | 1301230021 | Muhammad Agus Wahyudi | 2023 | Tingkat II |
| 1301200095 | 1301200095 | Akbar Setiawan | 2024 | Tingkat I |
| 1301222344 | 1301222344 | Farid Rahman | 2024 | Tingkat I |

## 🎯 Fitur Utama

### 📊 Dashboard  
- Profil mahasiswa lengkap
- Data akademik: IPK, SKS Total, TAK, IKK
- Ringkasan per tingkat (I, II, III, IV)
- Data real-time dari database

### 🎯 Integrasi Minat
- Input hard skills & soft skills
- Rekomendasi mata kuliah dengan Google Gemini AI
- Analisis berdasarkan profil akademik dan minat
- Simpan preferensi mahasiswa

### 📈 Simulasi IPK
- Input mata kuliah dan prediksi nilai  
- Kalkulasi IPS dan IPK otomatis
- Simulasi berbagai skenario akademik
- Filter mata kuliah per tingkat

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** (Build tool & dev server)  
- **Tailwind CSS** (Styling)
- **Shadcn/ui** (UI components)
- **React Router** (Navigation)

### Backend
- **Node.js** + Express.js
- **MongoDB** + Mongoose ODM
- **JWT** Authentication
- **Google Gemini API** (AI recommendations)
- **Docker** + Docker Compose
- **Swagger** (API documentation)

## 📁 Struktur Project

```
backend frontend/
├── README.md                    # Dokumentasi utama
├── package.json                 # Frontend dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind configuration
│
├── client/                      # Frontend source
│   ├── App.tsx                 # Main app component
│   ├── pages/                  # Page components
│   ├── components/             # Reusable components  
│   ├── lib/                    # API services & utilities
│   └── hooks/                  # Custom React hooks
│
├── compro-backend-master/      # Backend source
│   ├── docker-compose.yml      # Docker configuration
│   ├── index.js               # Backend entry point
│   ├── seed.js                # Database seeder
│   ├── data_json/             # Source data files
│   └── src/                   # Backend modules
│       ├── controllers/       # API endpoints logic
│       ├── models/           # Database schemas  
│       ├── routes/           # API routes
│       └── middleware/       # Auth & validation
│
└── server/                     # [Not used]
```

## 🔗 API Endpoints

**Base URL**: http://localhost:5001/api

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/login` | Login mahasiswa |
| GET | `/menu` | Dashboard data & profile |
| GET | `/interests` | Data minat & skills |
| POST | `/interests` | Update minat mahasiswa |
| POST | `/interests/recommend` | AI recommendations |
| GET | `/courses` | Daftar mata kuliah |
| GET | `/simulation/plan` | Rencana studi per semester |
| POST | `/simulation/calculate` | Kalkulasi simulasi IPK |

**API Documentation**: http://localhost:5001/api-docs

## 🐛 Troubleshooting

### Backend tidak jalan
```bash
cd compro-backend-master
docker ps                      # Cek status containers
docker-compose down            # Stop containers
docker-compose up -d           # Start ulang
node seed.js                   # Re-seed database
```

### Frontend tidak jalan  
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port sudah digunakan
```bash
# Matikan proses di port 8080
npx kill-port 8080

# Atau ubah port di vite.config.ts
# server: { port: 3000 }
```

### Docker Desktop tidak jalan
1. Restart Docker Desktop
2. Pastikan WSL2 enabled (Windows)
3. Check system requirements

## 🔧 Configuration Files

### Frontend (vite.config.ts)
```typescript
export default defineConfig({
  server: {
    port: 8080,
    host: true
  }
})
```

### Backend (.env)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/mahasiswa_db
JWT_SECRET=rahasia_negara_api_mahasiswa_backend_2024
GEMINI_API_KEY=AIzaSyDolFEygS8Xb5Z8SXUbcRq4CYVUsjjHuu0
```

## 🚀 Production Deployment

### Frontend Build
```bash
npm run build        # Generate production build
npm run preview      # Preview production build locally
```

### Backend Production
```bash
cd compro-backend-master
docker-compose -f docker-compose.prod.yml up -d
```

## 👥 Tim & Kontribusi

- **Frontend Development**: React/TypeScript integration
- **Backend Development**: Node.js REST API
- **Database Design**: MongoDB schema & data modeling  
- **AI Integration**: Google Gemini API implementation
- **DevOps**: Docker containerization

## 📞 Support

Jika ada masalah atau pertanyaan:

1. **Cek troubleshooting** di atas
2. **Verify setup** sesuai panduan
3. **Check logs** di terminal/Docker Desktop
4. **Test API** di Swagger UI (http://localhost:5001/api-docs)

---

**📚 Project COMPRO - Academic Management System**  
*Telkom University - Semester 7*