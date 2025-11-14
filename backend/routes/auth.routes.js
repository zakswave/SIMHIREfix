import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  logout,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../utils/validators.js';
import { uploadFields, handleUploadError } from '../middleware/upload.middleware.js';
import { authLimiter, uploadLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();
router.post(
  '/register',
  authLimiter,
  uploadFields([
    { name: 'ktp', maxCount: 1 },
    { name: 'npwpDoc', maxCount: 1 },
  ]),
  handleUploadError,
  validate(registerSchema),
  register
);

router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', authenticate, getCurrentUser);

router.put(
  '/profile',
  authenticate,
  uploadLimiter,
  uploadFields([{ name: 'avatar', maxCount: 1 }]),
  handleUploadError,
  validate(updateProfileSchema),
  updateProfile
);

router.post('/logout', authenticate, logout);

export default router;
