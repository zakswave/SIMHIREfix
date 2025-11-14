
export interface InternshipCompany {
  name: string;
  logo: string;
  location: string;
  description?: string;
}

export interface Internship {
  id: string;
  companyId: string;
  company: InternshipCompany;
  position: string;
  duration: string;
  isPaid: boolean;
  salary?: string;
  description: string;
  learningObjectives: string[];
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  tags: string[];
  postedDate: string;
  applicationDeadline?: string;
  startDate?: string;
  type: 'internship';
  mentorshipProvided: boolean;
  certificateProvided: boolean;
  isBookmarked: boolean;
  location: string;
  remote: boolean;
  applicationCount: number;
  status: 'active' | 'closed' | 'draft';
}

export interface InternshipApplication {
  id: string;
  internshipId: string;
  internship?: Internship;
  candidateId: string;
  candidateName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  semester: number;
  gpa: number;
  resume: string;
  portfolio?: string;
  coverLetter?: string;
  motivation: string;
  availability: 'full-time' | 'part-time';
  status: InternshipStatus;
  appliedAt: string;
  reviewedAt?: string;
  interviewSchedule?: string;
  notes?: string;
}

export type InternshipStatus = 
  | 'applied'
  | 'reviewed'
  | 'interview'
  | 'accepted'
  | 'rejected';

export interface InternshipFilters {
  search?: string;
  location?: string;
  duration?: string;
  isPaid?: boolean;
  remote?: boolean;
  tags?: string[];
  mentorship?: boolean;
  certificate?: boolean;
}

export interface InternshipStats {
  totalInternships: number;
  activeInternships: number;
  totalApplicants: number;
  averageGPA: number;
}

export interface CandidateInternshipStats {
  totalApplied: number;
  reviewed: number;
  interviews: number;
  accepted: number;
  rejected: number;
}
export const isInternship = (item: any): item is Internship => {
  return item.type === 'internship';
};

export const isInternshipApplication = (item: any): item is InternshipApplication => {
  return 'university' in item && 'major' in item;
};
