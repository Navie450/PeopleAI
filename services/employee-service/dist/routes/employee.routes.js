"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// ============================================
// SELF-SERVICE ROUTES (Any authenticated user)
// ============================================
// Get current user's employee profile
router.get('/me', employee_controller_1.getMyProfile);
// Update own contact info
router.put('/me/contact-info', employee_controller_1.updateMyContactInfo);
// Update own emergency contacts
router.put('/me/emergency-contacts', employee_controller_1.updateMyEmergencyContacts);
// Update own goal progress
router.put('/me/goals/:goalId/progress', employee_controller_1.updateMyGoalProgress);
// ============================================
// SEARCH & DISCOVERY ROUTES
// ============================================
// Search employees (any authenticated user)
router.get('/search', employee_controller_1.searchEmployees);
// Get employees by skill
router.get('/by-skill', employee_controller_1.getEmployeesBySkill);
// Get organizational chart
router.get('/org-chart', employee_controller_1.getOrgChart);
// ============================================
// ANALYTICS ROUTES (Admin/Manager only)
// ============================================
// Get employee analytics and metrics
router.get('/analytics', rbac_middleware_1.requireAdminOrManager, employee_controller_1.getAnalytics);
// ============================================
// BULK OPERATIONS (Admin only)
// ============================================
// Bulk update employees
router.post('/bulk-update', rbac_middleware_1.requireAdmin, employee_controller_1.bulkUpdateEmployees);
// ============================================
// CRUD ROUTES
// ============================================
// List all employees with filters and pagination
router.get('/', rbac_middleware_1.requireAdminOrManager, employee_controller_1.listEmployees);
// Create new employee
router.post('/', rbac_middleware_1.requireAdmin, employee_controller_1.createEmployee);
// Get employee by ID
router.get('/:id', rbac_middleware_1.requireAdminOrManager, employee_controller_1.getEmployee);
// Update employee
router.put('/:id', rbac_middleware_1.requireAdminOrManager, employee_controller_1.updateEmployee);
// Delete employee (soft delete)
router.delete('/:id', rbac_middleware_1.requireAdmin, employee_controller_1.deleteEmployee);
// ============================================
// EMPLOYEE MANAGEMENT ROUTES (Admin/Manager)
// ============================================
// Get employee by user ID
router.get('/user/:userId', rbac_middleware_1.requireAdminOrManager, employee_controller_1.getEmployeeByUserId);
// Transfer employee to different department
router.post('/:id/transfer', rbac_middleware_1.requireAdmin, employee_controller_1.transferEmployee);
// Promote employee
router.post('/:id/promote', rbac_middleware_1.requireAdmin, employee_controller_1.promoteEmployee);
// Terminate employee
router.post('/:id/terminate', rbac_middleware_1.requireAdmin, employee_controller_1.terminateEmployee);
// Get direct reports of an employee
router.get('/:id/direct-reports', rbac_middleware_1.requireAdminOrManager, employee_controller_1.getDirectReports);
// ============================================
// SKILLS & COMPETENCIES ROUTES
// ============================================
// Update employee skills
router.put('/:id/skills', rbac_middleware_1.requireAdminOrManager, employee_controller_1.updateSkills);
// ============================================
// LEAVE MANAGEMENT ROUTES
// ============================================
// Update leave balance
router.put('/:id/leave-balance', rbac_middleware_1.requireAdminOrManager, employee_controller_1.updateLeaveBalance);
// ============================================
// PERFORMANCE MANAGEMENT ROUTES
// ============================================
// Add performance goal
router.post('/:id/goals', rbac_middleware_1.requireAdminOrManager, employee_controller_1.addPerformanceGoal);
// Update performance goal
router.put('/:id/goals/:goalId', rbac_middleware_1.requireAdminOrManager, employee_controller_1.updatePerformanceGoal);
exports.default = router;
//# sourceMappingURL=employee.routes.js.map