# Architecture - Reconnaissance App

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React/Vue)                   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────┐
│                   API Gateway (Express)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Authentication & Authorization          │  │
│  │                 (JWT Middleware)                 │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬─────────────┐
        │              │              │             │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌───▼────┐
   │  Auth   │   │  Domain  │   │ Network │   │ Report │
   │ Routes  │   │  Routes  │   │ Routes  │   │Routes  │
   └────┬────┘   └────┬────┘   └────┬────┘   └───┬────┘
        │              │              │             │
        └──────────────┼──────────────┴─────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │ Models  │   │Utilities │   │Middleware│
   │(Mongoose)   │          │   │          │
   └────┬────┘   └────┬────┘   └────┬────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
   ┌────▼────┐              ┌────────▼────┐
   │ MongoDB  │              │ External API│
   │ Database │              │   Services  │
   └──────────┘              └─────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Security**: Helmet, CORS
- **Logging**: Morgan, Custom Logger

### External Libraries
- **dns2**: DNS querying
- **whois**: WHOIS lookups
- **geoip-lite**: IP geolocation
- **axios**: HTTP requests
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT handling

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  role: String (user|admin|analyst),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ScanResult Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  scanType: String (domain|ip|website|network|email),
  target: String,
  status: String (pending|running|completed|failed),
  results: Object (mixed),
  metadata: {
    ip: String,
    domain: String,
    country: String,
    organization: String,
    asn: String
  },
  findings: [
    {
      type: String,
      severity: String (low|medium|high|critical),
      description: String
    }
  ],
  tags: [String],
  notes: String,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

### Report Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  target: String,
  scanResults: [ObjectId] (ref: ScanResult),
  executive_summary: String,
  findings: [
    {
      id: String,
      title: String,
      severity: String,
      description: String,
      recommendation: String
    }
  ],
  status: String (draft|review|published|archived),
  visibility: String (private|shared|public),
  sharedWith: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date
}
```

## API Flow

### Authentication Flow
1. User registers → Password hashed → User saved to DB → JWT token generated
2. User logs in → Password verified → JWT token generated
3. User makes request → Token validated → User info extracted → Request processed

### Reconnaissance Flow
1. User initiates scan → Scan record created with `pending` status
2. Scan task starts → DNS/WHOIS/IP lookup performed
3. Results collected → Scan status updated to `completed`
4. Findings extracted → Scan stored in database
5. User can generate reports from scans

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication
- ✅ CORS protection
- ✅ Helmet for HTTP headers
- ✅ Input validation
- ✅ Rate limiting (configurable)
- ✅ User-specific data isolation

## Scalability Considerations

- MongoDB indexing on userId, scanType, status
- Async/await for non-blocking operations
- Connection pooling for database
- Stateless API design for horizontal scaling
- Queue system for long-running scans (future)
- Caching layer for frequently accessed data (future)

## Error Handling

- Global error handler middleware
- Try-catch blocks in route handlers
- Consistent error response format
- Logging of all errors
- Graceful degradation for external APIs
