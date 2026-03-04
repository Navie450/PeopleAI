import { Router } from 'express';
import healthRoutes from './health.routes';
import employeeRoutes from './employee.routes';
import departmentRoutes from './department.routes';
import leaveRequestRoutes from './leave-request.routes';
import announcementRoutes from './announcement.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/leave-requests', leaveRequestRoutes);
router.use('/announcements', announcementRoutes);

export default router;
