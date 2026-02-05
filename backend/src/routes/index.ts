import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import employeeRoutes from './employee.routes';
import departmentRoutes from './department.routes';
import leaveRequestRoutes from './leave-request.routes';
import announcementRoutes from './announcement.routes';

const router = Router();

// Health check routes (no auth required)
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// User routes (authentication handled within route)
router.use('/users', userRoutes);

// Employee routes (authentication handled within route)
router.use('/employees', employeeRoutes);

// Department routes (authentication handled within route)
router.use('/departments', departmentRoutes);

// Leave request routes (authentication handled within route)
router.use('/leave-requests', leaveRequestRoutes);

// Announcement routes (authentication handled within route)
router.use('/announcements', announcementRoutes);

export default router;
