
export interface SimulasiCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  skills: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalTasks: number;
  participants: number;
  rating: number;
  badge?: string;
  color: string;
}

export interface SimulasiTask {
  id: string;
  categoryId: string;
  type: 'coding' | 'design' | 'analysis' | 'writing' | 'presentation' | 'problem-solving';
  title: string;
  description: string;
  instructions: string[];
  timeLimit: number;
  maxScore: number;
  criteria: AssessmentCriteria[];
  resources?: TaskResource[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AssessmentCriteria {
  name: string;
  weight: number;
  description: string;
}

export interface TaskResource {
  type: 'file' | 'link' | 'image' | 'video';
  name: string;
  url: string;
  description?: string;
}

export interface SimulasiResult {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  simulasiId: string;
  categoryId: string;
  categoryName: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  totalScore: number;
  maxScore: number;
  percentage: number;
  breakdown: {
    technical: number;
    creativity: number;
    efficiency: number;
    communication: number;
  };
  taskResults: TaskResult[];
  feedback: string;
  certificate?: string;
  rank?: number;
  badge?: string;
}

export interface TaskResult {
  taskId: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  submission?: any;
  feedback?: string;
}
export const SIMULASI_CATEGORIES: SimulasiCategory[] = [
  {
    id: 'frontend-dev',
    name: 'Frontend Development',
    icon: 'Code',
    description: 'Test kemampuan React, TypeScript, dan UI development modern',
    skills: ['React', 'TypeScript', 'CSS', 'Responsive Design'],
    duration: '2-3 jam',
    difficulty: 'intermediate',
    totalTasks: 4,
    participants: 1247,
    rating: 4.8,
    badge: 'Frontend Expert',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'backend-dev',
    name: 'Backend Development',
    icon: 'Server',
    description: 'Simulasi API development, database design, dan system architecture',
    skills: ['Node.js', 'Database', 'API Design', 'Security'],
    duration: '3-4 jam',
    difficulty: 'advanced',
    totalTasks: 5,
    participants: 892,
    rating: 4.7,
    badge: 'Backend Master',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    icon: 'TrendingUp',
    description: 'Campaign strategy, analytics, dan content marketing simulation',
    skills: ['Campaign Strategy', 'Analytics', 'Content Creation', 'SEO'],
    duration: '2 jam',
    difficulty: 'beginner',
    totalTasks: 3,
    participants: 2156,
    rating: 4.6,
    badge: 'Marketing Pro',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    icon: 'Palette',
    description: 'Design thinking, prototyping, dan user experience optimization',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    duration: '3 jam',
    difficulty: 'intermediate',
    totalTasks: 4,
    participants: 1683,
    rating: 4.9,
    badge: 'Design Expert',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    icon: 'BarChart3',
    description: 'Data processing, visualization, dan business insights',
    skills: ['Excel', 'Python', 'Data Visualization', 'Statistics'],
    duration: '2-3 jam',
    difficulty: 'intermediate',
    totalTasks: 4,
    participants: 1034,
    rating: 4.5,
    badge: 'Data Analyst',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'content-writing',
    name: 'Content Writing',
    icon: 'PenTool',
    description: 'Creative writing, copywriting, dan content strategy',
    skills: ['Copywriting', 'SEO Writing', 'Content Strategy', 'Social Media'],
    duration: '1-2 jam',
    difficulty: 'beginner',
    totalTasks: 3,
    participants: 1789,
    rating: 4.4,
    badge: 'Content Creator',
    color: 'from-teal-500 to-green-500'
  }
];
export const MOCK_SIMULASI_TASKS: SimulasiTask[] = [
  {
    id: 'frontend-task-1',
    categoryId: 'frontend-dev',
    type: 'coding',
    title: 'Responsive Landing Page',
    description: 'Buat landing page responsive menggunakan React dan Tailwind CSS',
    instructions: [
      'Buat komponen header dengan navigasi',
      'Implementasi hero section dengan CTA button',
      'Tambahkan section features dengan card layout',
      'Pastikan responsive di mobile dan desktop',
      'Gunakan Tailwind CSS untuk styling'
    ],
    timeLimit: 90,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Code Quality', weight: 30, description: 'Clean code, proper structure' },
      { name: 'Responsiveness', weight: 25, description: 'Mobile-first approach' },
      { name: 'Design Implementation', weight: 25, description: 'UI/UX accuracy' },
      { name: 'Performance', weight: 20, description: 'Loading speed, optimization' }
    ],
    resources: [
      { type: 'image', name: 'Design Mockup', url: '/assets/mockup-landing.png', description: 'Target design to implement' },
      { type: 'file', name: 'Assets.zip', url: '/assets/landing-assets.zip', description: 'Images and icons' }
    ]
  },
  {
    id: 'frontend-task-2',
    categoryId: 'frontend-dev',
    type: 'coding',
    title: 'Interactive Dashboard',
    description: 'Buat dashboard dengan chart dan real-time data',
    instructions: [
      'Implementasi chart menggunakan library',
      'Buat filter dan sorting functionality',
      'Tambahkan dark mode toggle',
      'Implementasi state management',
      'Buat responsive table dengan pagination'
    ],
    timeLimit: 120,
    maxScore: 100,
    difficulty: 'hard',
    criteria: [
      { name: 'Functionality', weight: 35, description: 'All features working' },
      { name: 'Code Architecture', weight: 25, description: 'Component structure' },
      { name: 'User Experience', weight: 25, description: 'Intuitive interface' },
      { name: 'Data Handling', weight: 15, description: 'State management' }
    ]
  },
  {
    id: 'frontend-task-3',
    categoryId: 'frontend-dev',
    type: 'problem-solving',
    title: 'Performance Optimization',
    description: 'Identifikasi dan fix performance issues pada aplikasi React',
    instructions: [
      'Analisis performance bottlenecks menggunakan React DevTools',
      'Implementasi lazy loading untuk komponen berat',
      'Optimize re-renders dengan React.memo dan useMemo',
      'Implement code splitting untuk bundle optimization',
      'Dokumentasikan improvement yang dilakukan'
    ],
    timeLimit: 45,
    maxScore: 100,
    difficulty: 'hard',
    criteria: [
      { name: 'Problem Identification', weight: 25, description: 'Akurasi identifikasi masalah' },
      { name: 'Solution Quality', weight: 35, description: 'Efektivitas solusi' },
      { name: 'Code Quality', weight: 25, description: 'Clean implementation' },
      { name: 'Documentation', weight: 15, description: 'Clear explanation' }
    ]
  },
  {
    id: 'frontend-task-4',
    categoryId: 'frontend-dev',
    type: 'coding',
    title: 'Form Validation & State Management',
    description: 'Buat complex form dengan validation dan error handling',
    instructions: [
      'Implementasi multi-step form wizard',
      'Tambahkan real-time validation',
      'Handle async submission dengan loading states',
      'Implement error handling dan user feedback',
      'Gunakan React Hook Form atau custom hooks'
    ],
    timeLimit: 60,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Functionality', weight: 30, description: 'Semua fitur bekerja' },
      { name: 'Validation Logic', weight: 25, description: 'Comprehensive validation' },
      { name: 'UX Design', weight: 25, description: 'User-friendly interface' },
      { name: 'Error Handling', weight: 20, description: 'Graceful error management' }
    ]
  },
  {
    id: 'backend-task-1',
    categoryId: 'backend-dev',
    type: 'coding',
    title: 'RESTful API Design',
    description: 'Design dan implement RESTful API untuk e-commerce platform',
    instructions: [
      'Design API endpoints untuk user, product, dan order management',
      'Implementasi proper HTTP methods (GET, POST, PUT, DELETE)',
      'Tambahkan authentication middleware dengan JWT',
      'Implement input validation dan error handling',
      'Dokumentasikan API dengan format OpenAPI/Swagger'
    ],
    timeLimit: 90,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'API Design', weight: 30, description: 'RESTful best practices' },
      { name: 'Security', weight: 25, description: 'Auth & authorization' },
      { name: 'Code Quality', weight: 25, description: 'Clean architecture' },
      { name: 'Documentation', weight: 20, description: 'API documentation' }
    ]
  },
  {
    id: 'backend-task-2',
    categoryId: 'backend-dev',
    type: 'design',
    title: 'Database Schema Design',
    description: 'Design database schema untuk social media application',
    instructions: [
      'Design entity relationship diagram (ERD)',
      'Define tables untuk users, posts, comments, likes',
      'Implement proper indexing strategy',
      'Handle many-to-many relationships',
      'Consider scalability dan normalization'
    ],
    timeLimit: 75,
    maxScore: 100,
    difficulty: 'hard',
    criteria: [
      { name: 'Schema Design', weight: 35, description: 'Database structure' },
      { name: 'Relationships', weight: 25, description: 'Proper associations' },
      { name: 'Optimization', weight: 20, description: 'Indexing & performance' },
      { name: 'Scalability', weight: 20, description: 'Future-proof design' }
    ]
  },
  {
    id: 'backend-task-3',
    categoryId: 'backend-dev',
    type: 'problem-solving',
    title: 'Caching Strategy Implementation',
    description: 'Implement caching untuk improve API performance',
    instructions: [
      'Analyze endpoints yang membutuhkan caching',
      'Implement Redis caching strategy',
      'Handle cache invalidation scenarios',
      'Implement cache warming untuk critical data',
      'Monitor dan measure performance improvement'
    ],
    timeLimit: 60,
    maxScore: 100,
    difficulty: 'hard',
    criteria: [
      { name: 'Strategy Design', weight: 30, description: 'Caching approach' },
      { name: 'Implementation', weight: 30, description: 'Code quality' },
      { name: 'Cache Invalidation', weight: 25, description: 'Data consistency' },
      { name: 'Performance Gain', weight: 15, description: 'Measured improvement' }
    ]
  },
  {
    id: 'backend-task-4',
    categoryId: 'backend-dev',
    type: 'coding',
    title: 'Microservices Communication',
    description: 'Design service communication untuk microservices architecture',
    instructions: [
      'Design message queue dengan RabbitMQ/Kafka',
      'Implement async event-driven communication',
      'Handle service failures dan retry logic',
      'Implement circuit breaker pattern',
      'Setup distributed tracing untuk monitoring'
    ],
    timeLimit: 90,
    maxScore: 100,
    difficulty: 'hard',
    criteria: [
      { name: 'Architecture Design', weight: 30, description: 'Service communication' },
      { name: 'Resilience', weight: 25, description: 'Error handling' },
      { name: 'Implementation', weight: 25, description: 'Code quality' },
      { name: 'Monitoring', weight: 20, description: 'Observability' }
    ]
  },
  {
    id: 'backend-task-5',
    categoryId: 'backend-dev',
    type: 'analysis',
    title: 'Security Audit & Implementation',
    description: 'Audit security vulnerabilities dan implement security best practices',
    instructions: [
      'Identify common vulnerabilities (OWASP Top 10)',
      'Implement input sanitization dan validation',
      'Setup rate limiting dan DDoS protection',
      'Implement proper error handling (no data leaks)',
      'Add security headers dan CORS configuration'
    ],
    timeLimit: 60,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Vulnerability Detection', weight: 30, description: 'Security analysis' },
      { name: 'Security Implementation', weight: 35, description: 'Fix quality' },
      { name: 'Best Practices', weight: 20, description: 'Industry standards' },
      { name: 'Documentation', weight: 15, description: 'Security guidelines' }
    ]
  },
  {
    id: 'uiux-task-1',
    categoryId: 'ui-ux-design',
    type: 'design',
    title: 'Mobile App Redesign',
    description: 'Redesign mobile app untuk improve user engagement',
    instructions: [
      'Conduct heuristic evaluation pada design existing',
      'Create user flow diagram untuk key features',
      'Design low-fidelity wireframes',
      'Create high-fidelity mockups di Figma',
      'Present design rationale dan expected improvements'
    ],
    timeLimit: 90,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'UX Research', weight: 25, description: 'User analysis' },
      { name: 'Visual Design', weight: 30, description: 'UI aesthetics' },
      { name: 'Usability', weight: 25, description: 'User-friendly interface' },
      { name: 'Presentation', weight: 20, description: 'Design rationale' }
    ]
  },
  {
    id: 'uiux-task-2',
    categoryId: 'ui-ux-design',
    type: 'problem-solving',
    title: 'Design System Creation',
    description: 'Buat design system untuk konsistensi UI components',
    instructions: [
      'Define color palette dengan accessibility check',
      'Create typography scale',
      'Design reusable component library',
      'Implement spacing dan layout system',
      'Document design guidelines'
    ],
    timeLimit: 75,
    maxScore: 100,
    difficulty: 'hard',
    criteria: [
      { name: 'System Design', weight: 30, description: 'Comprehensive system' },
      { name: 'Consistency', weight: 25, description: 'Unified approach' },
      { name: 'Accessibility', weight: 25, description: 'WCAG compliance' },
      { name: 'Documentation', weight: 20, description: 'Usage guidelines' }
    ]
  },
  {
    id: 'uiux-task-3',
    categoryId: 'ui-ux-design',
    type: 'analysis',
    title: 'User Research & Persona Development',
    description: 'Conduct user research dan create user personas',
    instructions: [
      'Analyze user behavior data',
      'Identify user pain points dan needs',
      'Create 2-3 detailed user personas',
      'Map user journey untuk each persona',
      'Present research findings dan recommendations'
    ],
    timeLimit: 60,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Research Quality', weight: 30, description: 'Data analysis' },
      { name: 'Persona Development', weight: 30, description: 'Detailed personas' },
      { name: 'Journey Mapping', weight: 25, description: 'User flow accuracy' },
      { name: 'Insights', weight: 15, description: 'Actionable recommendations' }
    ]
  },
  {
    id: 'uiux-task-4',
    categoryId: 'ui-ux-design',
    type: 'design',
    title: 'Prototyping & User Testing',
    description: 'Create interactive prototype dan conduct usability testing',
    instructions: [
      'Build interactive prototype di Figma',
      'Design user testing script',
      'Conduct usability testing (5 users minimum)',
      'Analyze testing results',
      'Iterate design based on feedback'
    ],
    timeLimit: 90,
    maxScore: 100,
    difficulty: 'hard',
    criteria: [
      { name: 'Prototype Quality', weight: 30, description: 'Interactive fidelity' },
      { name: 'Testing Method', weight: 25, description: 'Test validity' },
      { name: 'Analysis', weight: 25, description: 'Insight quality' },
      { name: 'Iteration', weight: 20, description: 'Design improvements' }
    ]
  },
  {
    id: 'data-task-1',
    categoryId: 'data-analysis',
    type: 'analysis',
    title: 'Sales Data Analysis',
    description: 'Analyze sales data dan identify business insights',
    instructions: [
      'Clean dan prepare dataset untuk analysis',
      'Perform exploratory data analysis (EDA)',
      'Identify sales trends dan patterns',
      'Create visualizations menggunakan Python/Excel',
      'Present actionable business recommendations'
    ],
    timeLimit: 75,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Data Cleaning', weight: 20, description: 'Data preparation' },
      { name: 'Analysis Depth', weight: 30, description: 'Insight quality' },
      { name: 'Visualization', weight: 25, description: 'Chart effectiveness' },
      { name: 'Recommendations', weight: 25, description: 'Business value' }
    ]
  },
  {
    id: 'data-task-2',
    categoryId: 'data-analysis',
    type: 'coding',
    title: 'Predictive Model Development',
    description: 'Build predictive model untuk customer churn',
    instructions: [
      'Explore dan understand dataset',
      'Feature engineering dan selection',
      'Train machine learning model',
      'Evaluate model performance',
      'Explain model predictions'
    ],
    timeLimit: 90,
    maxScore: 100,
    difficulty: 'hard',
    criteria: [
      { name: 'Feature Engineering', weight: 25, description: 'Feature quality' },
      { name: 'Model Selection', weight: 30, description: 'Algorithm choice' },
      { name: 'Performance', weight: 25, description: 'Model accuracy' },
      { name: 'Interpretation', weight: 20, description: 'Explainability' }
    ]
  },
  {
    id: 'data-task-3',
    categoryId: 'data-analysis',
    type: 'presentation',
    title: 'Dashboard Creation',
    description: 'Create interactive business intelligence dashboard',
    instructions: [
      'Design dashboard layout dan metrics',
      'Implement KPIs dan trend charts',
      'Add interactive filters',
      'Create drill-down capabilities',
      'Present dashboard demo'
    ],
    timeLimit: 60,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Dashboard Design', weight: 25, description: 'Layout & UX' },
      { name: 'Metrics Selection', weight: 30, description: 'Relevant KPIs' },
      { name: 'Interactivity', weight: 25, description: 'User functionality' },
      { name: 'Presentation', weight: 20, description: 'Demo quality' }
    ]
  },
  {
    id: 'data-task-4',
    categoryId: 'data-analysis',
    type: 'problem-solving',
    title: 'A/B Test Analysis',
    description: 'Analyze A/B test results dan provide recommendations',
    instructions: [
      'Calculate statistical significance',
      'Analyze conversion metrics',
      'Identify winning variant',
      'Assess business impact',
      'Provide implementation recommendations'
    ],
    timeLimit: 45,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Statistical Analysis', weight: 35, description: 'Test validity' },
      { name: 'Metric Analysis', weight: 25, description: 'Performance evaluation' },
      { name: 'Business Impact', weight: 25, description: 'ROI assessment' },
      { name: 'Recommendations', weight: 15, description: 'Next steps' }
    ]
  },
  {
    id: 'marketing-task-1',
    categoryId: 'digital-marketing',
    type: 'analysis',
    title: 'Campaign Strategy Analysis',
    description: 'Analisis performa campaign dan buat rekomendasi improvement',
    instructions: [
      'Analisis data campaign yang diberikan',
      'Identifikasi pain points dan opportunities',
      'Buat rekomendasi strategy improvement',
      'Presentasikan findings dalam format slide',
      'Sertakan budget allocation suggestion'
    ],
    timeLimit: 60,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Data Analysis', weight: 30, description: 'Insight accuracy' },
      { name: 'Strategic Thinking', weight: 30, description: 'Recommendation quality' },
      { name: 'Presentation', weight: 25, description: 'Clear communication' },
      { name: 'Creativity', weight: 15, description: 'Innovative solutions' }
    ]
  },
  {
    id: 'marketing-task-2',
    categoryId: 'digital-marketing',
    type: 'writing',
    title: 'Social Media Campaign',
    description: 'Create comprehensive social media campaign strategy',
    instructions: [
      'Define campaign objectives dan target audience',
      'Create content calendar untuk 1 bulan',
      'Write engaging copy untuk 10 posts',
      'Design campaign hashtag strategy',
      'Plan influencer collaboration approach'
    ],
    timeLimit: 75,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Strategy', weight: 30, description: 'Campaign planning' },
      { name: 'Content Quality', weight: 30, description: 'Copy effectiveness' },
      { name: 'Creativity', weight: 25, description: 'Original ideas' },
      { name: 'Execution Plan', weight: 15, description: 'Implementation details' }
    ]
  },
  {
    id: 'marketing-task-3',
    categoryId: 'digital-marketing',
    type: 'analysis',
    title: 'SEO Audit & Optimization',
    description: 'Perform SEO audit dan create optimization plan',
    instructions: [
      'Analyze website technical SEO',
      'Conduct keyword research',
      'Evaluate content quality dan relevance',
      'Identify backlink opportunities',
      'Create 3-month SEO improvement roadmap'
    ],
    timeLimit: 60,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Technical Audit', weight: 25, description: 'SEO analysis' },
      { name: 'Keyword Strategy', weight: 30, description: 'Research quality' },
      { name: 'Content Plan', weight: 25, description: 'Optimization strategy' },
      { name: 'Roadmap', weight: 20, description: 'Action plan' }
    ]
  },
  {
    id: 'content-task-1',
    categoryId: 'content-writing',
    type: 'writing',
    title: 'Blog Post Writing',
    description: 'Write SEO-optimized blog post untuk target audience',
    instructions: [
      'Research topic dan identify keywords',
      'Create compelling headline dan introduction',
      'Write informative content dengan proper structure',
      'Include internal/external links',
      'Add meta description dan SEO optimization'
    ],
    timeLimit: 60,
    maxScore: 100,
    difficulty: 'easy',
    criteria: [
      { name: 'Content Quality', weight: 35, description: 'Writing quality' },
      { name: 'SEO Optimization', weight: 25, description: 'Keyword usage' },
      { name: 'Structure', weight: 20, description: 'Readability' },
      { name: 'Engagement', weight: 20, description: 'Reader value' }
    ]
  },
  {
    id: 'content-task-2',
    categoryId: 'content-writing',
    type: 'writing',
    title: 'Product Description',
    description: 'Create persuasive product descriptions untuk e-commerce',
    instructions: [
      'Write 5 product descriptions (100-150 words each)',
      'Highlight key features dan benefits',
      'Use persuasive copywriting techniques',
      'Include call-to-action',
      'Optimize untuk search engines'
    ],
    timeLimit: 45,
    maxScore: 100,
    difficulty: 'easy',
    criteria: [
      { name: 'Persuasiveness', weight: 35, description: 'Sales impact' },
      { name: 'Clarity', weight: 25, description: 'Clear messaging' },
      { name: 'Feature Highlight', weight: 25, description: 'Product benefits' },
      { name: 'SEO', weight: 15, description: 'Keyword integration' }
    ]
  },
  {
    id: 'content-task-3',
    categoryId: 'content-writing',
    type: 'writing',
    title: 'Email Marketing Campaign',
    description: 'Write email sequence untuk lead nurturing',
    instructions: [
      'Write 3-email sequence (welcome, value, conversion)',
      'Create subject lines dengan high open rate',
      'Include personalization elements',
      'Write compelling CTAs',
      'Explain email sequence strategy'
    ],
    timeLimit: 60,
    maxScore: 100,
    difficulty: 'medium',
    criteria: [
      { name: 'Strategy', weight: 25, description: 'Sequence planning' },
      { name: 'Copywriting', weight: 35, description: 'Email effectiveness' },
      { name: 'Personalization', weight: 20, description: 'Reader relevance' },
      { name: 'CTA Quality', weight: 20, description: 'Conversion potential' }
    ]
  }
];
export const MOCK_SIMULASI_RESULTS: SimulasiResult[] = [
  {
    id: 'result-1',
    candidateId: 'user-1',
    candidateName: 'Ahmad Zulkarnain',
    simulasiId: 'sim-1',
    categoryId: 'frontend-dev',
    categoryName: 'Frontend Development',
    startedAt: new Date('2024-01-15T09:00:00'),
    completedAt: new Date('2024-01-15T11:30:00'),
    status: 'completed',
    totalScore: 95,
    maxScore: 100,
    percentage: 95,
    breakdown: {
      technical: 98,
      creativity: 92,
      efficiency: 95,
      communication: 95
    },
    taskResults: [
      { taskId: 'frontend-task-1', score: 95, maxScore: 100, timeSpent: 85 }
    ],
    feedback: 'Outstanding performance! Excellent code quality and attention to detail.',
    rank: 1,
    badge: 'Frontend Expert'
  },
  {
    id: 'result-2',
    candidateId: 'user-2',
    candidateName: 'Siti Nurhaliza',
    simulasiId: 'sim-2',
    categoryId: 'frontend-dev',
    categoryName: 'Frontend Development',
    startedAt: new Date('2024-01-14T10:00:00'),
    completedAt: new Date('2024-01-14T12:15:00'),
    status: 'completed',
    totalScore: 92,
    maxScore: 100,
    percentage: 92,
    breakdown: {
      technical: 94,
      creativity: 90,
      efficiency: 91,
      communication: 93
    },
    taskResults: [
      { taskId: 'frontend-task-1', score: 92, maxScore: 100, timeSpent: 80 }
    ],
    feedback: 'Great work! Clean code and excellent UI implementation.',
    rank: 2,
    badge: 'Frontend Expert'
  },
  {
    id: 'result-3',
    candidateId: 'user-3',
    candidateName: 'Budi Santoso',
    simulasiId: 'sim-3',
    categoryId: 'frontend-dev',
    categoryName: 'Frontend Development',
    startedAt: new Date('2024-01-13T14:00:00'),
    completedAt: new Date('2024-01-13T16:20:00'),
    status: 'completed',
    totalScore: 87,
    maxScore: 100,
    percentage: 87,
    breakdown: {
      technical: 90,
      creativity: 85,
      efficiency: 88,
      communication: 85
    },
    taskResults: [
      { taskId: 'frontend-task-1', score: 87, maxScore: 100, timeSpent: 85 }
    ],
    feedback: 'Good work on responsive design. Consider improving performance optimization.',
    rank: 3,
    badge: 'Frontend Expert'
  }
];
export const getSimulasiByCategory = (categoryId: string) => {
  return MOCK_SIMULASI_TASKS.filter(task => task.categoryId === categoryId);
};

export const getSimulasiResult = (candidateId: string, simulasiId: string) => {
  return MOCK_SIMULASI_RESULTS.find(
    result => result.candidateId === candidateId && result.simulasiId === simulasiId
  );
};

export const calculateOverallRating = (results: SimulasiResult[]) => {
  if (results.length === 0) return 0;
  const totalPercentage = results.reduce((sum, result) => sum + result.percentage, 0);
  return Math.round(totalPercentage / results.length);
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
    case 'easy':
      return 'text-green-600 bg-green-100 border-green-200';
    case 'intermediate':
    case 'medium':
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'advanced':
    case 'hard':
      return 'text-red-600 bg-red-100 border-red-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

export const getRankColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-600';
  if (rank === 2) return 'text-gray-500';
  if (rank === 3) return 'text-orange-600';
  return 'text-gray-700';
};
