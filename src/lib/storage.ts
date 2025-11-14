
import { handleError } from './errors';
import { STORAGE_KEYS } from './constants';
import { toast } from 'sonner';
import type { ApplicationStatus } from './types';
import { z } from 'zod';
import { validateData } from './validation';

const applicationSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  companyLogo: z.string().optional(),
  location: z.string(),
  salary: z.string().optional(),
  appliedAt: z.string(),
  status: z.enum(['applied', 'screening', 'interview', 'offer', 'rejected', 'accepted']),
  notes: z.string().optional(),
  timeline: z.array(z.object({
    date: z.string(),
    status: z.string(),
    description: z.string(),
  })).optional(),
  simulasiScores: z.record(z.string(), z.number()).optional(),
});

const savedJobSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  companyLogo: z.string().optional(),
  location: z.string(),
  salary: z.string().optional(),
  type: z.string(),
  savedAt: z.string(),
});

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  appliedAt: string;
  status: ApplicationStatus;
  notes?: string;
  timeline?: ApplicationTimeline[];
  simulasiScores?: Record<string, number>;
  portfolio?: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    thumbnail?: string;
  }>;
}

export interface ApplicationTimeline {
  date: string;
  status: string;
  description: string;
}

export interface SavedJob {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  type: string;
  savedAt: string;
}

export interface Interview {
  id: string;
  applicationId?: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  scheduledAt: string;
  duration?: number;
  location?: string;
  meetingLink?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
  notes?: string;
  interviewerName?: string;
  interviewerEmail?: string;
}

export interface SavedSimulasiResult {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  completedAt: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  rank?: number;
  badge?: string;
  certificate?: string;
  breakdown: {
    technical: number;
    creativity: number;
    efficiency: number;
    communication: number;
  };
}

export interface ApprenticeshipApplication {
  id: string;
  opportunityId: string;
  title: string;
  company: string;
  location: string;
  appliedAt: string;
  status: 'applied' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  startDate?: string;
  endDate?: string;
}

const KEYS = {
  APPLICATIONS: STORAGE_KEYS.CANDIDATE_APPLICATIONS,
  SAVED_JOBS: STORAGE_KEYS.CANDIDATE_SAVED_JOBS,
  INTERVIEWS: STORAGE_KEYS.CANDIDATE_INTERVIEWS,
  SIMULASI_RESULTS: STORAGE_KEYS.CANDIDATE_SIMULASI,
  APPRENTICESHIPS: STORAGE_KEYS.CANDIDATE_APPRENTICESHIPS,
} as const;

function safeLoad<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    handleError(error, `Failed to load ${key} from storage`);
    return defaultValue;
  }
}

function safeSave<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    handleError(error, `Failed to save ${key} to storage`);
    return false;
  }
}

export function loadApplications(): Application[] {
  return safeLoad<Application[]>(KEYS.APPLICATIONS, []);
}

export function saveApplication(app: Application): boolean {
  const validatedApp = validateData(applicationSchema, app);
  if (!validatedApp) {
    return false;
  }

  const apps = loadApplications();
  const exists = apps.some(a => a.jobId === validatedApp.jobId);
  if (exists) {
    toast.error('Anda sudah melamar pekerjaan ini', {
      description: 'Lihat status lamaran Anda di halaman Application Tracker',
    });
    return false;
  }

  apps.push(validatedApp);
  const saved = safeSave(KEYS.APPLICATIONS, apps);

  if (saved) {
    toast.success('Lamaran berhasil dikirim!', {
      description: 'Perusahaan akan meninjau lamaran Anda',
    });
  }

  return saved;
}

export function updateApplication(id: string, updates: Partial<Application>): boolean {
  const apps = loadApplications();
  const index = apps.findIndex(a => a.id === id);

  if (index === -1) return false;

  apps[index] = { ...apps[index], ...updates };
  return safeSave(KEYS.APPLICATIONS, apps);
}

export function updateApplicationStatus(
  id: string, 
  status: Application['status'],
  timelineEntry?: string,
  companyNote?: string
): boolean {
  const apps = loadApplications();
  const index = apps.findIndex(a => a.id === id);

  if (index === -1) return false;

  apps[index].status = status;
  if (!apps[index].timeline) apps[index].timeline = [];

  const statusDescriptions: Record<Application['status'], string> = {
    applied: 'Lamaran Anda telah diterima',
    screening: 'Lamaran Anda sedang dalam tahap screening oleh HRD',
    interview: 'Selamat! Anda diundang untuk interview',
    offer: 'Selamat! Anda mendapat penawaran kerja',
    accepted: 'Selamat! Anda diterima di posisi ini',
    rejected: 'Mohon maaf, lamaran Anda belum berhasil kali ini'
  };

  apps[index].timeline?.push({
    date: new Date().toISOString(),
    status,
    description: timelineEntry || statusDescriptions[status],
  });
  if (companyNote) {
    apps[index].notes = companyNote;
  }

  return safeSave(KEYS.APPLICATIONS, apps);
}
export function syncCompanyApplicationStatus(
  applicationId: string,
  newStatus: Application['status'],
  note?: string
): boolean {
  const apps = loadApplications();
  const app = apps.find(a => a.id === applicationId);

  if (!app) return false;

  return updateApplicationStatus(app.id, newStatus, undefined, note);
}

export function deleteApplication(id: string): boolean {
  const apps = loadApplications().filter(a => a.id !== id);
  return safeSave(KEYS.APPLICATIONS, apps);
}

export function getApplicationById(id: string): Application | null {
  return loadApplications().find(a => a.id === id) || null;
}

export function hasAppliedToJob(jobId: string): boolean {
  return loadApplications().some(a => a.jobId === jobId);
}

export function loadSavedJobs(): SavedJob[] {
  return safeLoad<SavedJob[]>(KEYS.SAVED_JOBS, []);
}

export function saveJob(job: SavedJob): boolean {
  const validatedJob = validateData(savedJobSchema, job);
  if (!validatedJob) {
    return false;
  }

  const jobs = loadSavedJobs();
  if (jobs.some(j => j.jobId === validatedJob.jobId)) {
    toast.error('Pekerjaan sudah disimpan sebelumnya');
    return false;
  }

  jobs.push(validatedJob);
  const saved = safeSave(KEYS.SAVED_JOBS, jobs);

  if (saved) {
    toast.success('Pekerjaan berhasil disimpan');
  }

  return saved;
}

export function unsaveJob(jobId: string): boolean {
  const jobs = loadSavedJobs().filter(j => j.jobId !== jobId);
  return safeSave(KEYS.SAVED_JOBS, jobs);
}

export function isJobSaved(jobId: string): boolean {
  return loadSavedJobs().some(j => j.jobId === jobId);
}

export function toggleSaveJob(job: SavedJob): boolean {
  if (isJobSaved(job.jobId)) {
    return unsaveJob(job.jobId);
  } else {
    return saveJob(job);
  }
}

export function loadInterviews(): Interview[] {
  return safeLoad<Interview[]>(KEYS.INTERVIEWS, []);
}

export function saveInterview(interview: Interview): boolean {
  const interviews = loadInterviews();
  interviews.push(interview);
  return safeSave(KEYS.INTERVIEWS, interviews);
}

export function updateInterview(id: string, updates: Partial<Interview>): boolean {
  const interviews = loadInterviews();
  const index = interviews.findIndex(i => i.id === id);

  if (index === -1) return false;

  interviews[index] = { ...interviews[index], ...updates };
  return safeSave(KEYS.INTERVIEWS, interviews);
}

export function deleteInterview(id: string): boolean {
  const interviews = loadInterviews().filter(i => i.id !== id);
  return safeSave(KEYS.INTERVIEWS, interviews);
}

export function getUpcomingInterviews(): Interview[] {
  const now = new Date();
  return loadInterviews()
    .filter(i => i.status === 'confirmed' || i.status === 'pending')
    .filter(i => new Date(i.scheduledAt) > now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
}

export function loadSimulasiResults(): SavedSimulasiResult[] {
  return safeLoad<SavedSimulasiResult[]>(KEYS.SIMULASI_RESULTS, []);
}

export function saveSimulasiResult(result: SavedSimulasiResult): boolean {
  const results = loadSimulasiResults();
  const filtered = results.filter(r => r.categoryId !== result.categoryId);
  filtered.push(result);

  return safeSave(KEYS.SIMULASI_RESULTS, filtered);
}

export function getSimulasiResultByCategory(categoryId: string): SavedSimulasiResult | null {
  return loadSimulasiResults().find(r => r.categoryId === categoryId) || null;
}

export function getUserBadges(): string[] {
  return loadSimulasiResults()
    .filter(r => r.badge)
    .map(r => r.badge as string);
}

export function getAverageSimulasiScore(): number {
  const results = loadSimulasiResults();
  if (results.length === 0) return 0;

  const total = results.reduce((sum, r) => sum + r.percentage, 0);
  return Math.round(total / results.length);
}

export function loadApprenticeships(): ApprenticeshipApplication[] {
  return safeLoad<ApprenticeshipApplication[]>(KEYS.APPRENTICESHIPS, []);
}

export function saveApprenticeshipApplication(app: ApprenticeshipApplication): boolean {
  const apps = loadApprenticeships();
  apps.push(app);
  return safeSave(KEYS.APPRENTICESHIPS, apps);
}

export function updateApprenticeshipStatus(
  id: string,
  status: ApprenticeshipApplication['status']
): boolean {
  const apps = loadApprenticeships();
  const index = apps.findIndex(a => a.id === id);

  if (index === -1) return false;

  apps[index].status = status;
  return safeSave(KEYS.APPRENTICESHIPS, apps);
}

export function hasAppliedToApprenticeship(opportunityId: string): boolean {
  return loadApprenticeships().some(a => a.opportunityId === opportunityId);
}

export function getApplicationStats() {
  const applications = loadApplications();

  return {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    screening: applications.filter(a => a.status === 'screening').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
  };
}

export function getInterviewStats() {
  const interviews = loadInterviews();
  const now = new Date();

  return {
    total: interviews.length,
    upcoming: interviews.filter(i => 
      (i.status === 'confirmed' || i.status === 'pending') && 
      new Date(i.scheduledAt) > now
    ).length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length,
  };
}

export function getDashboardStats() {
  const apps = getApplicationStats();
  const interviews = getInterviewStats();
  const savedJobs = loadSavedJobs().length;
  const simulasiCompleted = loadSimulasiResults().length;

  return {
    applications: apps,
    interviews: interviews,
    savedJobs,
    simulasiCompleted,
  };
}

export function initializeSampleApplications(): void {
  const existing = loadApplications();

  if (existing.length === 0) {
    const sampleApps: Application[] = [
      {
        id: crypto.randomUUID(),
        jobId: 'job-001',
        jobTitle: 'Senior Frontend Developer',
        company: 'TechStart Indonesia',
        location: 'Jakarta',
        salary: 'Rp 15.000.000 - Rp 20.000.000',
        appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'screening',
        timeline: [
          {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'applied',
            description: 'Application submitted',
          },
          {
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'screening',
            description: 'Application under review',
          },
        ],
      },
      {
        id: crypto.randomUUID(),
        jobId: 'job-002',
        jobTitle: 'UI/UX Designer',
        company: 'Creative Digital',
        location: 'Bandung',
        salary: 'Rp 10.000.000 - Rp 15.000.000',
        appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'interview',
        timeline: [
          {
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'applied',
            description: 'Application submitted',
          },
          {
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'screening',
            description: 'Portfolio reviewed',
          },
          {
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'interview',
            description: 'Interview scheduled',
          },
        ],
      },
    ];

    safeSave(KEYS.APPLICATIONS, sampleApps);
  }
}

export default {
  loadApplications,
  saveApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationById,
  hasAppliedToJob,
  loadSavedJobs,
  saveJob,
  unsaveJob,
  isJobSaved,
  toggleSaveJob,
  loadInterviews,
  saveInterview,
  updateInterview,
  deleteInterview,
  getUpcomingInterviews,
  loadSimulasiResults,
  saveSimulasiResult,
  getSimulasiResultByCategory,
  getUserBadges,
  getAverageSimulasiScore,
  loadApprenticeships,
  saveApprenticeshipApplication,
  updateApprenticeshipStatus,
  hasAppliedToApprenticeship,
  getApplicationStats,
  getInterviewStats,
  getDashboardStats,
  initializeSampleApplications,
};
