import { Router } from 'express';
import {
  listDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentHierarchy,
  getDepartmentEmployees,
} from '../controllers/department.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin, requireAdminOrManager } from '../middleware/rbac.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// PUBLIC ROUTES (Any authenticated user)
// ============================================

// Get department hierarchy (for dropdowns, org views)
router.get('/hierarchy', getDepartmentHierarchy);

// List all departments (for dropdowns)
router.get('/', listDepartments);

// Get single department
router.get('/:id', getDepartment);

// Get employees in a department
router.get('/:id/employees', requireAdminOrManager, getDepartmentEmployees);

// ============================================
// ADMIN ROUTES
// ============================================

// Create new department
router.post('/', requireAdmin, createDepartment);

// Update department
router.put('/:id', requireAdmin, updateDepartment);

// Delete department
router.delete('/:id', requireAdmin, deleteDepartment);

export default router;
