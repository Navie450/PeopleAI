"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leave_request_controller_1 = require("../controllers/leave-request.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// ============================================
// SELF-SERVICE ROUTES (Any authenticated user)
// ============================================
// Get current user's leave requests
router.get('/my', leave_request_controller_1.getMyLeaveRequests);
// Get current user's leave balances
router.get('/my/balances', leave_request_controller_1.getMyLeaveBalances);
// Create new leave request
router.post('/', leave_request_controller_1.createLeaveRequest);
// Cancel own pending leave request
router.put('/:id/cancel', leave_request_controller_1.cancelLeaveRequest);
// ============================================
// MANAGER ROUTES
// ============================================
// Get team's leave requests
router.get('/team', rbac_middleware_1.requireAdminOrManager, leave_request_controller_1.getTeamLeaveRequests);
// Get team leave summary
router.get('/team/summary', rbac_middleware_1.requireAdminOrManager, leave_request_controller_1.getTeamLeaveSummary);
// ============================================
// ADMIN ROUTES
// ============================================
// List all leave requests
router.get('/', rbac_middleware_1.requireAdminOrManager, leave_request_controller_1.listLeaveRequests);
// Get leave request by ID
router.get('/:id', rbac_middleware_1.requireAdminOrManager, leave_request_controller_1.getLeaveRequest);
// Approve leave request
router.put('/:id/approve', rbac_middleware_1.requireAdminOrManager, leave_request_controller_1.approveLeaveRequest);
// Reject leave request
router.put('/:id/reject', rbac_middleware_1.requireAdminOrManager, leave_request_controller_1.rejectLeaveRequest);
exports.default = router;
//# sourceMappingURL=leave-request.routes.js.map