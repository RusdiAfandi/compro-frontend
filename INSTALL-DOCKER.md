# 📥 Install Docker Desktop untuk Windows

## Step 1: Download Docker Desktop

1. Kunjungi: https://www.docker.com/products/docker-desktop/
2. Klik "Download Docker Desktop for Windows"
3. File installer akan didownload (~500MB)

## Step 2: Install Docker Desktop

1. **Run installer** sebagai Administrator
2. **Accept License Agreement**
3. **Configuration Options**:
   - ✅ Enable Hyper-V Windows Features (jika diminta)
   - ✅ Add shortcut to desktop
4. **Install** (proses ~5-10 menit)
5. **Restart komputer** setelah instalasi selesai

## Step 3: Start Docker Desktop

1. **Launch Docker Desktop** dari Start Menu atau Desktop shortcut
2. **Accept Service Agreement** 
3. **Wait for Docker Engine to start** (ikon whale di system tray akan hijau)
4. **Optional**: Buat Docker Hub account atau skip

## Step 4: Verify Installation

Buka PowerShell atau Command Prompt dan test:

```bash
# Test Docker
docker --version

# Test Docker Compose  
docker compose version

# Test Docker run
docker run hello-world
```

Jika semua command berhasil, Docker sudah siap digunakan!

## ⚠️ Troubleshooting

### WSL 2 Error
Jika muncul error WSL 2:
1. Download WSL 2 update: https://aka.ms/wsl2kernel
2. Install dan restart komputer
3. Restart Docker Desktop

### Hyper-V Error
Jika muncul error Hyper-V:
1. Buka "Turn Windows features on or off"
2. Enable: Hyper-V, Virtual Machine Platform, Windows Subsystem for Linux
3. Restart komputer

### Memory/Performance Issues
Docker Desktop settings:
1. Klik Docker Desktop icon → Settings
2. Resources → Advanced
3. Set Memory: 4GB+ (recommended)
4. Set CPU: 2+ cores

---

## 🚀 Setelah Docker Terinstall

Kembali ke project dan jalankan:

```bash
cd "e:\semester 7\compro\tubes dari ai"

# Build dan start aplikasi
npm run docker:up

# Seed database
npm run docker:seed

# Akses aplikasi: http://localhost:8080
```