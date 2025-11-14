# SimHire - Platform Rekrutmen Terintegrasi

Platform karir profesional yang menggabungkan Simulasi Kerja Real-time, Job Application System, Portfolio Management, dan Dashboard Analytics.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Fitur Utama

### Untuk Kandidat
- **Simulasi Kerja**: 24 tugas profesional di 6 kategori industri
- **Advanced Input System**: Text Editor, Code Editor (7 bahasa), File Upload
- **Sistem Scoring Objektif**: Technical, Creativity, Efficiency, Communication
- **Job Finder**: Filter canggih dan 1-click application
- **Portfolio Management**: Showcase project dengan teknologi stack
- **Auto-CV Generator**: Generate CV professional dari portfolio
- **Application Tracker**: Monitor status lamaran real-time

### Untuk Perusahaan
- **Talent Search**: Cari kandidat berdasarkan skill dan simulasi scores
- **Job Management**: Post dan kelola lowongan kerja
- **Applicant Tracking**: Track kandidat dari aplikasi hingga hiring
- **Simulasi Analytics**: Analisis hasil simulasi kandidat
- **Evaluation Templates**: Custom assessment untuk posisi tertentu
- **Team Management**: Kelola tim recruitment

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Radix UI + shadcn/ui
- React Router v7

### Backend
- Node.js
- Express
- LowDB (JSON database)
- JWT Authentication
- Multer (file upload)
- Zod (validation)
- Helmet (security)

## Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
git clone https://github.com/your-username/simhire.git
cd simhire

npm install

npm run dev
```

### Backend Setup

```bash
cd backend

npm install

cp .env.example .env

npm run init-db

npm run dev
```

### Environment Variables

Frontend (.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SimHire
```

Backend (.env):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:8347
```

## Access

- Frontend: http://localhost:8347
- Backend API: http://localhost:5000

## Demo Accounts

### Kandidat
```
Email: kandidat@test.com
Password: password123
```

### Perusahaan
```
Email: perusahaan@test.com
Password: password123
```

## Project Structure

```
simhire/
├── src/
│   ├── components/       
│   ├── pages/           
│   ├── dashboard/       
│   ├── company/         
│   ├── context/         
│   ├── services/        
│   ├── lib/             
│   └── hooks/           
├── backend/
│   ├── controllers/     
│   ├── routes/          
│   ├── middleware/      
│   ├── utils/           
│   └── data/            
└── public/
```

## Features Detail

### Simulasi Kerja
- Frontend Development (4 tasks)
- Backend Development (5 tasks)
- UI/UX Design (4 tasks)
- Digital Marketing (3 tasks)
- Data Analytics (4 tasks)
- Project Management (4 tasks)

### Scoring System
- Technical: 30%
- Creativity: 25%
- Efficiency: 25%
- Communication: 20%

### Ranking
- S Rank: 95-100% (Master)
- A Rank: 85-94% (Expert)
- B Rank: 75-84% (Advanced)
- C Rank: 65-74% (Proficient)
- D Rank: 55-64% (Intermediate)
- E Rank: <55% (Beginner)

## Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Build for Production
```bash
npm run build
```

Output will be in `dist/` folder.

## Security

- JWT-based authentication
- Password hashing (bcryptjs)
- Security headers (Helmet)
- Input validation (Zod)
- Rate limiting
- CORS protection
- File upload validation

## License

MIT License - Free to use untuk learning dan development.

## Support

Untuk pertanyaan dan issue, silakan buat issue di repository atau hubungi tim development.

---

**SimHire** - Platform Rekrutmen Berbasis Skill Verification
