# API Documentation - Reconnaissance App

## Base URL
```
http://localhost:5000/api
```

## Authentication
Semua endpoint (kecuali `/auth/register` dan `/auth/login`) memerlukan JWT Token di header:
```
Authorization: Bearer {token}
```

---

## 🔐 Authentication Endpoints

### 1. Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "username",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Full Name"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com"
  }
}
```

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com"
  }
}
```

### 3. Verify Token
**POST** `/auth/verify`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "valid": true,
  "user": { /* user data */ }
}
```

---

## 🔍 Domain Reconnaissance

### 1. DNS Lookup
**POST** `/domain/dns-lookup`

**Request Body:**
```json
{
  "domain": "example.com"
}
```

**Response:**
```json
{
  "domain": "example.com",
  "aRecords": ["93.184.216.34"],
  "mxRecords": [{"priority": 10, "exchange": "mail.example.com"}],
  "txtRecords": [["v=spf1 ..."]],
  "scanId": "scan_id"
}
```

### 2. WHOIS Lookup
**POST** `/domain/whois`

**Request Body:**
```json
{
  "domain": "example.com"
}
```

**Response:**
```json
{
  "domain": "example.com",
  "whoisData": "... WHOIS information ...",
  "scanId": "scan_id"
}
```

### 3. Subdomain Enumeration
**POST** `/domain/subdomain-enum`

**Request Body:**
```json
{
  "domain": "example.com"
}
```

**Response:**
```json
{
  "domain": "example.com",
  "subdomains": [
    {"subdomain": "www.example.com", "ips": ["93.184.216.34"]},
    {"subdomain": "mail.example.com", "ips": ["93.184.216.35"]}
  ],
  "total": 2,
  "scanId": "scan_id"
}
```

### 4. IP Geolocation
**POST** `/domain/ip-geolocation`

**Request Body:**
```json
{
  "ip": "93.184.216.34"
}
```

**Response:**
```json
{
  "ip": "93.184.216.34",
  "geolocation": {
    "country": "US",
    "city": "Los Angeles",
    "timezone": "America/Los_Angeles",
    "ll": [34.0522, -118.2437]
  },
  "scanId": "scan_id"
}
```

---

## 📊 Reconnaissance Endpoints

### 1. Get All Scans
**GET** `/reconnaissance`

**Response:**
```json
[
  {
    "_id": "scan_id",
    "scanType": "domain",
    "target": "example.com",
    "status": "completed",
    "findings": [],
    "createdAt": "2026-09-09T10:00:00Z"
  }
]
```

### 2. Get Single Scan
**GET** `/reconnaissance/:id`

**Response:**
```json
{
  "_id": "scan_id",
  "scanType": "domain",
  "target": "example.com",
  "status": "completed",
  "results": { /* scan results */ },
  "findings": [],
  "metadata": {}
}
```

### 3. Create New Scan
**POST** `/reconnaissance/scan`

**Request Body:**
```json
{
  "scanType": "domain",
  "target": "example.com"
}
```

### 4. Update Scan Results
**PUT** `/reconnaissance/:id/results`

**Request Body:**
```json
{
  "status": "completed",
  "results": { /* results data */ },
  "findings": [ /* findings */ ]
}
```

### 5. Delete Scan
**DELETE** `/reconnaissance/:id`

---

## 📋 Reports

### 1. Get All Reports
**GET** `/reports`

### 2. Create Report
**POST** `/reports`

**Request Body:**
```json
{
  "title": "Penetration Test Report",
  "description": "Report description",
  "target": "example.com",
  "scanResults": ["scan_id_1", "scan_id_2"]
}
```

### 3. Update Report
**PUT** `/reports/:id`

**Request Body:**
```json
{
  "title": "Updated Title",
  "findings": [ /* findings */ ],
  "status": "published"
}
```

### 4. Generate Report from Scans
**POST** `/reports/:id/generate-from-scans`

**Request Body:**
```json
{
  "scanIds": ["scan_id_1", "scan_id_2"]
}
```

### 5. Delete Report
**DELETE** `/reports/:id`

---

## Error Responses

**400 Bad Request:**
```json
{
  "error": "Missing required fields"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "status": 500
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error
