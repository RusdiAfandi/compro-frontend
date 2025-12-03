# 🐳 Docker Setup untuk Compro Akademik

Setup aplikasi menggunakan Docker untuk memudahkan development dan deployment.

## 📋 Prerequisites

- **Docker Desktop** (Windows/Mac) atau **Docker Engine** (Linux)
- **Docker Compose** (biasanya sudah include dengan Docker Desktop)

## 🚀 Quick Start

### 1. Install Docker Desktop

Download dan install Docker Desktop dari:
- **Windows**: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
- **Mac**: https://desktop.docker.com/mac/main/amd64/Docker.dmg

### 2. Jalankan Aplikasi dengan Docker

```bash
# Clone dan masuk ke direktori project
cd "e:\semester 7\compro\tubes dari ai"

# Build dan jalankan semua services
npm run docker:up

# Atau menggunakan docker compose langsung
docker compose up -d
```

### 3. Seed Database (Pertama kali)

```bash
# Seeding database dengan data awal
npm run docker:seed

# Atau langsung dengan docker compose
docker compose exec backend npm run seed
```

### 4. Akses Aplikasi

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5001
- **API Documentation**: http://localhost:5001/api-docs
- **MongoDB**: mongodb://localhost:27017

## 📦 Services yang Tersedia

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 8080 | React + Vite development server |
| `backend` | 5001 | Node.js + Express API server |
| `mongodb` | 27017 | MongoDB database |

## 🔧 Available Commands

```bash
# Development
npm run docker:up          # Start all services
npm run docker:down        # Stop all services
npm run docker:build       # Rebuild containers
npm run docker:logs        # View logs

# Database Management
npm run docker:seed        # Seed database
npm run docker:test        # Test API endpoints

# Development dengan Frontend lokal
npm run dev:full          # Frontend lokal + Docker backend
```

## 📂 Docker Structure

```
tubes-dari-ai/
├── docker-compose.yml     # Services definition
├── Dockerfile.backend     # Backend container
├── .dockerignore         # Docker ignore patterns
└── server/
    ├── package.json      # Backend dependencies
    ├── index.js          # Backend entry point
    └── data_json/        # Seed data
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Backend Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/compro_akademik      # Local MongoDB
MONGODB_URI_DOCKER=mongodb://mongodb:27017/compro_akademik  # Docker MongoDB
JWT_SECRET=compro_akademik_secret_key_2024
PORT=5001
```

## 🐛 Troubleshooting

### Docker Desktop Tidak Berjalan
```bash
# Pastikan Docker Desktop sudah running
# Restart Docker Desktop jika diperlukan
```

### Port Already in Use
```bash
# Stop containers yang berjalan
npm run docker:down

# Atau paksa stop semua containers
docker compose down --remove-orphans
```

### Container Build Failed
```bash
# Clean build dengan no cache
npm run docker:build --no-cache

# Atau rebuild specific service
docker compose build backend --no-cache
```

### Database Connection Error
```bash
# Restart MongoDB container
docker compose restart mongodb

# Cek logs MongoDB
docker compose logs mongodb
```

### Seeding Failed
```bash
# Pastikan MongoDB sudah running
docker compose ps

# Manual seeding
docker compose exec backend node seed.js
```

## 📊 Monitoring

### View Logs
```bash
# All services
npm run docker:logs

# Specific service
docker compose logs -f backend
docker compose logs -f mongodb
```

### Container Status
```bash
# List running containers
docker compose ps

# Container resource usage
docker stats
```

## 🔄 Development Workflow

### Option 1: Full Docker
```bash
# Start semua services dengan Docker
npm run docker:up

# Development dengan hot reload
# Backend: nodemon sudah configured
# Frontend: Perlu manual restart jika ada perubahan
```

### Option 2: Hybrid (Recommended)
```bash
# Start MongoDB + Backend dengan Docker
npm run docker:up

# Start Frontend lokal untuk hot reload
npm run dev:frontend

# Akses: http://localhost:8080 (proxy ke Docker backend)
```

## 📝 Data Management

### Reset Database
```bash
# Stop containers
npm run docker:down

# Remove volumes (menghapus data)
docker compose down -v

# Start fresh
npm run docker:up
npm run docker:seed
```

### Backup Database
```bash
# Export data
docker compose exec mongodb mongodump --db compro_akademik --out /data/backup

# Import data
docker compose exec mongodb mongorestore /data/backup
```

---

## 🎯 Benefits Docker Setup

1. **✅ Consistent Environment**: Sama di semua device
2. **✅ Easy Setup**: No need install MongoDB manually
3. **✅ Isolation**: Services terisolasi dalam containers
4. **✅ Scalable**: Easy to add more services
5. **✅ Production Ready**: Container configuration for deployment

**Happy Dockering! 🐳🚀**