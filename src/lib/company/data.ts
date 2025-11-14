import {
  CompanyProfile,
  JobPost,
  JobApplication,
  EvaluationTemplate,
  TalentPool,
  TeamMember,
  EscrowContract,
  ActivityEvent,
  CandidateProfile,
  CompanyMetrics,
  ApplicationStage,
  JobStatus
} from './types';
import { MOCK_COMPANY_DATA } from './mockData';
import { handleError } from '../errors';
import { STORAGE_KEYS as GLOBAL_STORAGE_KEYS } from '../constants';
const STORAGE_KEYS = {
  COMPANY_PROFILE: GLOBAL_STORAGE_KEYS.COMPANY_PROFILE,
  COMPANY_JOBS: GLOBAL_STORAGE_KEYS.COMPANY_JOBS,
  COMPANY_APPLICATIONS: GLOBAL_STORAGE_KEYS.COMPANY_APPLICATIONS,
  COMPANY_EVALUATION_TEMPLATES: `${GLOBAL_STORAGE_KEYS.COMPANY_PROFILE}_evaluation_templates`,
  COMPANY_TALENT_POOLS: `${GLOBAL_STORAGE_KEYS.COMPANY_PROFILE}_talent_pools`,
  COMPANY_TEAM_MEMBERS: GLOBAL_STORAGE_KEYS.COMPANY_TEAM,
  COMPANY_CONTRACTS: `${GLOBAL_STORAGE_KEYS.COMPANY_PROFILE}_contracts`,
  COMPANY_ACTIVITIES: `${GLOBAL_STORAGE_KEYS.COMPANY_PROFILE}_activities`,
  COMPANY_CANDIDATES: `${GLOBAL_STORAGE_KEYS.COMPANY_PROFILE}_candidates`
} as const;
function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    handleError(error, `Failed to read ${key}`);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    handleError(error, `Failed to write ${key}`);
  }
}
export function initializeCompanyData(): void {
  const profile = getStorageItem(STORAGE_KEYS.COMPANY_PROFILE, null);
  if (!profile) {
    setStorageItem(STORAGE_KEYS.COMPANY_PROFILE, MOCK_COMPANY_DATA.profile);
    setStorageItem(STORAGE_KEYS.COMPANY_JOBS, MOCK_COMPANY_DATA.jobs);
    setStorageItem(STORAGE_KEYS.COMPANY_APPLICATIONS, MOCK_COMPANY_DATA.applications);
    setStorageItem(STORAGE_KEYS.COMPANY_EVALUATION_TEMPLATES, MOCK_COMPANY_DATA.evaluationTemplates);
    setStorageItem(STORAGE_KEYS.COMPANY_TALENT_POOLS, MOCK_COMPANY_DATA.talentPools);
    setStorageItem(STORAGE_KEYS.COMPANY_TEAM_MEMBERS, MOCK_COMPANY_DATA.teamMembers);
    setStorageItem(STORAGE_KEYS.COMPANY_CONTRACTS, MOCK_COMPANY_DATA.contracts);
    setStorageItem(STORAGE_KEYS.COMPANY_ACTIVITIES, MOCK_COMPANY_DATA.activities);
    setStorageItem(STORAGE_KEYS.COMPANY_CANDIDATES, MOCK_COMPANY_DATA.candidates);
  }
}
export function getCompanyProfile(): CompanyProfile | null {
  return getStorageItem<CompanyProfile | null>(STORAGE_KEYS.COMPANY_PROFILE, null);
}

export function updateCompanyProfile(updates: Partial<CompanyProfile>): CompanyProfile {
  const current = getCompanyProfile();
  if (!current) throw new Error('Company profile not found');

  const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
  setStorageItem(STORAGE_KEYS.COMPANY_PROFILE, updated);
  return updated;
}
export function getJobPosts(): JobPost[] {
  return getStorageItem<JobPost[]>(STORAGE_KEYS.COMPANY_JOBS, []);
}

export function getJobPost(jobId: string): JobPost | undefined {
  const jobs = getJobPosts();
  return jobs.find(job => job.id === jobId);
}
export const getJobPostById = getJobPost;

export function createJobPost(jobData: Omit<JobPost, 'id' | 'companyId' | 'createdAt' | 'applicationCount' | 'viewCount'>): JobPost {
  const jobs = getJobPosts();
  const profile = getCompanyProfile();
  if (!profile) throw new Error('Company profile not found');

  const newJob: JobPost = {
    id: `job-${Date.now()}`,
    companyId: profile.id,
    createdAt: new Date().toISOString(),
    applicationCount: 0,
    viewCount: 0,
    publishedAt: jobData.status === 'open' ? new Date().toISOString() : undefined,
    ...jobData
  };

  const updatedJobs = [...jobs, newJob];
  setStorageItem(STORAGE_KEYS.COMPANY_JOBS, updatedJobs);
  return newJob;
}

export function updateJobPost(jobId: string, updates: Partial<JobPost>): JobPost {
  const jobs = getJobPosts();
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  if (jobIndex === -1) throw new Error('Job not found');

  const updatedJob = { ...jobs[jobIndex], ...updates };
  if (updates.status === 'open' && jobs[jobIndex].status !== 'open') {
    updatedJob.publishedAt = new Date().toISOString();
  }

  jobs[jobIndex] = updatedJob;
  setStorageItem(STORAGE_KEYS.COMPANY_JOBS, jobs);
  return updatedJob;
}

export function deleteJobPost(jobId: string): void {
  const jobs = getJobPosts();
  const filteredJobs = jobs.filter(job => job.id !== jobId);
  setStorageItem(STORAGE_KEYS.COMPANY_JOBS, filteredJobs);
}

export function duplicateJobPost(jobId: string): JobPost {
  const originalJob = getJobPost(jobId);
  if (!originalJob) throw new Error('Job not found');

  const duplicatedJob = createJobPost({
    ...originalJob,
    title: `${originalJob.title} (Copy)`,
    status: 'draft',
    publishedAt: undefined
  });

  return duplicatedJob;
}
export function getJobApplications(jobId?: string): JobApplication[] {
  const applications = getStorageItem<JobApplication[]>(STORAGE_KEYS.COMPANY_APPLICATIONS, []);
  return jobId ? applications.filter(app => app.jobId === jobId) : applications;
}

export function getJobApplication(applicationId: string): JobApplication | undefined {
  const applications = getJobApplications();
  return applications.find(app => app.id === applicationId);
}

export function updateApplicationStage(applicationId: string, newStage: ApplicationStage, notes?: string): JobApplication {
  const applications = getJobApplications();
  const appIndex = applications.findIndex(app => app.id === applicationId);
  if (appIndex === -1) throw new Error('Application not found');

  const updatedApp = {
    ...applications[appIndex],
    stage: newStage,
    lastStageChange: new Date().toISOString(),
    reviewerNotes: notes ? [...applications[appIndex].reviewerNotes, notes] : applications[appIndex].reviewerNotes
  };

  applications[appIndex] = updatedApp;
  setStorageItem(STORAGE_KEYS.COMPANY_APPLICATIONS, applications);
  return updatedApp;
}

export function addApplicationNote(applicationId: string, note: { id: string; content: string; createdAt: string; author: string; }): JobApplication {
  const applications = getJobApplications();
  const appIndex = applications.findIndex(app => app.id === applicationId);
  if (appIndex === -1) throw new Error('Application not found');

  const noteText = `[${note.author}] ${note.content}`;
  const updatedApp = {
    ...applications[appIndex],
    reviewerNotes: [...applications[appIndex].reviewerNotes, noteText]
  };

  applications[appIndex] = updatedApp;
  setStorageItem(STORAGE_KEYS.COMPANY_APPLICATIONS, applications);
  return updatedApp;
}
export const getApplication = getJobApplication;
export function getEvaluationTemplates(): EvaluationTemplate[] {
  return getStorageItem<EvaluationTemplate[]>(STORAGE_KEYS.COMPANY_EVALUATION_TEMPLATES, []);
}

export function createEvaluationTemplate(templateData: Omit<EvaluationTemplate, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>): EvaluationTemplate {
  const templates = getEvaluationTemplates();
  const profile = getCompanyProfile();
  if (!profile) throw new Error('Company profile not found');

  const newTemplate: EvaluationTemplate = {
    id: `eval-${Date.now()}`,
    companyId: profile.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...templateData
  };

  const updatedTemplates = [...templates, newTemplate];
  setStorageItem(STORAGE_KEYS.COMPANY_EVALUATION_TEMPLATES, updatedTemplates);
  return newTemplate;
}
export function getTalentPools(): TalentPool[] {
  return getStorageItem<TalentPool[]>(STORAGE_KEYS.COMPANY_TALENT_POOLS, []);
}

export function createTalentPool(poolData: Omit<TalentPool, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>): TalentPool {
  const pools = getTalentPools();
  const profile = getCompanyProfile();
  if (!profile) throw new Error('Company profile not found');

  const newPool: TalentPool = {
    id: `pool-${Date.now()}`,
    companyId: profile.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...poolData
  };

  const updatedPools = [...pools, newPool];
  setStorageItem(STORAGE_KEYS.COMPANY_TALENT_POOLS, updatedPools);
  return newPool;
}
export function getTeamMembers(): TeamMember[] {
  return getStorageItem<TeamMember[]>(STORAGE_KEYS.COMPANY_TEAM_MEMBERS, []);
}

export function addTeamMember(memberData: Omit<TeamMember, 'id' | 'companyId' | 'invitedAt' | 'status'>): TeamMember {
  const members = getTeamMembers();
  const profile = getCompanyProfile();
  if (!profile) throw new Error('Company profile not found');

  const newMember: TeamMember = {
    id: `team-${Date.now()}`,
    companyId: profile.id,
    invitedAt: new Date().toISOString(),
    status: 'active',
    ...memberData
  };

  const updatedMembers = [...members, newMember];
  setStorageItem(STORAGE_KEYS.COMPANY_TEAM_MEMBERS, updatedMembers);
  return newMember;
}
export function getEscrowContracts(): EscrowContract[] {
  return getStorageItem<EscrowContract[]>(STORAGE_KEYS.COMPANY_CONTRACTS, []);
}

export function createEscrowContract(contractData: Omit<EscrowContract, 'id' | 'companyId' | 'createdAt'>): EscrowContract {
  const contracts = getEscrowContracts();
  const profile = getCompanyProfile();
  if (!profile) throw new Error('Company profile not found');

  const newContract: EscrowContract = {
    id: `contract-${Date.now()}`,
    companyId: profile.id,
    createdAt: new Date().toISOString(),
    ...contractData
  };

  const updatedContracts = [...contracts, newContract];
  setStorageItem(STORAGE_KEYS.COMPANY_CONTRACTS, updatedContracts);
  return newContract;
}

export function updateContractStatus(contractId: string, status: EscrowContract['status']): EscrowContract {
  const contracts = getEscrowContracts();
  const contractIndex = contracts.findIndex(c => c.id === contractId);
  if (contractIndex === -1) throw new Error('Contract not found');

  const updatedContract = { ...contracts[contractIndex], status };
  if (status === 'funded') {
    updatedContract.fundedAt = new Date().toISOString();
  } else if (status === 'released') {
    updatedContract.releasedAt = new Date().toISOString();
  } else if (status === 'in_progress' || status === 'submitted') {
    updatedContract.completedAt = new Date().toISOString();
  }

  contracts[contractIndex] = updatedContract;
  setStorageItem(STORAGE_KEYS.COMPANY_CONTRACTS, contracts);
  return updatedContract;
}
export function getActivities(): ActivityEvent[] {
  return getStorageItem<ActivityEvent[]>(STORAGE_KEYS.COMPANY_ACTIVITIES, []);
}

export function addActivity(activityData: Omit<ActivityEvent, 'id' | 'companyId' | 'createdAt'>): ActivityEvent {
  const activities = getActivities();
  const profile = getCompanyProfile();
  if (!profile) throw new Error('Company profile not found');

  const newActivity: ActivityEvent = {
    id: `activity-${Date.now()}`,
    companyId: profile.id,
    createdAt: new Date().toISOString(),
    ...activityData
  };

  const updatedActivities = [newActivity, ...activities].slice(0, 100);
  setStorageItem(STORAGE_KEYS.COMPANY_ACTIVITIES, updatedActivities);
  return newActivity;
}
export function getCandidateProfiles(): CandidateProfile[] {
  return getStorageItem<CandidateProfile[]>(STORAGE_KEYS.COMPANY_CANDIDATES, []);
}

export function getCandidateProfile(candidateId: string): CandidateProfile | undefined {
  const candidates = getCandidateProfiles();
  return candidates.find(candidate => candidate.id === candidateId);
}
export function getCompanyMetrics(): CompanyMetrics {
  const jobs = getJobPosts();
  const applications = getJobApplications();
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'open').length;
  const totalApplications = applications.length;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newApplicationsThisWeek = applications.filter(app => 
    new Date(app.appliedAt) >= oneWeekAgo
  ).length;
  const hiredApplications = applications.filter(app => app.stage === 'accepted');
  const avgTimeToHire = hiredApplications.length > 0 
    ? hiredApplications.reduce((sum, app) => {
        const appliedDate = new Date(app.appliedAt);
        const hiredDate = new Date(app.lastStageChange);
        const daysDiff = Math.floor((hiredDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + daysDiff;
      }, 0) / hiredApplications.length
    : 0;
  const conversionRate = totalApplications > 0 
    ? (hiredApplications.length / totalApplications) * 100 
    : 0;
  const skillCounts: Record<string, number> = {};
  jobs.forEach(job => {
    job.skills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  const topSkillsInDemand = Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const applicationsByStage = applications.reduce((acc, app) => {
    acc[app.stage] = (acc[app.stage] || 0) + 1;
    return acc;
  }, {} as Record<ApplicationStage, number>);
  const applicationsOverTime: Array<{ date: string; count: number }> = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const count = applications.filter(app => 
      app.appliedAt.startsWith(dateStr)
    ).length;

    applicationsOverTime.push({ date: dateStr, count });
  }

  return {
    totalJobs,
    activeJobs,
    totalApplications,
    newApplicationsThisWeek,
    averageTimeToHire: Math.round(avgTimeToHire),
    conversionRate: Math.round(conversionRate * 100) / 100,
    topSkillsInDemand,
    applicationsByStage,
    applicationsOverTime
  };
}
export function filterJobs(status?: JobStatus[], search?: string): JobPost[] {
  let jobs = getJobPosts();

  if (status && status.length > 0) {
    jobs = jobs.filter(job => status.includes(job.status));
  }

  if (search && search.trim()) {
    const searchTerm = search.toLowerCase().trim();
    jobs = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm) ||
      job.department.toLowerCase().includes(searchTerm) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  }

  return jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
export function filterApplications(stage?: ApplicationStage[], jobId?: string): JobApplication[] {
  let applications = getJobApplications(jobId);

  if (stage && stage.length > 0) {
    applications = applications.filter(app => stage.includes(app.stage));
  }

  return applications.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
}
