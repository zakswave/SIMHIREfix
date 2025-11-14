import type { SalaryRange, EmploymentType, ExperienceLevel, LocationMode, ApplicationStatus, JobStatus, UserRole, Currency, CompanySize, HiringStatus } from '../types';

export type ApplicationStage = ApplicationStatus;
export type ContractStatus = 'draft' | 'awaiting_funding' | 'funded' | 'in_progress' | 'submitted' | 'released' | 'cancelled' | 'disputed' | 'resolved' | 'active' | 'pending' | 'completed';
export type { SalaryRange, EmploymentType, ExperienceLevel, LocationMode, ApplicationStatus, JobStatus, UserRole, Currency, CompanySize, HiringStatus };
export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  logoUrl?: string;
  industry: string;
  size: CompanySize;
  location: string;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  hiringStatus: HiringStatus;
  createdAt: string;
  updatedAt: string;
}
export interface JobPost {
  id: string;
  companyId: string;
  title: string;
  department: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  locationMode: LocationMode;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: Currency;
  salaryRange?: SalaryRange;
  description: string;
  requirements: string[];
  benefits?: string[];
  skills: string[];
  status: JobStatus;
  isUrgent?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  publishedAt?: string;
  closedAt?: string;
  applicationCount: number;
  viewCount: number;
}
export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateLocation?: string;
  candidateSkills: string[];
  coverLetter?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  stage: ApplicationStatus;
  scoreOverall?: number;
  reviewerNotes: string[];
  appliedAt: string;
  lastStageChange: string;
  interviewScheduled?: string;
  salaryExpectation?: number;
}
export interface EvaluationTemplate {
  id: string;
  companyId: string;
  name: string;
  description: string;
  criteria: EvaluationCriteria[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationCriteria {
  id: string;
  label: string;
  description?: string;
  weight: number;
  maxScore: number;
}
export interface ApplicationEvaluation {
  id: string;
  applicationId: string;
  templateId: string;
  evaluatorId: string;
  scores: Record<string, number>;
  totalScore: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
export interface TalentPool {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  candidateIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
export interface TeamMember {
  id: string;
  companyId: string;
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'recruiter' | 'interviewer' | 'viewer';
  permissions: string[];
  invitedAt: string;
  joinedAt?: string;
  status: 'pending' | 'active' | 'suspended';
}
export interface EscrowContract {
  id: string;
  companyId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  jobId?: string;
  title: string;
  description: string;
  amount: number;
  currency: 'IDR' | 'USD';
  duration: number;
  status: ContractStatus;
  milestones: ContractMilestone[];
  createdAt: string;
  fundedAt?: string;
  completedAt?: string;
  releasedAt?: string;
  disputeReason?: string;
}

export interface ContractMilestone {
  id: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
  completedAt?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved' | 'disputed';
}
export interface ActivityEvent {
  id: string;
  companyId: string;
  actorId: string;
  actorName: string;
  entityType: 'job' | 'application' | 'candidate' | 'contract' | 'team';
  entityId: string;
  action: string;
  metadata: Record<string, any>;
  createdAt: string;
}
export interface CompanyMetrics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
  averageTimeToHire: number;
  conversionRate: number;
  topSkillsInDemand: Array<{ skill: string; count: number }>;
  applicationsByStage: Record<ApplicationStage, number>;
  applicationsOverTime: Array<{ date: string; count: number }>;
}
export interface CandidateProfile {
  id: string;
  name: string;
  email?: string;
  title?: string;
  headline?: string;
  location?: string;
  skills: string[];
  experience?: number;
  education?: string;
  availability?: 'available' | 'busy' | 'not_available' | 'open_to_offers' | 'not_looking';
  about?: string;
  salaryExpectation?: number | { min: number; max: number; currency: string };
  portfolioShared: boolean;
  resumeUrl?: string;
  profileCompleteness: number;
  lastActive: string;
  phone?: string;
  portfolio?: string;
  createdAt?: string;
  updatedAt?: string;
  applicationHistory: Array<{
    jobTitle: string;
    companyName: string;
    stage: ApplicationStage;
    appliedAt: string;
  }>;
}
export interface CreateJobFormData {
  title: string;
  department: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  locationMode: LocationMode;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  isUrgent: boolean;
}

export interface UpdateApplicationStageData {
  applicationId: string;
  newStage: ApplicationStage;
  notes?: string;
  scheduledDate?: string;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
export interface JobFilter {
  status?: JobStatus[];
  employmentType?: EmploymentType[];
  experienceLevel?: ExperienceLevel[];
  department?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ApplicationFilter {
  stage?: ApplicationStage[];
  jobId?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  scoreRange?: {
    min: number;
    max: number;
  };
}

export interface CandidateSearchFilter {
  skills?: string[];
  location?: string[];
  experience?: ExperienceLevel[];
  availability?: boolean;
  salaryRange?: {
    min: number;
    max: number;
  };
}
