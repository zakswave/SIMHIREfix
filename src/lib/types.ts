
export interface SalaryRange {
  min: number;
  max: number;
  currency: 'IDR' | 'USD';
}

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';

export type ExperienceLevel = 'entry' | 'mid' | 'senior';

export type LocationMode = 'remote' | 'hybrid' | 'on-site';

export type ApplicationStatus = 
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'hired'
  | 'rejected';

export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';

export type UserRole = 'candidate' | 'company' | 'admin';

export type Currency = 'IDR' | 'USD';

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';

export type HiringStatus = 'active' | 'not_hiring' | 'paused';
