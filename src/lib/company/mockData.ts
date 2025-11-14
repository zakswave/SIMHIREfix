import {
  CompanyProfile,
  JobPost,
  JobApplication,
  EvaluationTemplate,
  TalentPool,
  TeamMember,
  EscrowContract,
  ActivityEvent,
  CandidateProfile
} from './types';
export const MOCK_COMPANY_PROFILE: CompanyProfile = {
  id: 'comp-1',
  userId: 'c456',
  name: 'PT TechStart Indonesia',
  logoUrl: undefined,
  industry: 'Technology',
  size: '51-200',
  location: 'Jakarta, Indonesia',
  description: 'Membangun solusi teknologi inovatif untuk transformasi digital Indonesia. Kami fokus pada pengembangan aplikasi web dan mobile yang scalable.',
  website: 'https://example.com',
socialLinks: {
    linkedin: 'techstart-indonesia',
    twitter: 'techstart_id'
  },
  hiringStatus: 'active',
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-09-25T10:30:00Z'
};
export const MOCK_JOB_POSTS: JobPost[] = [
  {
    id: 'job-1',
    companyId: 'comp-1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    employmentType: 'full-time',
    experienceLevel: 'senior',
    locationMode: 'hybrid',
    location: 'Jakarta',
    salaryMin: 15000000,
    salaryMax: 25000000,
    currency: 'IDR',
    description: 'Kami mencari Senior Frontend Developer yang berpengalaman untuk membangun aplikasi web modern dengan React dan TypeScript.',
    requirements: [
      'Minimal 5 tahun pengalaman frontend development',
      'Mahir React, TypeScript, dan Next.js',
      'Pengalaman dengan state management (Redux/Zustand)',
      'Familiar dengan testing (Jest, Cypress)',
      'Portfolio project yang strong'
    ],
    benefits: ['Asuransi kesehatan', 'Remote working', 'Training budget', 'Stock options'],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Jest'],
    status: 'open',
    isUrgent: true,
    isFeatured: true,
    createdAt: '2024-09-20T08:00:00Z',
    publishedAt: '2024-09-20T10:00:00Z',
    applicationCount: 23,
    viewCount: 145
  },
  {
    id: 'job-2',
    companyId: 'comp-1',
    title: 'Product Designer',
    department: 'Design',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    locationMode: 'remote',
    location: 'Indonesia',
    salaryMin: 10000000,
    salaryMax: 16000000,
    currency: 'IDR',
    description: 'Join our design team to create exceptional user experiences for our B2B and B2C products.',
    requirements: [
      '3-4 tahun pengalaman UI/UX design',
      'Proficient dalam Figma dan design systems',
      'Pengalaman user research dan testing',
      'Portfolio yang menunjukkan design thinking'
    ],
    benefits: ['Health insurance', 'Flexible hours', 'Design tools budget'],
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
    status: 'open',
    isFeatured: false,
    createdAt: '2024-09-18T14:30:00Z',
    publishedAt: '2024-09-18T16:00:00Z',
    applicationCount: 17,
    viewCount: 89
  },
  {
    id: 'job-3',
    companyId: 'comp-1',
    title: 'DevOps Engineer',
    department: 'Engineering',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    locationMode: 'hybrid',
    location: 'Jakarta',
    salaryMin: 14000000,
    salaryMax: 22000000,
    currency: 'IDR',
    description: 'Manage dan improve infrastructure untuk mendukung growth platform dengan jutaan user.',
    requirements: [
      'Minimal 3 tahun pengalaman DevOps/SRE',
      'Expert level AWS atau Google Cloud',
      'Strong automation skills (Terraform, Ansible)',
      'Monitoring dan observability expertise'
    ],
    benefits: ['Stock options', 'Training budget', 'Health coverage'],
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Prometheus', 'Docker'],
    status: 'draft',
    createdAt: '2024-09-25T11:00:00Z',
    applicationCount: 0,
    viewCount: 12
  }
];
export const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    candidateId: 'cand-1',
    candidateName: 'Budi Santoso',
    candidateEmail: 'budi@email.com',
    candidatePhone: '+6281234567890',
    candidateLocation: 'Jakarta',
    candidateSkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    coverLetter: 'Saya tertarik untuk berkontribusi dalam pengembangan produk teknologi yang inovatif.',
    stage: 'interview',
    scoreOverall: 8,
    reviewerNotes: [
      'Portfolio sangat impressive',
      'Pengalaman technical leadership yang baik',
      'Interview technical: 8/10'
    ],
    appliedAt: '2024-09-21T09:15:00Z',
    lastStageChange: '2024-09-24T14:30:00Z',
    interviewScheduled: '2024-09-26T10:00:00Z',
    salaryExpectation: 22000000
  },
  {
    id: 'app-2',
    jobId: 'job-1',
    candidateId: 'cand-2',
    candidateName: 'Siti Nurhaliza',
    candidateEmail: 'siti@email.com',
    candidateLocation: 'Bandung',
    candidateSkills: ['React', 'Vue.js', 'Python', 'PostgreSQL'],
    coverLetter: 'Saya memiliki passion dalam frontend development dan ingin berkembang di perusahaan yang growth-oriented.',
    stage: 'screening',
    scoreOverall: 7,
    reviewerNotes: [
      'Background academic yang solid',
      'Butuh assess technical lebih lanjut'
    ],
    appliedAt: '2024-09-22T13:45:00Z',
    lastStageChange: '2024-09-23T16:20:00Z',
    salaryExpectation: 18000000
  },
  {
    id: 'app-3',
    jobId: 'job-2',
    candidateId: 'cand-3',
    candidateName: 'Ahmad Fauzi',
    candidateEmail: 'ahmad@email.com',
    candidateLocation: 'Yogyakarta',
    candidateSkills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    stage: 'applied',
    reviewerNotes: [],
    appliedAt: '2024-09-24T08:30:00Z',
    lastStageChange: '2024-09-24T08:30:00Z',
    salaryExpectation: 14000000
  },
  {
    id: 'app-4',
    jobId: 'job-1',
    candidateId: 'cand-4',
    candidateName: 'Lisa Permata',
    candidateEmail: 'lisa@email.com',
    candidateLocation: 'Surabaya',
    candidateSkills: ['React', 'TypeScript', 'GraphQL', 'Jest'],
    stage: 'offer',
    scoreOverall: 9,
    reviewerNotes: [
      'Excellent technical skills',
      'Great cultural fit',
      'Final interview: 9/10',
      'Offer extended: 23M IDR'
    ],
    appliedAt: '2024-09-19T11:20:00Z',
    lastStageChange: '2024-09-25T15:45:00Z',
    salaryExpectation: 23000000
  }
];
export const MOCK_EVALUATION_TEMPLATES: EvaluationTemplate[] = [
  {
    id: 'eval-1',
    companyId: 'comp-1',
    name: 'Technical Interview - Frontend',
    description: 'Standar evaluasi untuk posisi frontend developer',
    criteria: [
      { id: 'tech-skills', label: 'Technical Skills', description: 'Kemampuan coding dan problem solving', weight: 40, maxScore: 10 },
      { id: 'system-design', label: 'System Design', description: 'Kemampuan merancang arsitektur frontend', weight: 25, maxScore: 10 },
      { id: 'communication', label: 'Communication', description: 'Kemampuan komunikasi dan kolaborasi', weight: 20, maxScore: 10 },
      { id: 'culture-fit', label: 'Culture Fit', description: 'Kesesuaian dengan budaya perusahaan', weight: 15, maxScore: 10 }
    ],
    isDefault: true,
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-09-01T14:30:00Z'
  },
  {
    id: 'eval-2',
    companyId: 'comp-1',
    name: 'Design Portfolio Review',
    description: 'Template evaluasi untuk review portfolio designer',
    criteria: [
      { id: 'portfolio-quality', label: 'Portfolio Quality', description: 'Kualitas dan keberagaman portfolio', weight: 35, maxScore: 10 },
      { id: 'design-process', label: 'Design Process', description: 'Pemahaman design thinking dan process', weight: 30, maxScore: 10 },
      { id: 'visual-skills', label: 'Visual Skills', description: 'Kemampuan visual dan aesthetic sense', weight: 25, maxScore: 10 },
      { id: 'ux-thinking', label: 'UX Thinking', description: 'Pemahaman user experience dan usability', weight: 10, maxScore: 10 }
    ],
    isDefault: false,
    createdAt: '2024-08-15T09:30:00Z',
    updatedAt: '2024-08-15T09:30:00Z'
  }
];
export const MOCK_TALENT_POOLS: TalentPool[] = [
  {
    id: 'pool-1',
    companyId: 'comp-1',
    name: 'Senior Developers',
    description: 'Pool kandidat developer berpengalaman untuk posisi senior',
    candidateIds: ['cand-1', 'cand-4'],
    tags: ['frontend', 'backend', 'fullstack', 'senior'],
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-09-25T16:00:00Z'
  },
  {
    id: 'pool-2',
    companyId: 'comp-1',
    name: 'Design Talent Pipeline',
    description: 'Kandidat designer untuk future openings',
    candidateIds: ['cand-3'],
    tags: ['design', 'ui/ux', 'product-design'],
    createdAt: '2024-09-01T14:30:00Z',
    updatedAt: '2024-09-24T08:30:00Z'
  }
];
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    companyId: 'comp-1',
    userId: 'c456',
    name: 'PT TechStart Indonesia',
    email: 'hr@techstart.id',
    role: 'owner',
    permissions: ['all'],
    invitedAt: '2024-01-15T08:00:00Z',
    joinedAt: '2024-01-15T08:00:00Z',
    status: 'active'
  },
  {
    id: 'team-2',
    companyId: 'comp-1',
    userId: 'hr-001',
    name: 'Sarah Wijaya',
    email: 'sarah@techstart.id',
    role: 'recruiter',
    permissions: ['jobs.read', 'jobs.write', 'applications.read', 'applications.write', 'candidates.read'],
    invitedAt: '2024-02-01T09:00:00Z',
    joinedAt: '2024-02-02T08:30:00Z',
    status: 'active'
  },
  {
    id: 'team-3',
    companyId: 'comp-1',
    userId: 'lead-001',
    name: 'Andi Pratama',
    email: 'andi@techstart.id',
    role: 'interviewer',
    permissions: ['applications.read', 'evaluations.read', 'evaluations.write'],
    invitedAt: '2024-03-15T10:00:00Z',
    joinedAt: '2024-03-16T09:15:00Z',
    status: 'active'
  }
];
export const MOCK_ESCROW_CONTRACTS: EscrowContract[] = [
  {
    id: 'contract-1',
    companyId: 'comp-1',
    candidateId: 'cand-1',
    candidateName: 'Budi Santoso',
    candidateEmail: 'budi@email.com',
    jobTitle: 'Senior Frontend Developer',
    title: 'Frontend Development Project - Q4 2024',
    description: 'Kontrak pengembangan aplikasi dashboard analytics untuk internal tools',
    amount: 45000000,
    currency: 'IDR',
    duration: 6,
    status: 'in_progress',
    milestones: [
      {
        id: 'milestone-1',
        title: 'UI Design & Prototype',
        description: 'Menyelesaikan design system dan prototype interaktif',
        amount: 15000000,
        dueDate: '2024-10-15T23:59:59Z',
        completedAt: '2024-10-12T14:30:00Z',
        status: 'completed'
      },
      {
        id: 'milestone-2',
        title: 'Core Features Development',
        description: 'Implementasi fitur utama dashboard',
        amount: 20000000,
        dueDate: '2024-11-15T23:59:59Z',
        status: 'in_progress'
      },
      {
        id: 'milestone-3',
        title: 'Testing & Deployment',
        description: 'Testing end-to-end dan deployment production',
        amount: 10000000,
        dueDate: '2024-12-01T23:59:59Z',
        status: 'pending'
      }
    ],
    createdAt: '2024-09-01T10:00:00Z',
    fundedAt: '2024-09-03T15:20:00Z'
  },
  {
    id: 'contract-2',
    companyId: 'comp-1',
    candidateId: 'cand-3',
    candidateName: 'Ahmad Fauzi',
    candidateEmail: 'ahmad@email.com',
    jobTitle: 'Product Designer',
    title: 'UX Research & Design Sprint',
    description: 'Melakukan user research dan redesign untuk mobile app',
    amount: 25000000,
    currency: 'IDR',
    duration: 3,
    status: 'funded',
    milestones: [
      {
        id: 'milestone-4',
        title: 'User Research',
        description: 'Melakukan interview dan usability testing dengan 20 users',
        amount: 12000000,
        dueDate: '2024-10-30T23:59:59Z',
        status: 'in_progress'
      },
      {
        id: 'milestone-5',
        title: 'Design & Prototype',
        description: 'Membuat high-fidelity design dan interactive prototype',
        amount: 13000000,
        dueDate: '2024-11-30T23:59:59Z',
        status: 'pending'
      }
    ],
    createdAt: '2024-09-20T11:00:00Z',
    fundedAt: '2024-09-22T16:45:00Z'
  }
];
export const MOCK_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'activity-1',
    companyId: 'comp-1',
    actorId: 'hr-001',
    actorName: 'Sarah Wijaya',
    entityType: 'application',
    entityId: 'app-1',
    action: 'stage_changed',
    metadata: { from: 'screening', to: 'interview', jobTitle: 'Senior Frontend Developer' },
    createdAt: '2024-09-24T14:30:00Z'
  },
  {
    id: 'activity-2',
    companyId: 'comp-1',
    actorId: 'c456',
    actorName: 'PT TechStart Indonesia',
    entityType: 'job',
    entityId: 'job-1',
    action: 'created',
    metadata: { jobTitle: 'Senior Frontend Developer', department: 'Engineering' },
    createdAt: '2024-09-20T08:00:00Z'
  },
  {
    id: 'activity-3',
    companyId: 'comp-1',
    actorId: 'lead-001',
    actorName: 'Andi Pratama',
    entityType: 'application',
    entityId: 'app-4',
    action: 'evaluated',
    metadata: { score: 9, jobTitle: 'Senior Frontend Developer', candidateName: 'Lisa Permata' },
    createdAt: '2024-09-25T11:15:00Z'
  },
  {
    id: 'activity-4',
    companyId: 'comp-1',
    actorId: 'c456',
    actorName: 'PT TechStart Indonesia',
    entityType: 'contract',
    entityId: 'contract-1',
    action: 'milestone_completed',
    metadata: { contractTitle: 'Frontend Development Project - Q4 2024', milestoneTitle: 'UI Design & Prototype' },
    createdAt: '2024-10-12T14:30:00Z'
  }
];
export const MOCK_CANDIDATE_PROFILES: CandidateProfile[] = [
  {
    id: 'cand-1',
    name: 'Budi Santoso',
    email: 'budi@email.com',
    headline: 'Senior Frontend Developer',
    location: 'Jakarta',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL', 'Jest'],
    experience: 5,
    education: 'S1 Computer Science - University of Indonesia',
    portfolioShared: true,
    resumeUrl: 'https://example.com',
profileCompleteness: 95,
    lastActive: '2024-09-25T16:30:00Z',
    applicationHistory: [
      { jobTitle: 'Senior Frontend Developer', companyName: 'PT TechStart Indonesia', stage: 'interview', appliedAt: '2024-09-21T09:15:00Z' },
      { jobTitle: 'React Developer', companyName: 'PT Digital Nusantara', stage: 'hired', appliedAt: '2024-07-10T10:00:00Z' }
    ]
  },
  {
    id: 'cand-2',
    name: 'Siti Nurhaliza',
    headline: 'Frontend Developer',
    location: 'Bandung',
    skills: ['React', 'Vue.js', 'Python', 'PostgreSQL', 'Tailwind CSS'],
    experience: 3,
    education: 'S1 Information Technology - ITB',
    portfolioShared: false,
    profileCompleteness: 80,
    lastActive: '2024-09-24T14:20:00Z',
    applicationHistory: [
      { jobTitle: 'Senior Frontend Developer', companyName: 'PT TechStart Indonesia', stage: 'screening', appliedAt: '2024-09-22T13:45:00Z' }
    ]
  },
  {
    id: 'cand-3',
    name: 'Ahmad Fauzi',
    headline: 'Product Designer',
    location: 'Yogyakarta',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
    experience: 4,
    education: 'S1 Visual Communication Design - ISI Yogyakarta',
    portfolioShared: true,
    profileCompleteness: 90,
    lastActive: '2024-09-25T08:15:00Z',
    applicationHistory: [
      { jobTitle: 'Product Designer', companyName: 'PT TechStart Indonesia', stage: 'applied', appliedAt: '2024-09-24T08:30:00Z' },
      { jobTitle: 'UX Designer', companyName: 'StartupXYZ', stage: 'rejected', appliedAt: '2024-08-15T11:00:00Z' }
    ]
  },
  {
    id: 'cand-4',
    name: 'Lisa Permata',
    email: 'lisa@email.com',
    headline: 'Full Stack Developer',
    location: 'Surabaya',
    skills: ['React', 'TypeScript', 'GraphQL', 'Jest', 'Node.js', 'MongoDB'],
    experience: 4,
    education: 'S1 Computer Engineering - ITS',
    portfolioShared: true,
    resumeUrl: 'https://example.com',
profileCompleteness: 100,
    lastActive: '2024-09-25T17:00:00Z',
    applicationHistory: [
      { jobTitle: 'Senior Frontend Developer', companyName: 'PT TechStart Indonesia', stage: 'offer', appliedAt: '2024-09-19T11:20:00Z' }
    ]
  }
];
export const MOCK_COMPANY_DATA = {
  profile: MOCK_COMPANY_PROFILE,
  jobs: MOCK_JOB_POSTS,
  applications: MOCK_APPLICATIONS,
  evaluationTemplates: MOCK_EVALUATION_TEMPLATES,
  talentPools: MOCK_TALENT_POOLS,
  teamMembers: MOCK_TEAM_MEMBERS,
  contracts: MOCK_ESCROW_CONTRACTS,
  activities: MOCK_ACTIVITY_EVENTS,
  candidates: MOCK_CANDIDATE_PROFILES
};
