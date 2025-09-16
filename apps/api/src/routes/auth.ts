import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
} from '@/controllers/userController';
import { authenticateToken } from '@/middleware/auth';
import { validateBody } from '@/middleware/validation';
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema,
} from '@/types/validation';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), asyncHandler(register));
router.post('/login', validateBody(loginSchema), asyncHandler(login));
router.post('/refresh-token', asyncHandler(refreshToken));

// Protected routes
router.use(authenticateToken);

router.get('/profile', asyncHandler(getProfile));
router.put('/profile', validateBody(updateUserSchema), asyncHandler(updateProfile));
router.put('/change-password', validateBody(changePasswordSchema), asyncHandler(changePassword));
router.post('/logout', asyncHandler(logout));

export default router;
