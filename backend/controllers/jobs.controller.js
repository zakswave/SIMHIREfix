import { v4 as uuidv4 } from 'uuid';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getUserById,
} from '../utils/db.js';
export async function getAllJobs(req, res) {
  try {
    const { 
      search, 
      location, 
      type, 
      employmentType,
      experienceLevel,
      salaryMin, 
      salaryMax, 
      skills,
      remote,
      companyId 
    } = req.query;

    let jobs = await getJobs();

    console.log('Total jobs in database:', jobs.length);
    const isValidParam = (value) => {
      return value && value !== 'undefined' && value !== 'null' && String(value).trim() !== '';
    };
    if (isValidParam(search)) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(job =>
        job.title?.toLowerCase().includes(searchLower) ||
        job.companyName?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower)
      );
    }
    if (isValidParam(location)) {
      jobs = jobs.filter(job => 
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    const jobType = employmentType || type;
    if (isValidParam(jobType)) {
      const types = jobType.split(',');
      jobs = jobs.filter(job => 
        types.includes(job.employmentType) || types.includes(job.type)
      );
    }
    if (isValidParam(experienceLevel)) {
      const levels = experienceLevel.split(',');
      jobs = jobs.filter(job => levels.includes(job.experienceLevel));
    }
    if (isValidParam(skills)) {
      const skillsArray = skills.split(',').map(s => s.toLowerCase().trim());
      jobs = jobs.filter(job => {
        const jobSkills = (job.skills || []).map(s => s.toLowerCase());
        return skillsArray.some(skill => jobSkills.includes(skill));
      });
    }
    if (isValidParam(remote)) {
      const isRemote = remote === 'true' || remote === true;
      jobs = jobs.filter(job => 
        job.locationMode === (isRemote ? 'remote' : 'on-site') ||
        job.remote === isRemote
      );
    }
    if (salaryMin) {
      jobs = jobs.filter(job => {
        const jobMinSalary = job.salaryMin || job.salary?.min || 0;
        return jobMinSalary >= parseInt(salaryMin);
      });
    }
    if (salaryMax) {
      jobs = jobs.filter(job => {
        const jobMaxSalary = job.salaryMax || job.salary?.max || 0;
        return jobMaxSalary <= parseInt(salaryMax);
      });
    }
    if (companyId) {
      jobs = jobs.filter(job => job.companyId === companyId);
    }
    const userId = req.userId;
    if (!userId || req.userRole !== 'company') {
      jobs = jobs.filter(job => job.status === 'open' || job.status === 'active');
    }
    jobs.sort((a, b) => {
      const dateA = new Date(b.publishedAt || b.postedAt || b.createdAt).getTime();
      const dateB = new Date(a.publishedAt || a.postedAt || a.createdAt).getTime();
      return dateA - dateB;
    });

    console.log('Filtered jobs:', jobs.length);
    return res.status(200).json({
      success: true,
      data: {
        jobs,
        total: jobs.length,
      },
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get jobs.',
    });
  }
}
export async function getJobDetails(req, res) {
  try {
    const { id } = req.params;

    const job = await getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { job },
    });
  } catch (error) {
    console.error('Get job details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get job details.',
    });
  }
}
export async function createNewJob(req, res) {
  try {
    const companyId = req.userId;
    const jobData = req.body;

    console.log('Creating job with data:', jobData);
    console.log('Company ID:', companyId);
    const company = await getUserById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found.',
      });
    }
    let logoPath = company.profile?.avatar || company.companyLogo || null;
    if (req.file) {
      logoPath = `/uploads/logos/${req.file.filename}`;
    }
    let skills = jobData.skills || [];
    if (typeof skills === 'string') {
      skills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    let requirements = jobData.requirements || [];
    if (typeof requirements === 'string') {
      requirements = requirements.split('\n').map(s => s.trim()).filter(Boolean);
    }
    let responsibilities = jobData.responsibilities || [];
    if (typeof responsibilities === 'string') {
      responsibilities = responsibilities.split('\n').map(s => s.trim()).filter(Boolean);
    }
    let benefits = jobData.benefits || [];
    if (typeof benefits === 'string') {
      benefits = benefits.split('\n').map(s => s.trim()).filter(Boolean);
    }

    const newJob = {
      id: uuidv4(),
      companyId,
      companyName: company.companyName || company.name,
      companyLogo: logoPath,
      title: jobData.title,
      description: jobData.description,
      requirements,
      responsibilities,
      skills,
      location: jobData.location,
      locationMode: jobData.locationMode || jobData.workStyle || 'on-site',
      type: jobData.type || jobData.employmentType || 'full-time',
      employmentType: jobData.employmentType || jobData.type || 'full-time',
      experienceLevel: jobData.experienceLevel || 'mid',
      salaryMin: parseInt(jobData.salaryMin) || 0,
      salaryMax: parseInt(jobData.salaryMax) || 0,
      salary: {
        min: parseInt(jobData.salaryMin) || 0,
        max: parseInt(jobData.salaryMax) || 0,
        currency: 'IDR'
      },
      benefits,
      status: jobData.status || 'open',
      deadline: jobData.deadline || null,
      postedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: null,
      applicantsCount: 0,
      applicationCount: 0,
      remote: jobData.locationMode === 'remote' || jobData.workStyle === 'remote' || false,
    };

    console.log('New job object:', newJob);

    const job = await createJob(newJob);

    console.log('Job created successfully:', job.id);

    return res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      data: { job },
    });
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create job.',
      error: error.message,
    });
  }
}
export async function updateExistingJob(req, res) {
  try {
    const { id } = req.params;
    const companyId = req.userId;
    const updates = req.body;

    const job = await getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }
    if (job.companyId !== companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }
    if (req.file) {
      updates.companyLogo = `/uploads/logos/${req.file.filename}`;
    }

    const updatedJob = await updateJob(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully!',
      data: { job: updatedJob },
    });
  } catch (error) {
    console.error('Update job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update job.',
    });
  }
}
export async function deleteExistingJob(req, res) {
  try {
    const { id } = req.params;
    const companyId = req.userId;

    const job = await getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }
    if (job.companyId !== companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    await deleteJob(id);

    return res.status(200).json({
      success: true,
      message: 'Job deleted successfully.',
    });
  } catch (error) {
    console.error('Delete job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete job.',
    });
  }
}
export async function getCompanyJobs(req, res) {
  try {
    const companyId = req.userId;
    const { status } = req.query;

    let jobs = await getJobs();
    jobs = jobs.filter(job => job.companyId === companyId);
    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }
    jobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

    return res.status(200).json({
      success: true,
      data: {
        jobs,
        total: jobs.length,
      },
    });
  } catch (error) {
    console.error('Get company jobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get jobs.',
    });
  }
}
export async function closeJob(req, res) {
  try {
    const { id } = req.params;
    const companyId = req.userId;

    const job = await getJobById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }

    if (job.companyId !== companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    const updatedJob = await updateJob(id, {
      status: 'closed',
      closedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Job closed successfully.',
      data: { job: updatedJob },
    });
  } catch (error) {
    console.error('Close job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to close job.',
    });
  }
}

export default {
  getAllJobs,
  getJobDetails,
  createNewJob,
  updateExistingJob,
  deleteExistingJob,
  getCompanyJobs,
  closeJob,
};
