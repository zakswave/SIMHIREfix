import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const internships = [
  {
    "id": "intern-1",
    "companyId": "company-1",
    "company": {
      "name": "TechCorp Indonesia",
      "logo": "https:
      "location": "Jakarta Selatan"
    },
    "position": "Frontend Developer Intern",
    "duration": "6 bulan",
    "isPaid": true,
    "salary": "Rp 3.500.000",
    "description": "Bergabunglah dengan tim developer kami untuk mengembangkan aplikasi web modern menggunakan React dan TypeScript.",
    "learningObjectives": [
      "Menguasai React.js dan TypeScript",
      "Memahami modern web development practices",
      "Bekerja dengan REST API",
      "Code review dan best practices"
    ],
    "requirements": [
      "Mahasiswa aktif semester 5+",
      "Memahami HTML, CSS, JavaScript",
      "Familiar dengan React"
    ],
    "responsibilities": [
      "Develop UI components",
      "Implement responsive design",
      "Collaborate dengan team"
    ],
    "benefits": [
      "Uang saku Rp 3.500.000/bulan",
      "Sertifikat",
      "Mentorship"
    ],
    "tags": ["React", "TypeScript", "UI/UX"],
    "postedDate": "2025-11-10T08:00:00Z",
    "applicationDeadline": "2025-12-31T23:59:59Z",
    "startDate": "2026-01-15T00:00:00Z",
    "type": "internship",
    "mentorshipProvided": true,
    "certificateProvided": true,
    "isBookmarked": false,
    "location": "Jakarta Selatan",
    "remote": false,
    "applicationCount": 0,
    "status": "active"
  },
  {
    "id": "intern-2",
    "companyId": "company-2",
    "company": {
      "name": "MarketPro Agency",
      "logo": "https:
      "location": "Bandung"
    },
    "position": "Digital Marketing Intern",
    "duration": "3 bulan",
    "isPaid": true,
    "salary": "Rp 2.800.000",
    "description": "Pelajari strategi digital marketing modern, social media management, dan campaign optimization.",
    "learningObjectives": [
      "Social media marketing",
      "Content creation",
      "Data analysis",
      "SEO basics"
    ],
    "requirements": [
      "Mahasiswa aktif Marketing/Komunikasi",
      "Aktif di social media",
      "Kreatif"
    ],
    "responsibilities": [
      "Manage social media",
      "Create content",
      "Monitor campaigns"
    ],
    "benefits": [
      "Stipend Rp 2.800.000",
      "Sertifikat",
      "Portfolio"
    ],
    "tags": ["Social Media", "SEO", "Content"],
    "postedDate": "2025-11-09T10:00:00Z",
    "applicationDeadline": "2025-11-30T23:59:59Z",
    "startDate": "2025-12-15T00:00:00Z",
    "type": "internship",
    "mentorshipProvided": true,
    "certificateProvided": true,
    "isBookmarked": false,
    "location": "Bandung",
    "remote": true,
    "applicationCount": 0,
    "status": "active"
  },
  {
    "id": "intern-3",
    "companyId": "company-3",
    "company": {
      "name": "FinanceHub",
      "logo": "https:
      "location": "Jakarta Pusat"
    },
    "position": "Data Analysis Intern",
    "duration": "4 bulan",
    "isPaid": true,
    "salary": "Rp 4.000.000",
    "description": "Dapatkan pengalaman dalam analisis keuangan dan data visualization.",
    "learningObjectives": [
      "Financial data analysis",
      "Excel advanced",
      "Python basics",
      "Data visualization"
    ],
    "requirements": [
      "Mahasiswa Ekonomi/Statistik",
      "IPK min 3.2",
      "Paham Excel"
    ],
    "responsibilities": [
      "Analyze data",
      "Create reports",
      "Support decisions"
    ],
    "benefits": [
      "Rp 4.000.000/bulan",
      "Certificate",
      "Training"
    ],
    "tags": ["Excel", "Analysis", "Python"],
    "postedDate": "2025-11-08T09:00:00Z",
    "applicationDeadline": "2025-12-15T23:59:59Z",
    "startDate": "2026-01-05T00:00:00Z",
    "type": "internship",
    "mentorshipProvided": true,
    "certificateProvided": true,
    "isBookmarked": false,
    "location": "Jakarta Pusat",
    "remote": false,
    "applicationCount": 0,
    "status": "active"
  }
];

async function seedInternships() {
  try {
    const internshipsFile = path.join(DATA_DIR, 'internships.json');
    const applicationsFile = path.join(DATA_DIR, 'internship-applications.json');
    await fs.writeFile(
      internshipsFile,
      JSON.stringify({ internships }, null, 2)
    );
    console.log(`✅ Seeded ${internships.length} internships to ${internshipsFile}`);
    await fs.writeFile(
      applicationsFile,
      JSON.stringify({ 'internship-applications': [] }, null, 2)
    );
    console.log(`✅ Initialized internship-applications.json`);

    console.log('\n🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedInternships();
