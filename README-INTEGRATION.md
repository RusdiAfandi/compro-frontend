# Compro Akademik - Full Stack Application

Aplikasi chatbot akademik mahasiswa yang dibangun dengan **React + Vite** untuk frontend dan **Node.js + Express + MongoDB** untuk backend.

## 🚀 Tech Stack

### Frontend
- **React 18** dengan TypeScript
- **Vite** untuk build tool dan dev server
- **Tailwind CSS** untuk styling
- **React Router** untuk navigation
- **Radix UI** untuk komponen UI

### Backend
- **Node.js** dengan Express.js
- **MongoDB** dengan Mongoose ODM
- **JWT** untuk authentication
- **Swagger UI** untuk API documentation
- **Docker** untuk database containerization

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- **Node.js** (versi 18 atau lebih baru)
- **npm** atau **yarn**
- **Docker Desktop** (untuk MongoDB)

## 🛠 Setup dan Installation

### 1. Clone dan Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd tubes-dari-ai

# Install dependencies
npm install
```

### 2. Environment Setup

File `.env` sudah dikonfigurasi dengan:
```env
# Frontend
VITE_PUBLIC_BUILDER_KEY=__BUILDER_PUBLIC_KEY__
PING_MESSAGE="ping pong"

# Backend
MONGODB_URI=mongodb://localhost:27017/compro_akademik
JWT_SECRET=compro_akademik_secret_key_2024
PORT=5001
```

### 3. Jalankan Database (MongoDB)

```bash
# Start MongoDB dengan Docker
npm run mongodb:start

# Untuk stop MongoDB
npm run mongodb:stop
```

### 4. Seed Database (Pertama Kali)

```bash
# Import data ke database
npm run backend:seed
```

### 5. Jalankan Aplikasi

#### Development Mode (Recommended)
```bash
# Jalankan frontend dan backend secara bersamaan
npm run dev
```

Atau jalankan secara terpisah:
```bash
# Terminal 1 - Frontend (React + Vite)
npm run dev:frontend

# Terminal 2 - Backend (Node.js + Express)
npm run dev:backend
```

#### Full Development Mode (dengan MongoDB)
```bash
# Jalankan database + frontend + backend sekaligus
npm run dev:full
```

### 6. Akses Aplikasi

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5001
- **API Documentation**: http://localhost:5001/api-docs
- **MongoDB**: mongodb://localhost:27017

## 📂 Struktur Project

```
tubes-dari-ai/
├── client/                 # Frontend React App
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities & API client
│   └── ...
├── server/                # Backend Express App
│   ├── src/
│   │   ├── config/        # Database & Swagger config
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Mongoose schemas
│   │   └── routes/        # API routes
│   ├── data_json/         # Seed data
│   ├── index.js           # Entry point
│   └── seed.js           # Data seeding script
├── docker-compose.dev.yml # MongoDB container config
├── .env                  # Environment variables
└── package.json          # Dependencies & scripts
```

## 🔌 API Integration

### Penggunaan API Client

```typescript
import { apiClient } from '@/lib/api';

// Login
const loginResponse = await apiClient.login('nim', 'password');

// Get user menu
const menuData = await apiClient.getMenu();

// Update interests
await apiClient.updateInterests(['JavaScript', 'React'], ['Communication', 'Leadership']);

// Get course recommendations
const recommendations = await apiClient.getRecommendations();
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| GET | `/api/menu` | Get main menu & profile |
| GET | `/api/interests` | Get user interests |
| POST | `/api/interests` | Update user interests |
| POST | `/api/interests/recommend` | Get AI recommendations |
| GET | `/api/courses` | Search & filter courses |
| GET | `/api/simulation/plan` | Get study plan |
| POST | `/api/simulation/calculate` | Calculate IPS/IPK |
| POST | `/api/simulation/end-session` | End simulation |

## 🧪 Testing

```bash
# Test API endpoints
npm run backend:test

# Run frontend tests
npm run test
```

## 📚 Features

1. **FR01 - Authentication**: Login mahasiswa dengan NIM & Password
2. **FR02 - Main Menu**: Dashboard dengan profil dan navigasi
3. **FR03 - Interest Integration**: 
   - Input hard skills & soft skills
   - AI-powered course recommendations
4. **FR04 - IPK Simulation**: 
   - Study plan input
   - IPS/IPK calculation
   - Grade prediction

## 🔧 Available Scripts

```bash
npm run dev              # Frontend + Backend development
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only  
npm run dev:full         # Database + Frontend + Backend
npm run mongodb:start    # Start MongoDB container
npm run mongodb:stop     # Stop MongoDB container
npm run backend:seed     # Import seed data
npm run backend:test     # Test API endpoints
npm run build           # Build for production
npm run start           # Start production server
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Pastikan Docker Desktop berjalan
# Restart MongoDB container
npm run mongodb:stop
npm run mongodb:start
```

### Port Already in Use
```bash
# Kill process yang menggunakan port
# Frontend (8080) atau Backend (5001)
npx kill-port 8080
npx kill-port 5001
```

### API Proxy Issues
Pastikan konfigurasi proxy di `vite.config.ts` sudah benar:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true,
      secure: false,
    }
  },
}
```

## 📖 Documentation

- Backend API: http://localhost:5001/api-docs
- Frontend Components: Lihat folder `client/components/`
- Database Schema: Lihat folder `server/src/models/`

## 👥 Development Team

Aplikasi ini dikembangkan sebagai tugas besar mata kuliah Pemrograman Komputer.

---

**Happy Coding! 🚀**