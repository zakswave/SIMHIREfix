import express from 'express';
import {
  getAllPortfolios,
  getMyPortfolios,
  getPortfolioDetails,
  createNewPortfolio,
  updateExistingPortfolio,
  deleteExistingPortfolio,
  toggleFeatured,
} from '../controllers/portfolio.controller.js';
import { authenticate, requireCandidate, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createPortfolioSchema, updatePortfolioSchema } from '../utils/validators.js';
import { uploadMultiple, handleUploadError } from '../middleware/upload.middleware.js';

const router = express.Router();
router.get('/', optionalAuth, getAllPortfolios);
router.get('/:id', optionalAuth, getPortfolioDetails);
router.get(
  '/my/portfolios',
  authenticate,
  requireCandidate,
  getMyPortfolios
);

router.post(
  '/',
  authenticate,
  requireCandidate,
  uploadMultiple('images', 5),
  handleUploadError,
  validate(createPortfolioSchema),
  createNewPortfolio
);

router.put(
  '/:id',
  authenticate,
  requireCandidate,
  uploadMultiple('images', 5),
  handleUploadError,
  validate(updatePortfolioSchema),
  updateExistingPortfolio
);

router.delete(
  '/:id',
  authenticate,
  requireCandidate,
  deleteExistingPortfolio
);

router.put(
  '/:id/toggle-featured',
  authenticate,
  requireCandidate,
  toggleFeatured
);

export default router;
