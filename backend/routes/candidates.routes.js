import express from 'express';
import {
  searchCandidates,
  getCandidateProfile,
  getTopCandidates,
  getCandidateRecommendations,
} from '../controllers/candidates.controller.js';
import { authenticate, requireCompany } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get(
  '/search',
  authenticate,
  requireCompany,
  searchCandidates
);

router.get(
  '/top',
  authenticate,
  requireCompany,
  getTopCandidates
);

router.get(
  '/recommendations/:jobId',
  authenticate,
  requireCompany,
  getCandidateRecommendations
);

router.get(
  '/:id',
  authenticate,
  requireCompany,
  getCandidateProfile
);

export default router;
