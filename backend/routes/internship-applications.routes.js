import express from 'express';
import {
  applyForInternship,
  getCandidateApplications,
  getCompanyApplications,
  getApplicationDetail,
  updateApplicationStatus,
  getApplicationStats,
  deleteInternshipApplication
} from '../controllers/internship-applications.controller.js';
import { authenticate, requireCandidate, requireCompany } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', authenticate, requireCandidate, applyForInternship);
router.get('/candidate/my-applications', authenticate, requireCandidate, getCandidateApplications);
router.get('/company/applications', authenticate, requireCompany, getCompanyApplications);
router.get('/company/stats', authenticate, requireCompany, getApplicationStats);
router.put('/:id/status', authenticate, requireCompany, updateApplicationStatus);
router.delete('/:id', authenticate, requireCompany, deleteInternshipApplication);
router.get('/:id', authenticate, getApplicationDetail);

export default router;
