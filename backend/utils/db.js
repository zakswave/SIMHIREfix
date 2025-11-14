import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data');
await fs.mkdir(DB_PATH, { recursive: true });
const databases = {
  users: null,
  jobs: null,
  applications: null,
  simulasi: null,
  portfolios: null,
  interviews: null,
  messages: null,
  internships: null,
  'internship-applications': null,
};
async function initDatabase(name, defaultData = []) {
  const file = join(DB_PATH, `${name}.json`);
  const adapter = new JSONFile(file);
  const db = new Low(adapter, { [name]: defaultData });

  await db.read();
  if (!db.data || !db.data[name]) {
    db.data = { [name]: defaultData };
    await db.write();
  }

  return db;
}
export async function getDB(name) {
  if (!databases[name]) {
    databases[name] = await initDatabase(name);
  }
  return databases[name];
}
export async function getUsers() {
  const db = await getDB('users');
  await db.read();
  return db.data.users;
}

export async function getUserById(id) {
  const users = await getUsers();
  return users.find(u => u.id === id);
}

export async function getUserByEmail(email) {
  const users = await getUsers();
  return users.find(u => u.email === email);
}

export async function createUser(userData) {
  const db = await getDB('users');
  await db.read();
  db.data.users.push(userData);
  await db.write();
  return userData;
}

export async function updateUser(id, updates) {
  const db = await getDB('users');
  await db.read();
  const index = db.data.users.findIndex(u => u.id === id);
  if (index === -1) return null;

  db.data.users[index] = { ...db.data.users[index], ...updates, updatedAt: new Date().toISOString() };
  await db.write();
  return db.data.users[index];
}
export async function getJobs() {
  const db = await getDB('jobs');
  await db.read();
  return db.data.jobs;
}

export async function getJobById(id) {
  const jobs = await getJobs();
  return jobs.find(j => j.id === id);
}

export async function createJob(jobData) {
  const db = await getDB('jobs');
  await db.read();
  db.data.jobs.push(jobData);
  await db.write();
  return jobData;
}

export async function updateJob(id, updates) {
  const db = await getDB('jobs');
  await db.read();
  const index = db.data.jobs.findIndex(j => j.id === id);
  if (index === -1) return null;

  db.data.jobs[index] = { ...db.data.jobs[index], ...updates, updatedAt: new Date().toISOString() };
  await db.write();
  return db.data.jobs[index];
}

export async function deleteJob(id) {
  const db = await getDB('jobs');
  await db.read();
  const index = db.data.jobs.findIndex(j => j.id === id);
  if (index === -1) return false;

  db.data.jobs.splice(index, 1);
  await db.write();
  return true;
}
export async function getApplications() {
  const db = await getDB('applications');
  await db.read();
  return db.data.applications;
}

export async function getApplicationById(id) {
  const applications = await getApplications();
  return applications.find(a => a.id === id);
}

export async function createApplication(appData) {
  const db = await getDB('applications');
  await db.read();
  db.data.applications.push(appData);
  await db.write();
  const jobDb = await getDB('jobs');
  await jobDb.read();
  const jobIndex = jobDb.data.jobs.findIndex(j => j.id === appData.jobId);
  if (jobIndex !== -1) {
    jobDb.data.jobs[jobIndex].applicantsCount = (jobDb.data.jobs[jobIndex].applicantsCount || 0) + 1;
    await jobDb.write();
  }

  return appData;
}

export async function updateApplication(id, updates) {
  const db = await getDB('applications');
  await db.read();
  const index = db.data.applications.findIndex(a => a.id === id);
  if (index === -1) return null;

  db.data.applications[index] = { ...db.data.applications[index], ...updates };
  await db.write();
  return db.data.applications[index];
}

export async function deleteApplication(id) {
  const db = await getDB('applications');
  await db.read();
  const index = db.data.applications.findIndex(a => a.id === id);
  if (index === -1) return false;

  const application = db.data.applications[index];
  const interviewDb = await getDB('interviews');
  await interviewDb.read();
  const initialInterviewCount = interviewDb.data.interviews.length;
  interviewDb.data.interviews = interviewDb.data.interviews.filter(
    i => i.applicationId !== id
  );
  if (interviewDb.data.interviews.length !== initialInterviewCount) {
    await interviewDb.write();
  }
  const msgDb = await getDB('messages');
  await msgDb.read();
  const initialMsgCount = msgDb.data.messages.length;
  msgDb.data.messages = msgDb.data.messages.filter(
    m => m.applicationId !== id
  );
  if (msgDb.data.messages.length !== initialMsgCount) {
    await msgDb.write();
  }
  db.data.applications.splice(index, 1);
  await db.write();
  const jobDb = await getDB('jobs');
  await jobDb.read();
  const jobIndex = jobDb.data.jobs.findIndex(j => j.id === application.jobId);
  if (jobIndex !== -1 && jobDb.data.jobs[jobIndex].applicantsCount > 0) {
    jobDb.data.jobs[jobIndex].applicantsCount -= 1;
    await jobDb.write();
  }

  return true;
}
export async function getSimulasiResults() {
  const db = await getDB('simulasi');
  await db.read();
  return db.data.simulasi;
}

export async function getSimulasiResultById(id) {
  const results = await getSimulasiResults();
  return results.find(r => r.id === id);
}

export async function createSimulasiResult(resultData) {
  const db = await getDB('simulasi');
  await db.read();
  const existingIndex = db.data.simulasi.findIndex(
    r => r.candidateId === resultData.candidateId && r.categoryId === resultData.categoryId
  );

  if (existingIndex !== -1) {
    db.data.simulasi[existingIndex] = {
      ...resultData,
      updatedAt: new Date().toISOString(),
      submissionCount: (db.data.simulasi[existingIndex].submissionCount || 1) + 1
    };
  } else {
    db.data.simulasi.push({
      ...resultData,
      submissionCount: 1
    });
  }

  await db.write();
  return existingIndex !== -1 ? db.data.simulasi[existingIndex] : resultData;
}
export async function getPortfolios() {
  const db = await getDB('portfolios');
  await db.read();
  return db.data.portfolios;
}

export async function getPortfolioById(id) {
  const portfolios = await getPortfolios();
  return portfolios.find(p => p.id === id);
}

export async function createPortfolio(portfolioData) {
  const db = await getDB('portfolios');
  await db.read();
  db.data.portfolios.push(portfolioData);
  await db.write();
  return portfolioData;
}

export async function updatePortfolio(id, updates) {
  const db = await getDB('portfolios');
  await db.read();
  const index = db.data.portfolios.findIndex(p => p.id === id);
  if (index === -1) return null;

  db.data.portfolios[index] = { ...db.data.portfolios[index], ...updates, updatedAt: new Date().toISOString() };
  await db.write();
  return db.data.portfolios[index];
}

export async function deletePortfolio(id) {
  const db = await getDB('portfolios');
  await db.read();
  const index = db.data.portfolios.findIndex(p => p.id === id);
  if (index === -1) return false;

  db.data.portfolios.splice(index, 1);
  await db.write();
  return true;
}
export async function getInterviews() {
  const db = await getDB('interviews');
  await db.read();
  return db.data.interviews;
}

export async function createInterview(interviewData) {
  const db = await getDB('interviews');
  await db.read();
  db.data.interviews.push(interviewData);
  await db.write();
  return interviewData;
}

export async function updateInterview(id, updates) {
  const db = await getDB('interviews');
  await db.read();
  const index = db.data.interviews.findIndex(i => i.id === id);
  if (index === -1) return null;

  db.data.interviews[index] = { ...db.data.interviews[index], ...updates };
  await db.write();
  return db.data.interviews[index];
}
export async function getMessages() {
  const db = await getDB('messages');
  await db.read();
  return db.data.messages;
}

export async function createMessage(messageData) {
  const db = await getDB('messages');
  await db.read();
  db.data.messages.push(messageData);
  await db.write();
  return messageData;
}

export default {
  getDB,
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getSimulasiResults,
  getSimulasiResultById,
  createSimulasiResult,
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getInterviews,
  createInterview,
  updateInterview,
  getMessages,
  createMessage,
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  getInternshipApplications,
  getInternshipApplicationById,
  createInternshipApplication,
  updateInternshipApplication,
};
export async function getInternships() {
  const db = await getDB('internships');
  await db.read();
  return db.data.internships;
}

export async function getInternshipById(id) {
  const internships = await getInternships();
  return internships.find(i => i.id === id);
}

export async function createInternship(internshipData) {
  const db = await getDB('internships');
  await db.read();
  db.data.internships.push(internshipData);
  await db.write();
  return internshipData;
}

export async function updateInternship(id, updates) {
  const db = await getDB('internships');
  await db.read();
  const index = db.data.internships.findIndex(i => i.id === id);
  if (index === -1) return null;

  db.data.internships[index] = { ...db.data.internships[index], ...updates };
  await db.write();
  return db.data.internships[index];
}

export async function deleteInternship(id) {
  const db = await getDB('internships');
  await db.read();
  const appDb = await getDB('internship-applications');
  await appDb.read();
  const deletedCount = appDb.data['internship-applications'].filter(
    app => app.internshipId === id
  ).length;

  appDb.data['internship-applications'] = appDb.data['internship-applications'].filter(
    app => app.internshipId !== id
  );
  await appDb.write();

  console.log(`[DB] Cascade deleted ${deletedCount} applications for internship ${id}`);
  db.data.internships = db.data.internships.filter(i => i.id !== id);
  await db.write();

  return { success: true, deletedApplications: deletedCount };
}
export async function getInternshipApplications() {
  const db = await getDB('internship-applications');
  await db.read();
  return db.data['internship-applications'];
}

export async function getInternshipApplicationById(id) {
  const applications = await getInternshipApplications();
  return applications.find(a => a.id === id);
}

export async function createInternshipApplication(applicationData) {
  const db = await getDB('internship-applications');
  await db.read();
  db.data['internship-applications'].push(applicationData);
  await db.write();
  return applicationData;
}

export async function updateInternshipApplication(id, updates) {
  const db = await getDB('internship-applications');
  await db.read();
  const index = db.data['internship-applications'].findIndex(a => a.id === id);
  if (index === -1) return null;

  db.data['internship-applications'][index] = { ...db.data['internship-applications'][index], ...updates };
  await db.write();
  return db.data['internship-applications'][index];
}

export async function deleteInternshipApplication(id) {
  const db = await getDB('internship-applications');
  await db.read();
  const application = db.data['internship-applications'].find(a => a.id === id);
  if (!application) return null;

  const internshipId = application.internshipId;
  db.data['internship-applications'] = db.data['internship-applications'].filter(a => a.id !== id);
  await db.write();
  const internshipDb = await getDB('internships');
  await internshipDb.read();
  const internshipIndex = internshipDb.data.internships.findIndex(i => i.id === internshipId);
  if (internshipIndex !== -1) {
    const currentCount = internshipDb.data.internships[internshipIndex].applicationCount || 0;
    internshipDb.data.internships[internshipIndex].applicationCount = Math.max(0, currentCount - 1);
    await internshipDb.write();
    console.log(`[DB] Decremented applicationCount for internship ${internshipId} to ${internshipDb.data.internships[internshipIndex].applicationCount}`);
  }

  return application;
}
