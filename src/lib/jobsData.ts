import type { SalaryRange, EmploymentType, ExperienceLevel } from './types';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: EmploymentType;
  experienceLevel: ExperienceLevel;
  salary: SalaryRange;
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  remote: boolean;
  posted: string;
  deadline: string;
  companyLogo?: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
  applicationCount: number;
}

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechStart Indonesia',
    location: 'Jakarta',
    type: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 15000000, max: 25000000, currency: 'IDR' },
    description: 'Kami mencari Senior Frontend Developer yang berpengalaman untuk membangun aplikasi web modern dengan React dan TypeScript.',
    requirements: [
      'Minimal 5 tahun pengalaman frontend development',
      'Mahir React, TypeScript, dan Next.js',
      'Pengalaman dengan state management (Redux/Zustand)',
      'Familiar dengan testing (Jest, Cypress)',
      'Portfolio project yang strong'
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Jest'],
    benefits: ['Asuransi kesehatan', 'Remote working', 'Training budget', 'Stock options'],
    remote: true,
    posted: '2024-09-25T08:00:00Z',
    deadline: '2024-10-25T23:59:59Z',
    isUrgent: true,
    isFeatured: true,
    applicationCount: 127
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Gojek',
    location: 'Bandung',
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 12000000, max: 18000000, currency: 'IDR' },
    description: 'Join our design team to create exceptional user experiences for millions of users across Southeast Asia.',
    requirements: [
      '3-4 tahun pengalaman UI/UX design',
      'Proficient dalam Figma dan design systems',
      'Pengalaman user research dan testing',
      'Portfolio yang menunjukkan design thinking',
      'Kolaborasi yang baik dengan developer'
    ],
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems', 'Usability Testing'],
    benefits: ['Health insurance', 'Flexible hours', 'Design conference budget', 'Gym membership'],
    remote: false,
    posted: '2024-09-24T10:30:00Z',
    deadline: '2024-10-30T23:59:59Z',
    isFeatured: true,
    applicationCount: 89
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'Tokopedia',
    location: 'Jakarta',
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 18000000, max: 28000000, currency: 'IDR' },
    description: 'Bergabunglah dengan tim data science untuk menganalisis behavior user dan meningkatkan experience platform e-commerce terbesar di Indonesia.',
    requirements: [
      'Minimal 3 tahun pengalaman data science',
      'Strong Python dan SQL skills',
      'Pengalaman machine learning dan deep learning',
      'Familiar dengan cloud platforms (AWS/GCP)',
      'Experience dengan big data tools (Spark, Hadoop)'
    ],
    skills: ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch', 'AWS', 'Spark'],
    benefits: ['Stock options', 'Health insurance', 'Learning budget', 'Flexible working hours'],
    remote: true,
    posted: '2024-09-23T14:15:00Z',
    deadline: '2024-11-01T23:59:59Z',
    applicationCount: 203
  },
  {
    id: '4',
    title: 'Backend Engineer',
    company: 'Shopee',
    location: 'Surabaya',
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 14000000, max: 22000000, currency: 'IDR' },
    description: 'Build and scale backend systems yang handle millions of transactions daily untuk platform e-commerce terdepan di Asia Tenggara.',
    requirements: [
      '2-4 tahun pengalaman backend development',
      'Strong knowledge Go atau Java',
      'Pengalaman dengan microservices architecture',
      'Database design dan optimization skills',
      'Experience dengan containerization (Docker, Kubernetes)'
    ],
    skills: ['Go', 'Java', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'gRPC'],
    benefits: ['Performance bonus', 'Health coverage', 'Stock purchase plan', 'Career development'],
    remote: false,
    posted: '2024-09-22T09:45:00Z',
    deadline: '2024-10-22T23:59:59Z',
    applicationCount: 156
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Bukalapak',
    location: 'Jakarta',
    type: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 20000000, max: 35000000, currency: 'IDR' },
    description: 'Manage dan improve infrastructure untuk mendukung growth platform marketplace dengan jutaan user aktif.',
    requirements: [
      'Minimal 4 tahun pengalaman DevOps/SRE',
      'Expert level AWS atau Google Cloud',
      'Strong automation skills (Terraform, Ansible)',
      'Monitoring dan observability expertise',
      'Incident response dan troubleshooting skills'
    ],
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Prometheus', 'Grafana', 'CI/CD', 'Python'],
    benefits: ['High salary', 'Stock options', 'Training budget', 'Remote work flexibility'],
    remote: true,
    posted: '2024-09-21T16:20:00Z',
    deadline: '2024-11-15T23:59:59Z',
    isUrgent: true,
    applicationCount: 78
  },
  {
    id: '6',
    title: 'Mobile Developer (React Native)',
    company: 'OVO',
    location: 'Jakarta',
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 13000000, max: 20000000, currency: 'IDR' },
    description: 'Develop and maintain mobile applications yang digunakan oleh millions of users untuk digital payment dan financial services.',
    requirements: [
      '2-3 tahun pengalaman React Native development',
      'Strong JavaScript/TypeScript skills',
      'Experience dengan native modules',
      'Understanding of mobile app deployment',
      'API integration dan state management'
    ],
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'Jest', 'iOS', 'Android'],
    benefits: ['Competitive salary', 'Health insurance', 'Meal allowance', 'Transport allowance'],
    remote: false,
    posted: '2024-09-20T11:10:00Z',
    deadline: '2024-10-20T23:59:59Z',
    applicationCount: 134
  },
  {
    id: '7',
    title: 'Cybersecurity Analyst',
    company: 'Bank Mandiri',
    location: 'Jakarta',
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 16000000, max: 24000000, currency: 'IDR' },
    description: 'Protect digital assets dan ensure security compliance untuk salah satu bank terbesar di Indonesia.',
    requirements: [
      'Minimal 3 tahun pengalaman cybersecurity',
      'Security certifications (CISSP, CEH, atau equivalent)',
      'Experience dengan security tools dan SIEM',
      'Knowledge of compliance frameworks',
      'Incident response dan forensics skills'
    ],
    skills: ['Security Analysis', 'SIEM', 'Penetration Testing', 'Incident Response', 'ISO 27001', 'NIST'],
    benefits: ['Banking benefits', 'Professional certification support', 'Health coverage', 'Pension plan'],
    remote: false,
    posted: '2024-09-19T13:30:00Z',
    deadline: '2024-11-30T23:59:59Z',
    applicationCount: 67
  },
  {
    id: '8',
    title: 'Marketing Automation Specialist',
    company: 'Traveloka',
    location: 'Yogyakarta',
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 10000000, max: 16000000, currency: 'IDR' },
    description: 'Lead marketing automation initiatives untuk improve customer engagement dan drive bookings di platform travel terdepan.',
    requirements: [
      '2-4 tahun pengalaman marketing automation',
      'Proficient dengan tools seperti Salesforce, HubSpot',
      'Data analysis dan campaign optimization skills',
      'A/B testing dan conversion optimization experience',
      'Cross-functional collaboration abilities'
    ],
    skills: ['Marketing Automation', 'Salesforce', 'HubSpot', 'Google Analytics', 'SQL', 'A/B Testing'],
    benefits: ['Travel allowance', 'Health insurance', 'Performance bonus', 'Work from anywhere policy'],
    remote: true,
    posted: '2024-09-18T08:45:00Z',
    deadline: '2024-10-28T23:59:59Z',
    applicationCount: 92
  },
  {
    id: '9',
    title: 'Content Writer & SEO Specialist',
    company: 'Ruangguru',
    location: 'Bandung',
    type: 'full-time',
    experienceLevel: 'entry',
    salary: { min: 6000000, max: 10000000, currency: 'IDR' },
    description: 'Create engaging educational content dan optimize untuk SEO untuk platform edtech terbesar di Indonesia.',
    requirements: [
      '1-2 tahun pengalaman content writing',
      'Strong SEO knowledge dan keyword research',
      'Experience dengan content management systems',
      'Educational background atau interest di bidang edukasi',
      'Excellent Indonesian dan English writing skills'
    ],
    skills: ['Content Writing', 'SEO', 'Google Analytics', 'WordPress', 'Keyword Research', 'Copywriting'],
    benefits: ['Health insurance', 'Learning stipend', 'Flexible hours', 'Career mentorship'],
    remote: true,
    posted: '2024-09-17T15:20:00Z',
    deadline: '2024-10-15T23:59:59Z',
    applicationCount: 245
  },
  {
    id: '10',
    title: 'Business Development Manager',
    company: 'Dana',
    location: 'Jakarta',
    type: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 18000000, max: 30000000, currency: 'IDR' },
    description: 'Drive strategic partnerships dan business growth untuk digital wallet dan financial services platform.',
    requirements: [
      'Minimal 5 tahun pengalaman business development',
      'Strong network di industri fintech/banking',
      'Negotiation dan relationship building skills',
      'Strategic thinking dan market analysis abilities',
      'Track record dalam partnership deals'
    ],
    skills: ['Business Development', 'Partnership Management', 'Strategic Planning', 'Market Analysis', 'Negotiation'],
    benefits: ['High commission structure', 'Stock options', 'Health coverage', 'Travel budget'],
    remote: false,
    posted: '2024-09-16T10:00:00Z',
    deadline: '2024-11-10T23:59:59Z',
    isFeatured: true,
    applicationCount: 183
  },
  {
    id: '11',
    title: 'QA Engineer',
    company: 'Blibli',
    location: 'Jakarta',
    type: 'contract',
    experienceLevel: 'mid',
    salary: { min: 12000000, max: 18000000, currency: 'IDR' },
    description: 'Ensure quality standards untuk e-commerce platform melalui comprehensive testing strategies dan automation.',
    requirements: [
      '2-3 tahun pengalaman QA testing',
      'Experience dengan automation testing tools',
      'API testing dan performance testing knowledge',
      'Bug tracking dan test case management',
      'Agile/Scrum methodology familiarity'
    ],
    skills: ['Selenium', 'API Testing', 'Performance Testing', 'Cypress', 'Jest', 'JIRA', 'TestRail'],
    benefits: ['Flexible contract terms', 'Health allowance', 'Skill development budget'],
    remote: true,
    posted: '2024-09-15T12:15:00Z',
    deadline: '2024-10-31T23:59:59Z',
    applicationCount: 98
  },
  {
    id: '12',
    title: 'AI/ML Engineer',
    company: 'Kata.ai',
    location: 'Jakarta',
    type: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 22000000, max: 40000000, currency: 'IDR' },
    description: 'Build cutting-edge AI solutions untuk natural language processing dan conversational AI platforms.',
    requirements: [
      'Minimal 4 tahun pengalaman AI/ML development',
      'Strong background in NLP dan deep learning',
      'Experience dengan production ML systems',
      'Research background atau publications preferred',
      'Python dan ML frameworks expertise'
    ],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Deep Learning', 'MLOps', 'Kubernetes'],
    benefits: ['Top-tier salary', 'Research budget', 'Conference attendance', 'Stock options'],
    remote: true,
    posted: '2024-09-14T14:30:00Z',
    deadline: '2024-12-01T23:59:59Z',
    isUrgent: true,
    isFeatured: true,
    applicationCount: 56
  }
];

export const JOB_LOCATIONS = [
  'Jakarta',
  'Bandung', 
  'Surabaya',
  'Yogyakarta',
  'Medan',
  'Semarang',
  'Makassar',
  'Bali',
  'Remote',
  'Amerika Serikat',
  'Singapura',
  'Malaysia'
];

export const JOB_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'Go',
  'AWS', 'Google Cloud', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB',
  'Figma', 'Adobe XD', 'Sketch', 'UI/UX Design', 'Product Design',
  'Machine Learning', 'Data Science', 'SQL', 'Analytics', 'Big Data',
  'Marketing', 'SEO', 'Content Writing', 'Social Media', 'Digital Marketing',
  'Project Management', 'Agile', 'Scrum', 'Business Analysis',
  'Cybersecurity', 'DevOps', 'CI/CD', 'Testing', 'QA', 'Automation'
];

export const JOB_COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix',
  'Gojek', 'Tokopedia', 'Shopee', 'Bukalapak', 'OVO', 'Dana', 'Traveloka',
  'Ruangguru', 'Kata.ai', 'Blibli', 'Bank Mandiri', 'BCA', 'BNI',
  'TechStart Indonesia', 'Digital Nusantara', 'InnovaCorp'
];
