import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  changePassword,
  logout,
  getCurrentUser,
} from '../controllers/auth.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', optionalAuthenticate, logout);
router.get('/me', authenticate, getCurrentUser);
router.post('/change-password', authenticate, changePassword);

export default router;
