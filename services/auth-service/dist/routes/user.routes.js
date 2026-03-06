"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(auth_middleware_1.authenticate);
// List users - Admin and Manager can access
router.get('/', rbac_middleware_1.requireAdminOrManager, user_controller_1.listUsers);
// Get user - Admin, Manager, or self
router.get('/:id', rbac_middleware_1.requireSelfOrAdmin, user_controller_1.getUser);
// Create user - Admin only
router.post('/', rbac_middleware_1.requireAdmin, user_controller_1.createUser);
// Update user - Admin only (self-update can be added with different route)
router.put('/:id', rbac_middleware_1.requireAdmin, user_controller_1.updateUser);
// Delete user - Admin only
router.delete('/:id', rbac_middleware_1.requireAdmin, user_controller_1.deleteUser);
// Activate/Deactivate user - Admin only
router.patch('/:id/activate', rbac_middleware_1.requireAdmin, user_controller_1.activateUser);
router.patch('/:id/deactivate', rbac_middleware_1.requireAdmin, user_controller_1.deactivateUser);
// Role management - Admin only
router.get('/:id/roles', rbac_middleware_1.requireAdminOrManager, user_controller_1.getUserRoles);
router.post('/:id/roles', rbac_middleware_1.requireAdmin, user_controller_1.assignRole);
router.delete('/:id/roles/:roleId', rbac_middleware_1.requireAdmin, user_controller_1.removeRole);
exports.default = router;
//# sourceMappingURL=user.routes.js.map