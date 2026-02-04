import { Router } from 'express';
import {
  listEmployees,
  getEmployee,
  getEmployeeByUserId,
  getMyProfile,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  bulkUpdateEmployees,
  transferEmployee,
  promoteEmployee,
  terminateEmployee,
  getDirectReports,
  getOrgChart,
  getAnalytics,
  searchEmployees,
  getEmployeesBySkill,
  updateSkills,
  updateLeaveBalance,
  addPerformanceGoal,
  updatePerformanceGoal,
} from '../controllers/employee.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin, requireAdminOrManager } from '../middleware/rbac.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// SELF-SERVICE ROUTES (Any authenticated user)
// ============================================

// Get current user's employee profile
router.get('/me', getMyProfile);

// ============================================
// SEARCH & DISCOVERY ROUTES
// ============================================

// Search employees (any authenticated user)
router.get('/search', searchEmployees);

// Get employees by skill
router.get('/by-skill', getEmployeesBySkill);

// Get organizational chart
router.get('/org-chart', getOrgChart);

// ============================================
// ANALYTICS ROUTES (Admin/Manager only)
// ============================================

// Get employee analytics and metrics
router.get('/analytics', requireAdminOrManager, getAnalytics);

// ============================================
// BULK OPERATIONS (Admin only)
// ============================================

// Bulk update employees
router.post('/bulk-update', requireAdmin, bulkUpdateEmployees);

// ============================================
// CRUD ROUTES
// ============================================

// List all employees with filters and pagination
router.get('/', requireAdminOrManager, listEmployees);

// Create new employee
router.post('/', requireAdmin, createEmployee);

// Get employee by ID
router.get('/:id', requireAdminOrManager, getEmployee);

// Update employee
router.put('/:id', requireAdminOrManager, updateEmployee);

// Delete employee (soft delete)
router.delete('/:id', requireAdmin, deleteEmployee);

// ============================================
// EMPLOYEE MANAGEMENT ROUTES (Admin/Manager)
// ============================================

// Get employee by user ID
router.get('/user/:userId', requireAdminOrManager, getEmployeeByUserId);

// Transfer employee to different department
router.post('/:id/transfer', requireAdmin, transferEmployee);

// Promote employee
router.post('/:id/promote', requireAdmin, promoteEmployee);

// Terminate employee
router.post('/:id/terminate', requireAdmin, terminateEmployee);

// Get direct reports of an employee
router.get('/:id/direct-reports', requireAdminOrManager, getDirectReports);

// ============================================
// SKILLS & COMPETENCIES ROUTES
// ============================================

// Update employee skills
router.put('/:id/skills', requireAdminOrManager, updateSkills);

// ============================================
// LEAVE MANAGEMENT ROUTES
// ============================================

// Update leave balance
router.put('/:id/leave-balance', requireAdminOrManager, updateLeaveBalance);

// ============================================
// PERFORMANCE MANAGEMENT ROUTES
// ============================================

// Add performance goal
router.post('/:id/goals', requireAdminOrManager, addPerformanceGoal);

// Update performance goal
router.put('/:id/goals/:goalId', requireAdminOrManager, updatePerformanceGoal);

export default router;
