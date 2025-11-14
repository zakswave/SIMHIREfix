import express from 'express';
import {
  getAllJobs,
  getJobDetails,
  createNewJob,
  updateExistingJob,
  deleteExistingJob,
  getCompanyJobs,
  closeJob,
} from '../controllers/jobs.controller.js';
import { authenticate, requireCompany, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createJobSchema, updateJobSchema } from '../utils/validators.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.middleware.js';

const router = express.Router();
router.get('/', optionalAuth, getAllJobs);
router.get('/:id', optionalAuth, getJobDetails);
router.get(
  '/company/my-jobs',
  authenticate,
  requireCompany,
  getCompanyJobs
);
const parseJobFormData = (req, res, next) => {
  if (req.body) {
    if (req.body.requirements && typeof req.body.requirements === 'string') {
      try {
        req.body.requirements = JSON.parse(req.body.requirements);
      } catch (e) {
        req.body.requirements = [];
      }
    }

    if (req.body.responsibilities && typeof req.body.responsibilities === 'string') {
      try {
        req.body.responsibilities = JSON.parse(req.body.responsibilities);
      } catch (e) {
        req.body.responsibilities = [];
      }
    }

    if (req.body.skills && typeof req.body.skills === 'string') {
      try {
        req.body.skills = JSON.parse(req.body.skills);
      } catch (e) {
        req.body.skills = [];
      }
    }

    if (req.body.benefits && typeof req.body.benefits === 'string') {
      try {
        req.body.benefits = JSON.parse(req.body.benefits);
      } catch (e) {
        req.body.benefits = [];
      }
    }
    if (req.body.salaryMin) {
      req.body.salaryMin = parseInt(req.body.salaryMin) || 0;
    }
    if (req.body.salaryMax) {
      req.body.salaryMax = parseInt(req.body.salaryMax) || 0;
    }
  }
  next();
};

router.post(
  '/',
  authenticate,
  requireCompany,
  uploadSingle('logo'),
  handleUploadError,
  parseJobFormData,
  validate(createJobSchema),
  createNewJob
);

router.put(
  '/:id',
  authenticate,
  requireCompany,
  uploadSingle('logo'),
  handleUploadError,
  validate(updateJobSchema),
  updateExistingJob
);

router.delete(
  '/:id',
  authenticate,
  requireCompany,
  deleteExistingJob
);

router.put(
  '/:id/close',
  authenticate,
  requireCompany,
  closeJob
);

export default router;
