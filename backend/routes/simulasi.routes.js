import express from 'express';
import {
  submitSimulasiResult,
  getMySimulasiResults,
  getSimulasiResult,
  getLeaderboard,
  getAllLeaderboards,
  getSimulasiStats,
  getAllSimulasiResultsForCompany,
} from '../controllers/simulasi.controller.js';
import { authenticate, requireCandidate, requireCompany, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { submitSimulasiSchema } from '../utils/validators.js';

const router = express.Router();
router.post(
  '/submit',
  authenticate,
  requireCandidate,
  validate(submitSimulasiSchema),
  submitSimulasiResult
);

router.get(
  '/my-results',
  authenticate,
  requireCandidate,
  getMySimulasiResults
);

router.get(
  '/stats',
  authenticate,
  requireCandidate,
  getSimulasiStats
);
router.get(
  '/results',
  authenticate,
  requireCompany,
  getAllSimulasiResultsForCompany
);
router.get(
  '/leaderboards',
  optionalAuth,
  getAllLeaderboards
);

router.get(
  '/leaderboard/:categoryId',
  optionalAuth,
  getLeaderboard
);

router.get(
  '/result/:id',
  authenticate,
  getSimulasiResult
);

export default router;
