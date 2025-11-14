import { v4 as uuidv4 } from 'uuid';
import {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship as updateInternshipDb,
  deleteInternship as deleteInternshipDb,
} from '../utils/db.js';
import { ErrorTypes } from '../utils/errors.js';
export async function getAllInternships(req, res, next) {
  try {
    const { location, duration, isPaid, remote, tags, search, page = 1, limit = 20 } = req.query;

    let internships = await getInternships();
    if (search) {
      const searchLower = search.toLowerCase();
      internships = internships.filter(internship =>
        internship.position.toLowerCase().includes(searchLower) ||
        internship.description.toLowerCase().includes(searchLower) ||
        internship.company.name.toLowerCase().includes(searchLower)
      );
    }

    if (location) {
      internships = internships.filter(internship =>
        internship.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (duration) {
      internships = internships.filter(internship =>
        internship.duration === duration
      );
    }

    if (isPaid !== undefined) {
      internships = internships.filter(internship =>
        internship.isPaid === (isPaid === 'true')
      );
    }

    if (remote !== undefined) {
      internships = internships.filter(internship =>
        internship.remote === (remote === 'true')
      );
    }

    if (tags) {
      const tagList = Array.isArray(tags) ? tags : [tags];
      internships = internships.filter(internship =>
        tagList.some(tag => internship.tags.includes(tag))
      );
    }
    internships = internships.filter(i => i.status === 'active');
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedInternships = internships.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: {
        internships: paginatedInternships,
        total: internships.length,
        page: parseInt(page),
        totalPages: Math.ceil(internships.length / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
}
export async function getInternshipDetails(req, res, next) {
  try {
    const { id } = req.params;

    const internship = await getInternshipById(id);

    if (!internship) {
      throw ErrorTypes.NOT_FOUND('Internship not found');
    }

    return res.status(200).json({
      success: true,
      data: { internship }
    });
  } catch (error) {
    next(error);
  }
}
export async function createNewInternship(req, res, next) {
  try {
    const companyId = req.userId;
    const internshipData = req.body;

    const internship = {
      id: uuidv4(),
      companyId,
      ...internshipData,
      status: internshipData.status || 'active',
      postedDate: new Date().toISOString(),
      applicationCount: 0
    };

    const created = await createInternship(internship);

    return res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: { internship: created }
    });
  } catch (error) {
    next(error);
  }
}
export async function updateInternship(req, res, next) {
  try {
    const { id } = req.params;
    const companyId = req.userId;
    const updates = req.body;

    const internship = await getInternshipById(id);

    if (!internship) {
      throw ErrorTypes.NOT_FOUND('Internship not found');
    }
    if (internship.companyId !== companyId) {
      throw ErrorTypes.FORBIDDEN('You do not have permission to update this internship');
    }

    const updated = await updateInternshipDb(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: { internship: updated }
    });
  } catch (error) {
    next(error);
  }
}
export async function deleteInternship(req, res, next) {
  try {
    const { id } = req.params;
    const companyId = req.userId;

    const internship = await getInternshipById(id);

    if (!internship) {
      throw ErrorTypes.NOT_FOUND('Internship not found');
    }
    if (internship.companyId !== companyId) {
      throw ErrorTypes.FORBIDDEN('You do not have permission to delete this internship');
    }

    await deleteInternshipDb(id);

    return res.status(200).json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
export async function getCompanyInternships(req, res, next) {
  try {
    const companyId = req.userId;

    const internships = await getInternships();
    const companyInternships = internships.filter(i => i.companyId === companyId);

    return res.status(200).json({
      success: true,
      data: {
        internships: companyInternships,
        total: companyInternships.length
      }
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getAllInternships,
  getInternshipDetails,
  createNewInternship,
  updateInternship,
  deleteInternship,
  getCompanyInternships
};
