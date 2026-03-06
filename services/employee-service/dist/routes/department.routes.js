"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const department_controller_1 = require("../controllers/department.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// ============================================
// PUBLIC ROUTES (Any authenticated user)
// ============================================
// Get department hierarchy (for dropdowns, org views)
router.get('/hierarchy', department_controller_1.getDepartmentHierarchy);
// List all departments (for dropdowns)
router.get('/', department_controller_1.listDepartments);
// Get single department
router.get('/:id', department_controller_1.getDepartment);
// Get employees in a department
router.get('/:id/employees', rbac_middleware_1.requireAdminOrManager, department_controller_1.getDepartmentEmployees);
// ============================================
// ADMIN ROUTES
// ============================================
// Create new department
router.post('/', rbac_middleware_1.requireAdmin, department_controller_1.createDepartment);
// Update department
router.put('/:id', rbac_middleware_1.requireAdmin, department_controller_1.updateDepartment);
// Delete department
router.delete('/:id', rbac_middleware_1.requireAdmin, department_controller_1.deleteDepartment);
exports.default = router;
//# sourceMappingURL=department.routes.js.map