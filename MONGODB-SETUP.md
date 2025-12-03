# Setup MongoDB Manual

Jika Docker tidak tersedia, Anda bisa menginstall MongoDB secara manual:

## Windows

### 1. Download dan Install MongoDB Community Server
- Kunjungi: https://www.mongodb.com/try/download/community
- Download MongoDB Community Server untuk Windows
- Install dengan mengikuti wizard

### 2. Start MongoDB Service
```bash
# Via Command Prompt (Run as Administrator)
net start MongoDB

# Atau via Services.msc
# Cari "MongoDB Server" dan start
```

### 3. Verify MongoDB Running
```bash
# Test connection
mongosh
# Jika berhasil, akan muncul MongoDB shell
```

### 4. Alternative: MongoDB Compass (GUI)
- Download MongoDB Compass dari website MongoDB
- Connect ke `mongodb://localhost:27017`

## Setelah MongoDB Running

```bash
# Kembali ke project directory
cd "e:\semester 7\compro\tubes dari ai"

# Seed database
npm run backend:seed

# Jalankan aplikasi
npm run dev
```

## Quick Test (Tanpa Database)

Untuk testing cepat tanpa setup database lengkap:

```bash
# Jalankan hanya frontend
npm run dev:frontend

# Aplikasi akan berjalan di http://localhost:8080
# API calls akan gagal, tapi UI bisa dilihat
```