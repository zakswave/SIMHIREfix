import { v4 as uuidv4 } from 'uuid';
import {
  getInternshipApplications,
  getInternshipApplicationById,
  createInternshipApplication,
  updateInternshipApplication as updateApplicationDb,
  deleteInternshipApplication as deleteApplicationDb,
  getInternshipById,
  updateInternship,
  getInternships,
} from '../utils/db.js';
import { ErrorTypes } from '../utils/errors.js';
export async function applyForInternship(req, res, next) {
  try {
    const candidateId = req.userId;
    const applicationData = req.body;
    const internship = await getInternshipById(applicationData.internshipId);
    if (!internship) {
      throw ErrorTypes.NOT_FOUND('Internship not found');
    }
    const applications = await getInternshipApplications();
    const alreadyApplied = applications.some(
      app => app.candidateId === candidateId && app.internshipId === applicationData.internshipId
    );

    if (alreadyApplied) {
      throw ErrorTypes.ALREADY_EXISTS('You have already applied for this internship');
    }

    const application = {
      id: uuidv4(),
      candidateId,
      ...applicationData,
      status: 'applied',
      appliedAt: new Date().toISOString()
    };

    const created = await createInternshipApplication(application);
    await updateInternship(internship.id, {
      applicationCount: (internship.applicationCount || 0) + 1
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application: created }
    });
  } catch (error) {
    next(error);
  }
}
export async function getCandidateApplications(req, res, next) {
  try {
    const candidateId = req.userId;

    const applications = await getInternshipApplications();
    const candidateApplications = applications.filter(app => app.candidateId === candidateId);
    const populatedApplications = await Promise.all(
      candidateApplications.map(async (app) => {
        const internship = await getInternshipById(app.internshipId);
        return {
          ...app,
          internship
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        applications: populatedApplications,
        total: populatedApplications.length
      }
    });
  } catch (error) {
    next(error);
  }
}
export async function getCompanyApplications(req, res, next) {
  try {
    const companyId = req.userId;
    const { internshipId, status } = req.query;

    let applications = await getInternshipApplications();
    const internships = await getInternships();
    const companyInternshipIds = internships
      .filter(i => i.companyId === companyId)
      .map(i => i.id);
    applications = applications.filter(app =>
      companyInternshipIds.includes(app.internshipId)
    );
    if (internshipId) {
      applications = applications.filter(app => app.internshipId === internshipId);
    }

    if (status) {
      applications = applications.filter(app => app.status === status);
    }
    const populatedApplications = await Promise.all(
      applications.map(async (app) => {
        const internship = await getInternshipById(app.internshipId);
        return {
          ...app,
          internship
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        applications: populatedApplications,
        total: populatedApplications.length
      }
    });
  } catch (error) {
    next(error);
  }
}
export async function getApplicationDetail(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const application = await getInternshipApplicationById(id);

    if (!application) {
      throw ErrorTypes.NOT_FOUND('Application not found');
    }
    if (userRole === 'candidate' && application.candidateId !== userId) {
      throw ErrorTypes.FORBIDDEN('Access denied');
    }

    if (userRole === 'company') {
      const internship = await getInternshipById(application.internshipId);
      if (internship.companyId !== userId) {
        throw ErrorTypes.FORBIDDEN('Access denied');
      }
    }
    const internship = await getInternshipById(application.internshipId);
    const populatedApplication = {
      ...application,
      internship
    };

    return res.status(200).json({
      success: true,
      data: { application: populatedApplication }
    });
  } catch (error) {
    next(error);
  }
}
export async function updateApplicationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const companyId = req.userId;
    const { status, notes, interviewSchedule } = req.body;

    const application = await getInternshipApplicationById(id);

    if (!application) {
      throw ErrorTypes.NOT_FOUND('Application not found');
    }
    const internship = await getInternshipById(application.internshipId);
    if (internship.companyId !== companyId) {
      throw ErrorTypes.FORBIDDEN('You do not have permission to update this application');
    }

    const updates = {
      status,
      reviewedAt: new Date().toISOString()
    };

    if (notes) updates.notes = notes;
    if (interviewSchedule) updates.interviewSchedule = interviewSchedule;

    const updated = await updateApplicationDb(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: { application: updated }
    });
  } catch (error) {
    next(error);
  }
}
export async function getApplicationStats(req, res, next) {
  try {
    const companyId = req.userId;

    const applications = await getInternshipApplications();
    const internships = await getInternships();
    const companyInternshipIds = internships
      .filter(i => i.companyId === companyId)
      .map(i => i.id);

    const companyApplications = applications.filter(app =>
      companyInternshipIds.includes(app.internshipId)
    );

    const stats = {
      total: companyApplications.length,
      applied: companyApplications.filter(a => a.status === 'applied').length,
      reviewed: companyApplications.filter(a => a.status === 'reviewed').length,
      interview: companyApplications.filter(a => a.status === 'interview').length,
      accepted: companyApplications.filter(a => a.status === 'accepted').length,
      rejected: companyApplications.filter(a => a.status === 'rejected').length
    };

    return res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
}
export async function deleteInternshipApplication(req, res, next) {
  try {
    const { id } = req.params;
    const companyId = req.userId;

    const application = await getInternshipApplicationById(id);

    if (!application) {
      throw ErrorTypes.NOT_FOUND('Application not found');
    }
    const internship = await getInternshipById(application.internshipId);
    if (!internship) {
      throw ErrorTypes.NOT_FOUND('Internship not found');
    }

    if (internship.companyId !== companyId) {
      throw ErrorTypes.FORBIDDEN('You do not have permission to delete this application');
    }

    await deleteApplicationDb(id);

    return res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  applyForInternship,
  getCandidateApplications,
  getCompanyApplications,
  getApplicationDetail,
  updateApplicationStatus,
  getApplicationStats,
  deleteInternshipApplication
};
