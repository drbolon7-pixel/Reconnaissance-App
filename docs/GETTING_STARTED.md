# Getting Started - Reconnaissance App

## Prerequisites

- Node.js 14 or higher
- npm or yarn
- MongoDB (local or cloud)
- Git

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/drbolon7-pixel/Reconnaissance-App.git
cd Reconnaissance-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file dan sesuaikan konfigurasi:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reconnaissance-app
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 4. Start MongoDB

Jika menggunakan MongoDB lokal:
```bash
mongod
```

Atau gunakan MongoDB Atlas (cloud) dan update `MONGODB_URI` di `.env`

### 5. Run Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## Verify Installation

Test health check endpoint:
```bash
curl http://localhost:5000/health
```

Response yang diharapkan:
```json
{
  "status": "OK",
  "timestamp": "2026-09-09T10:00:00.000Z"
}
```

## First Steps

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy token dari response.

### 3. Perform DNS Lookup
```bash
curl -X POST http://localhost:5000/api/domain/dns-lookup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "domain": "google.com"
  }'
```

## Project Structure

```
Reconnaissance-App/
├── src/
│   ├── server.js              # Main server file
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── ScanResult.js      # Scan results model
│   │   └── Report.js          # Report model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── domain.js          # Domain reconnaissance routes
│   │   ├── network.js         # Network analysis routes
│   │   ├── reconnaissance.js  # Reconnaissance routes
│   │   └── reports.js         # Report routes
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   └── utils/
│       ├── validators.js      # Input validators
│       ├── formatters.js      # Response formatters
│       ├── logger.js          # Logger utility
│       └── reconnaissance.js  # Reconnaissance utilities
├── docs/
│   ├── API.md                 # API documentation
│   └── GETTING_STARTED.md     # This file
├── package.json               # Dependencies
├── .env.example               # Environment variables example
├── .gitignore                 # Git ignore file
└── README.md                  # Project README
```

## Troubleshooting

### MongoDB Connection Error
- Pastikan MongoDB berjalan
- Verifikasi `MONGODB_URI` di `.env`
- Untuk MongoDB Atlas, pastikan IP Anda sudah di-whitelist

### Port Already in Use
- Ubah PORT di `.env` ke port yang tersedia
- Atau kill proses yang menggunakan port 5000:
  ```bash
  lsof -i :5000
  kill -9 <PID>
  ```

### JWT Secret Error
- Pastikan `JWT_SECRET` sudah di-set di `.env`
- Gunakan string yang kuat dan unik

## Next Steps

1. Baca [API Documentation](./API.md) untuk detail endpoint
2. Implementasikan frontend (React/Vue.js)
3. Tambahkan fitur scanning advanced
4. Setup testing dan CI/CD
5. Deploy ke production
