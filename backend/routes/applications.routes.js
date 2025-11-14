import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getCompanyApplications,
  getApplicationDetails,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
} from '../controllers/applications.controller.js';
import { authenticate, requireCandidate, requireCompany } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createApplicationSchema, updateApplicationStatusSchema } from '../utils/validators.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.middleware.js';

const router = express.Router();
const parseFormDataArrays = (req, res, next) => {
  if (req.body['portfolioIds[]']) {
    const ids = req.body['portfolioIds[]'];
    req.body.portfolioIds = Array.isArray(ids) ? ids : [ids];
    delete req.body['portfolioIds[]'];
  }
  next();
};
router.post(
  '/apply',
  authenticate,
  requireCandidate,
  uploadSingle('cv'),
  handleUploadError,
  parseFormDataArrays,
  validate(createApplicationSchema),
  applyForJob
);

router.get(
  '/my-applications',
  authenticate,
  requireCandidate,
  getMyApplications
);

router.delete(
  '/:id/withdraw',
  authenticate,
  requireCandidate,
  withdrawApplication
);
router.get(
  '/company',
  authenticate,
  requireCompany,
  getCompanyApplications
);

router.put(
  '/:id/status',
  authenticate,
  requireCompany,
  validate(updateApplicationStatusSchema),
  updateApplicationStatus
);
router.get(
  '/stats',
  authenticate,
  getApplicationStats
);

router.get(
  '/:id',
  authenticate,
  getApplicationDetails
);

export default router;
