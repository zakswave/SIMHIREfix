import {
  getApplications,
  getSimulasiResults,
  getJobs,
} from '../utils/db.js';
async function getCandidateDashboardStats(candidateId) {
  const applications = await getApplications();
  const simulasiResults = await getSimulasiResults();

  const candidateApplications = applications.filter(a => a.candidateId === candidateId);
  const candidateSimulasi = simulasiResults.filter(r => r.candidateId === candidateId);
  const activeStatuses = ['applied', 'screening', 'interview'];
  const activeApplications = candidateApplications.filter(a => activeStatuses.includes(a.status));
  const averageScore = candidateSimulasi.length > 0
    ? Math.round(candidateSimulasi.reduce((sum, r) => sum + r.percentage, 0) / candidateSimulasi.length)
    : 0;
  const interviewsScheduled = candidateApplications.filter(a => a.interviewScheduled).length;

  return {
    totalApplications: candidateApplications.length,
    activeApplications: activeApplications.length,
    simulasiCompleted: candidateSimulasi.length,
    averageScore,
    interviewsScheduled,
    applicationsByStatus: {
      applied: candidateApplications.filter(a => a.status === 'applied').length,
      screening: candidateApplications.filter(a => a.status === 'screening').length,
      interview: candidateApplications.filter(a => a.status === 'interview').length,
      offer: candidateApplications.filter(a => a.status === 'offer').length,
      rejected: candidateApplications.filter(a => a.status === 'rejected').length,
      accepted: candidateApplications.filter(a => a.status === 'accepted').length,
    },
  };
}
async function getCompanyDashboardStats(companyId) {
  const applications = await getApplications();
  const jobs = await getJobs();

  const companyJobs = jobs.filter(j => j.companyId === companyId);
  const companyApplications = applications.filter(a => a.companyId === companyId);

  const activeJobs = companyJobs.filter(j => j.status === 'open' || j.status === 'active');
  const pendingApplications = companyApplications.filter(a => a.status === 'applied');
  const interviewsScheduled = companyApplications.filter(a => a.interviewScheduled).length;

  return {
    totalJobs: companyJobs.length,
    activeJobs: activeJobs.length,
    totalApplications: companyApplications.length,
    pendingApplications: pendingApplications.length,
    interviewsScheduled,
    applicationsByStatus: {
      applied: companyApplications.filter(a => a.status === 'applied').length,
      screening: companyApplications.filter(a => a.status === 'screening').length,
      interview: companyApplications.filter(a => a.status === 'interview').length,
      offer: companyApplications.filter(a => a.status === 'offer').length,
      rejected: companyApplications.filter(a => a.status === 'rejected').length,
      accepted: companyApplications.filter(a => a.status === 'accepted').length,
    },
  };
}
export async function getDashboardStats(req, res) {
  try {
    const userId = req.userId;
    const role = req.userRole;

    let stats;

    if (role === 'candidate') {
      stats = await getCandidateDashboardStats(userId);
    } else if (role === 'company') {
      stats = await getCompanyDashboardStats(userId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        stats,
        role,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats.',
    });
  }
}

export default {
  getDashboardStats,
};
