import { Internship } from '../internship';

export const mockInternships: Internship[] = [
  {
    id: 'intern-1',
    companyId: 'company-1',
    company: {
      name: 'TechCorp Indonesia',
      logo: 'https://example.com',
location: 'Jakarta Selatan',
      description: 'Leading tech company in Indonesia'
    },
    position: 'Frontend Developer Intern',
    duration: '6 bulan',
    isPaid: true,
    salary: 'Rp 3.500.000',
    description: 'Bergabunglah dengan tim developer kami untuk mengembangkan aplikasi web modern menggunakan React dan TypeScript. Anda akan mendapat mentorship langsung dari senior developers dan bekerja pada proyek nyata yang digunakan ribuan pengguna.',
    learningObjectives: [
      'Menguasai React.js dan TypeScript',
      'Memahami modern web development practices',
      'Bekerja dengan REST API dan state management',
      'Code review dan best practices',
      'Agile development methodology'
    ],
    requirements: [
      'Mahasiswa aktif semester 5 ke atas',
      'Memahami dasar HTML, CSS, JavaScript',
      'Familiar dengan React (min. project pribadi)',
      'Komunikatif dan eager to learn',
      'Bisa commit full-time 40 jam/minggu'
    ],
    responsibilities: [
      'Develop UI components menggunakan React',
      'Implement responsive design',
      'Collaborate dengan backend team',
      'Write clean, documented code',
      'Participate dalam daily standup dan sprint planning'
    ],
    benefits: [
      'Uang saku Rp 3.500.000/bulan',
      'Sertifikat resmi',
      'Mentorship dari senior developers',
      'Flexible working hours',
      'Networking opportunities',
      'Referral letter'
    ],
    tags: ['React', 'TypeScript', 'UI/UX', 'Frontend'],
    postedDate: '2025-11-10T08:00:00Z',
    applicationDeadline: '2025-12-31T23:59:59Z',
    startDate: '2026-01-15T00:00:00Z',
    type: 'internship',
    mentorshipProvided: true,
    certificateProvided: true,
    isBookmarked: false,
    location: 'Jakarta Selatan',
    remote: false,
    applicationCount: 12,
    status: 'active'
  },
  {
    id: 'intern-2',
    companyId: 'company-2',
    company: {
      name: 'MarketPro Agency',
      logo: 'https://example.com',
location: 'Bandung',
      description: 'Digital marketing agency'
    },
    position: 'Digital Marketing Intern',
    duration: '3 bulan',
    isPaid: true,
    salary: 'Rp 2.800.000',
    description: 'Pelajari strategi digital marketing modern, social media management, dan content creation. Bekerja dengan clients dari berbagai industri dan dapatkan hands-on experience dalam campaign management.',
    learningObjectives: [
      'Social media marketing strategy',
      'Content creation dan copywriting',
      'Data analysis dan reporting',
      'SEO dan SEM basics',
      'Client management'
    ],
    requirements: [
      'Mahasiswa aktif jurusan Marketing/Komunikasi',
      'Aktif di social media',
      'Kreatif dan up-to-date dengan trends',
      'Good communication skills',
      'Min. semester 4'
    ],
    responsibilities: [
      'Manage social media accounts',
      'Create engaging content',
      'Monitor campaign performance',
      'Assist in client presentations',
      'Conduct market research'
    ],
    benefits: [
      'Stipend Rp 2.800.000/bulan',
      'Sertifikat',
      'Portfolio dari real campaigns',
      'Networking dengan brands',
      'Kemungkinan full-time hire'
    ],
    tags: ['Social Media', 'SEO', 'Content Marketing'],
    postedDate: '2025-11-09T10:00:00Z',
    applicationDeadline: '2025-11-30T23:59:59Z',
    startDate: '2025-12-15T00:00:00Z',
    type: 'internship',
    mentorshipProvided: true,
    certificateProvided: true,
    isBookmarked: false,
    location: 'Bandung',
    remote: true,
    applicationCount: 8,
    status: 'active'
  },
  {
    id: 'intern-3',
    companyId: 'company-3',
    company: {
      name: 'FinanceHub',
      logo: 'https://example.com',
location: 'Jakarta Pusat',
      description: 'Financial technology company'
    },
    position: 'Data Analysis Intern',
    duration: '4 bulan',
    isPaid: true,
    salary: 'Rp 4.000.000',
    description: 'Dapatkan pengalaman dalam analisis keuangan, pemodelan finansial, dan data visualization. Bekerja dengan dataset real dan tools profesional seperti Excel, Python, dan Tableau.',
    learningObjectives: [
      'Financial data analysis',
      'Excel advanced (pivot, macros)',
      'Python untuk data processing',
      'Data visualization dengan Tableau',
      'Business intelligence basics'
    ],
    requirements: [
      'Mahasiswa Ekonomi/Statistik/Matematika',
      'IPK min. 3.2',
      'Paham Excel intermediate',
      'Basic programming (Python/R is plus)',
      'Analytical thinking'
    ],
    responsibilities: [
      'Analyze financial data',
      'Create reports dan dashboards',
      'Support business decision making',
      'Data cleaning dan processing',
      'Present findings to stakeholders'
    ],
    benefits: [
      'Competitive allowance Rp 4.000.000',
      'Certificate of completion',
      'Training dari professionals',
      'Access to premium tools',
      'Strong referral'
    ],
    tags: ['Excel', 'Financial Modeling', 'Analysis'],
    postedDate: '2025-11-08T09:00:00Z',
    applicationDeadline: '2025-12-15T23:59:59Z',
    startDate: '2026-01-05T00:00:00Z',
    type: 'internship',
    mentorshipProvided: true,
    certificateProvided: true,
    isBookmarked: true,
    location: 'Jakarta Pusat',
    remote: false,
    applicationCount: 15,
    status: 'active'
  },
  {
    id: 'intern-4',
    companyId: 'company-4',
    company: {
      name: 'DesignStudio Creative',
      logo: 'https://example.com',
location: 'Yogyakarta',
      description: 'Creative design studio'
    },
    position: 'UI/UX Designer Intern',
    duration: '5 bulan',
    isPaid: true,
    salary: 'Rp 3.000.000',
    description: 'Belajar design thinking, user research, prototyping, dan visual design untuk aplikasi mobile dan web. Bekerja pada proyek nyata untuk clients dari startup hingga enterprise.',
    learningObjectives: [
      'User research metodologi',
      'Wireframing dan prototyping',
      'UI design dengan Figma',
      'Usability testing',
      'Design system development'
    ],
    requirements: [
      'Mahasiswa DKV/Desain/Informatika',
      'Portfolio design (min. 3 projects)',
      'Familiar dengan Figma/Adobe XD',
      'Understanding of UX principles',
      'Creative dan detail-oriented'
    ],
    responsibilities: [
      'Create wireframes dan mockups',
      'Conduct user research',
      'Design UI components',
      'Collaborate dengan developers',
      'Iterate based on feedback'
    ],
    benefits: [
      'Stipend Rp 3.000.000',
      'Certificate',
      'Portfolio dari real projects',
      'Mentorship dari senior designers',
      'Flexible remote work'
    ],
    tags: ['Figma', 'User Research', 'Prototyping'],
    postedDate: '2025-11-07T11:00:00Z',
    applicationDeadline: '2025-12-20T23:59:59Z',
    startDate: '2026-01-10T00:00:00Z',
    type: 'internship',
    mentorshipProvided: true,
    certificateProvided: true,
    isBookmarked: false,
    location: 'Yogyakarta',
    remote: true,
    applicationCount: 10,
    status: 'active'
  },
  {
    id: 'intern-5',
    companyId: 'company-5',
    company: {
      name: 'DataCorp Analytics',
      logo: 'https://example.com',
location: 'Surabaya',
      description: 'Data science and analytics company'
    },
    position: 'Data Science Intern',
    duration: '6 bulan',
    isPaid: true,
    salary: 'Rp 4.500.000',
    description: 'Terlibat dalam proyek machine learning, data visualization, dan analisis big data. Gunakan Python, TensorFlow, dan tools data science terkini untuk solve real business problems.',
    learningObjectives: [
      'Machine learning algorithms',
      'Python (Pandas, NumPy, Scikit-learn)',
      'Data visualization (Matplotlib, Seaborn)',
      'Big data processing',
      'Model deployment'
    ],
    requirements: [
      'Mahasiswa Teknik/Matematika/Statistik',
      'IPK min. 3.5',
      'Strong Python programming',
      'Understanding of statistics',
      'Experience dengan ML projects (academic ok)'
    ],
    responsibilities: [
      'Build machine learning models',
      'Data preprocessing dan feature engineering',
      'Create visualizations',
      'Document code dan findings',
      'Present results to team'
    ],
    benefits: [
      'High stipend Rp 4.500.000',
      'Official certificate',
      'GPU access untuk training models',
      'Conference opportunities',
      'Publication assistance'
    ],
    tags: ['Python', 'Machine Learning', 'SQL', 'Big Data'],
    postedDate: '2025-11-06T08:30:00Z',
    applicationDeadline: '2025-12-10T23:59:59Z',
    startDate: '2025-12-20T00:00:00Z',
    type: 'internship',
    mentorshipProvided: true,
    certificateProvided: true,
    isBookmarked: false,
    location: 'Surabaya',
    remote: false,
    applicationCount: 18,
    status: 'active'
  }
];

export default mockInternships;
