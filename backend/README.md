# SimHire Backend API

Backend API untuk platform SimHire dengan sistem autentikasi JWT dan file upload support.

## Tech Stack

- Node.js (ES Modules)
- Express.js
- LowDB (JSON database)
- JWT Authentication
- Multer (file upload)
- Zod validation
- bcryptjs (password hashing)
- Helmet (security headers)

## Project Structure

```
backend/
├── controllers/
├── routes/
├── middleware/
├── utils/
├── schemas/
├── scripts/
├── data/
├── uploads/
├── server.js
└── package.json
```

## Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8347
```

### Initialize Database

```bash
npm run init-db
```

Creates sample users:
- Candidate: `candidate@test.com` / `password123`
- Company: `company@test.com` / `password123`

### Start Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs at `http://localhost:5000`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Jobs
- GET `/api/jobs` - Get all jobs
- GET `/api/jobs/:id` - Get job by ID
- POST `/api/jobs` - Create job (company only)
- PUT `/api/jobs/:id` - Update job (company only)
- DELETE `/api/jobs/:id` - Delete job (company only)

### Applications
- POST `/api/applications` - Submit application
- GET `/api/applications` - Get user applications
- GET `/api/applications/:id` - Get application by ID
- PUT `/api/applications/:id` - Update application status

### Simulasi
- GET `/api/simulasi/categories` - Get categories
- GET `/api/simulasi/tasks/:categoryId` - Get tasks
- POST `/api/simulasi/submit` - Submit simulasi
- GET `/api/simulasi/results` - Get results
- GET `/api/simulasi/leaderboard` - Get leaderboard

### Portfolio
- GET `/api/portfolio` - Get projects
- POST `/api/portfolio` - Create project
- PUT `/api/portfolio/:id` - Update project
- DELETE `/api/portfolio/:id` - Delete project

### Internships
- GET `/api/internships` - Get internships
- POST `/api/internships` - Create internship
- GET `/api/internship-applications` - Get applications

### Candidates (Company)
- GET `/api/candidates` - Search candidates
- GET `/api/candidates/:id` - Get candidate profile

## Security

- JWT tokens with expiration
- Password hashing (bcryptjs, 10 rounds)
- Helmet security headers
- CORS protection
- Rate limiting
- Input validation (Zod)
- File upload validation

## Database

Uses LowDB (JSON-based) stored in `data/` folder:
- users.json
- jobs.json
- applications.json
- simulasi_results.json
- portfolios.json
- internships.json

Auto-backup every 24 hours to `backups/` folder.

## File Uploads

Stored in `uploads/` directory with subdirectories:
- avatars/
- ktp/
- npwp/
- cv/
- portfolio/

Max file size: 5MB per file

## Error Handling

Standardized response format:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

Error response:
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

## Development

### Hot Reload
```bash
npm run dev
```

### Logging
Console logs in development, file logs in production.

### Testing
```bash
npm test
```

## Production Deployment

### Build
Already uses ES modules, no build step needed.

### Environment
Set `NODE_ENV=production` in environment variables.

### Database Migration
For production, migrate from LowDB to PostgreSQL/MongoDB.

### File Storage
For production, use AWS S3 or similar cloud storage.

## License

MIT
