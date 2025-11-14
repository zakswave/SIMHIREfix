import { v4 as uuidv4 } from 'uuid';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getJobById,
  getUserById,
  getSimulasiResults,
  getPortfolios,
} from '../utils/db.js';
export async function applyForJob(req, res) {
  try {
    const candidateId = req.userId;
    const { jobId, coverLetter, portfolioIds } = req.body;

    console.log('Apply for job request:', { candidateId, jobId, coverLetter: coverLetter?.substring(0, 50), portfolioIds });
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required.',
      });
    }
    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found.',
      });
    }
    const applications = await getApplications();
    const existingApp = applications.find(
      app => app.candidateId === candidateId && app.jobId === jobId
    );

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job.',
      });
    }
    const candidate = await getUserById(candidateId);
    const simulasiResults = await getSimulasiResults();
    const candidateSimulasi = simulasiResults.filter(r => r.candidateId === candidateId);
    const simulasiScores = {};
    candidateSimulasi.forEach(result => {
      simulasiScores[result.categoryId] = result.percentage;
    });
    const allPortfolios = await getPortfolios();
    const candidatePortfolios = allPortfolios.filter(p => p.userId === candidateId);
    const selectedPortfolios = portfolioIds 
      ? candidatePortfolios.filter(p => portfolioIds.includes(p.id))
      : candidatePortfolios.filter(p => p.featured);
    let cvPath = null;
    if (req.file) {
      cvPath = `/uploads/documents/${req.file.filename}`;
    }
    const applicationData = {
      id: uuidv4(),
      jobId,
      candidateId,
      companyId: job.companyId,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      timeline: [
        {
          date: new Date().toISOString(),
          status: 'applied',
          description: 'Lamaran diterima dan sedang dalam proses review',
          updatedBy: 'system',
        },
      ],
      candidateData: {
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        avatar: candidate.profile?.avatar,
        bio: candidate.profile?.bio,
        location: candidate.profile?.location,
        skills: candidate.profile?.skills || [],
        experience: candidate.profile?.experience,
        cv: cvPath,
        coverLetter: coverLetter || null,
        portfolio: selectedPortfolios.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          technologies: p.technologies,
          thumbnail: p.thumbnail,
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl,
        })),
        simulasiScores,
      },
      jobData: {
        title: job.title,
        company: job.companyName,
        companyLogo: job.companyLogo,
        location: job.location,
        type: job.type,
        salary: job.salary,
      },
      companyNotes: null,
      interviewScheduled: null,
    };

    const application = await createApplication(applicationData);

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: { application },
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit application.',
    });
  }
}
export async function getMyApplications(req, res) {
  try {
    const candidateId = req.userId;

    const applications = await getApplications();
    const myApplications = applications.filter(app => app.candidateId === candidateId);
    myApplications.sort((a, b) => 
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );

    return res.status(200).json({
      success: true,
      data: { 
        applications: myApplications,
        total: myApplications.length,
      },
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get applications.',
    });
  }
}
export async function getCompanyApplications(req, res) {
  try {
    const companyId = req.userId;
    const { jobId, status } = req.query;

    let applications = await getApplications();
    applications = applications.filter(app => app.companyId === companyId);
    if (jobId) {
      applications = applications.filter(app => app.jobId === jobId);
    }
    if (status) {
      applications = applications.filter(app => app.status === status);
    }
    applications.sort((a, b) => 
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );

    return res.status(200).json({
      success: true,
      data: { 
        applications,
        total: applications.length,
      },
    });
  } catch (error) {
    console.error('Get company applications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get applications.',
    });
  }
}
export async function getApplicationDetails(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const application = await getApplicationById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }
    if (userRole === 'candidate' && application.candidateId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    if (userRole === 'company' && application.companyId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { application },
    });
  } catch (error) {
    console.error('Get application details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get application details.',
    });
  }
}
export async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const companyId = req.userId;
    const { 
      status, 
      note, 
      interviewDate, 
      interviewType, 
      meetingLink,
      interviewLocation,
      interviewNotes 
    } = req.body;

    const application = await getApplicationById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }
    if (application.companyId !== companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }
    const statusDescriptions = {
      applied: 'Lamaran diterima',
      screening: 'Lamaran sedang di-review oleh tim HRD',
      interview: 'Selamat! Anda diundang untuk interview',
      offer: 'Selamat! Anda mendapat penawaran kerja',
      rejected: 'Mohon maaf, lamaran Anda belum berhasil kali ini',
      accepted: 'Selamat! Anda diterima di posisi ini',
    };
    const newTimelineEntry = {
      date: new Date().toISOString(),
      status,
      description: note || statusDescriptions[status],
      updatedBy: companyId,
    };

    const updates = {
      status,
      timeline: [...application.timeline, newTimelineEntry],
    };
    if (note) {
      updates.companyNotes = note;
    }
    if (status === 'interview' && interviewDate) {
      updates.interviewScheduled = {
        date: interviewDate,
        type: interviewType || 'general',
        meetingLink: meetingLink || null,
        location: interviewLocation || null,
        notes: interviewNotes || null,
        status: 'scheduled',
      };
    }

    const updatedApplication = await updateApplication(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Application status updated successfully!',
      data: { application: updatedApplication },
    });
  } catch (error) {
    console.error('Update application status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update application status.',
    });
  }
}
export async function withdrawApplication(req, res) {
  try {
    const { id } = req.params;
    const candidateId = req.userId;

    const application = await getApplicationById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }
    if (application.candidateId !== candidateId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }
    if (['accepted', 'rejected'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application with current status.',
      });
    }

    await deleteApplication(id);

    return res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully.',
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to withdraw application.',
    });
  }
}
export async function getApplicationStats(req, res) {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    const applications = await getApplications();
    let userApplications;

    if (userRole === 'candidate') {
      userApplications = applications.filter(app => app.candidateId === userId);
    } else {
      userApplications = applications.filter(app => app.companyId === userId);
    }

    const stats = {
      total: userApplications.length,
      applied: userApplications.filter(a => a.status === 'applied').length,
      screening: userApplications.filter(a => a.status === 'screening').length,
      interview: userApplications.filter(a => a.status === 'interview').length,
      offer: userApplications.filter(a => a.status === 'offer').length,
      rejected: userApplications.filter(a => a.status === 'rejected').length,
      accepted: userApplications.filter(a => a.status === 'accepted').length,
    };

    return res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get statistics.',
    });
  }
}

export default {
  applyForJob,
  getMyApplications,
  getCompanyApplications,
  getApplicationDetails,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
};
