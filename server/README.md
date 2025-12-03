# Backend Chatbot Akademik Mahasiswa

Backend ini dibangun menggunakan **Node.js**, **Express.js**, dan **MongoDB** untuk mendukung sistem chatbot akademik mahasiswa.

## Functional Requirements Covered

1.  **FR01 - Autentikasi**: Login mahasiswa (NIM & Password) dengan JWT Token. Mengembalikan profil lengkap (IPK, SKS, dll).
2.  **FR02 - Menu Utama**: Endpoint untuk mendapatkan menu navigasi dan ringkasan profil.
3.  **FR03 - Integrasi Minat**:
    *   Input minat (Hard Skill & Soft Skill).
    *   Rekomendasi Mata Kuliah berbasis AI (Mock Logic).
4.  **FR04 - Simulasi IPK**:
    *   Input rencana studi dan prediksi nilai.
    *   Perhitungan IPS dan IPK Kumulatif otomatis.

## 🚀 Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Auth**: JSON Web Token (JWT) + Bcrypt
*   **Docs**: Swagger UI

## 🛠 Cara Menjalankan

### Opsi 1: Docker (Disarankan)

1.  **Jalankan Container**:
    Pastikan Docker Desktop berjalan, lalu jalankan:
    ```bash
    docker compose up --build
    ```
    *   Backend: `http://localhost:5001`
    *   MongoDB: `localhost:27017`

2.  **Seed Data (Pertama Kali)**:
    Saat container berjalan, buka terminal baru dan jalankan:
    ```bash
    docker compose exec app node seed.js
    ```

### Opsi 2: Manual (Localhost)

1.  **Prerequisites**:
    *   Node.js installed
    *   MongoDB running

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Server**:
    ```bash
    npm run dev
    ```

4.  **Import Data**:
    ```bash
    node seed.js
    ```

## API Documentation

*   **Swagger UI**: `http://localhost:5001/api-docs`
*   Gunakan dokumentasi ini untuk melihat semua endpoint, payload request, dan format response.

## Panduan untuk Frontend Developer

1.  **Autentikasi**:
    *   Gunakan `POST /api/auth/login` untuk mendapatkan token.
    *   Simpan token dan kirimkan di header `Authorization: Bearer <token>` untuk request selanjutnya.

2.  **Simulasi IPK**:
    *   Panggil `GET /api/simulation/plan?semester=X` untuk mendapatkan daftar MK default.
    *   User mengedit/memilih MK.
    *   Kirim `POST /api/simulation/calculate` untuk menghitung dan menyimpan draft.
    *   Panggil `POST /api/simulation/end-session` saat user keluar halaman.

3.  **Integrasi Minat**:
    *   Panggil `GET /api/interests` untuk mendapatkan opsi Hard/Soft Skill dan data user.
    *   Kirim `POST /api/interests` untuk menyimpan pilihan user.
    *   Kirim `POST /api/interests/recommend` untuk mendapatkan rekomendasi AI.

## 📂 Struktur Folder

```
backend-mahasiswa/
├── data_json/              # Data mentah (JSON Source)
├── src/
│   ├── config/             # DB Connection & Swagger Config
│   ├── controllers/        # Business Logic (Auth, Course, Simulation, Interests)
│   ├── middleware/         # Auth Middleware (JWT Protect)
│   ├── models/             # Mongoose Schemas (Student, Course, Grade)
│   └── routes/             # API Route Definitions
├── index.js                # App Entry Point
├── seed.js                 # Data Seeding Script
└── test_api.js             # Automated API Testing Script
```

## API Endpoints (Summary)

### Auth
*   `POST /api/auth/login`: Login user.

### Menu
*   `GET /api/menu`: Get main menu & profile.

### Interests (Minat & Bakat)
*   `POST /api/interests`: Update hard/soft skills.
*   `POST /api/interests/recommend`: Get AI course recommendations.

### Courses
*   `GET /api/courses`: Search & Filter courses.

### Simulation
*   `POST /api/simulation/calculate`: Calculate IPS/IPK based on inputs.
*   `POST /api/simulation/end-session`: Clear simulation session.
