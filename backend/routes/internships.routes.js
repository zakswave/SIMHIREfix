import express from 'express';
import {
  getAllInternships,
  getInternshipDetails,
  createNewInternship,
  updateInternship,
  deleteInternship,
  getCompanyInternships
} from '../controllers/internships.controller.js';
import { authenticate, requireCompany } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/', getAllInternships);
router.get('/:id', getInternshipDetails);
router.get('/company/my-internships', authenticate, requireCompany, getCompanyInternships);
router.post('/', authenticate, requireCompany, createNewInternship);
router.put('/:id', authenticate, requireCompany, updateInternship);
router.delete('/:id', authenticate, requireCompany, deleteInternship);

export default router;
