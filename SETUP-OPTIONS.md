# 🛠️ Setup Tanpa Docker (Sementara)

Jika Docker belum terinstall, Anda masih bisa menjalankan aplikasi dengan MongoDB lokal.

## Quick Setup (No Docker)

### 1. Start MongoDB Service (jika sudah install)

```bash
# Method 1: Via Services
services.msc → Cari "MongoDB Server" → Start

# Method 2: Via PowerShell (as Admin)
Start-Service MongoDB

# Method 3: Via Command Prompt (as Admin)  
net start MongoDB
```

### 2. Jalankan Aplikasi

```bash
cd "e:\semester 7\compro\tubes dari ai"

# Seed database (pertama kali)
npm run backend:seed

# Jalankan frontend + backend
npm run dev:frontend  # Terminal 1
npm run dev:backend   # Terminal 2 (optional)

# Atau frontend saja (API akan menggunakan proxy)
npm run dev:frontend
```

### 3. Akses Aplikasi

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5001 (jika dijalankan terpisah)

## 🐳 Setelah Install Docker

1. **Install Docker Desktop** mengikuti `INSTALL-DOCKER.md`
2. **Gunakan Docker setup**:

```bash
# Build dan start semua services
npm run docker:up

# Seed database
npm run docker:seed

# Akses: http://localhost:8080
```

## Docker vs No Docker

| Feature | No Docker | With Docker |
|---------|-----------|-------------|
| Setup | ⚠️ Manual MongoDB install | ✅ Otomatis |
| Consistency | ⚠️ Tergantung environment | ✅ Consistent |
| Ease | ⚠️ Multiple steps | ✅ One command |
| Performance | ✅ Native speed | ⚠️ Container overhead |
| Learning curve | ✅ Familiar | ⚠️ Need Docker knowledge |

## Recommendation

- **Development saat ini**: No Docker (cepat start)
- **Production/Team**: Docker (consistency)
- **Learning**: Mulai No Docker → upgrade ke Docker