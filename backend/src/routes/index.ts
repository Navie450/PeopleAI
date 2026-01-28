import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

// Health check routes (no auth required)
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// User routes (authentication handled within route)
router.use('/users', userRoutes);

// Role routes will be added here if needed
// router.use('/roles', roleRoutes);

export default router;
