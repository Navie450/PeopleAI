import { Router } from 'express';
import {
  getMyLeaveRequests,
  getMyLeaveBalances,
  createLeaveRequest,
  cancelLeaveRequest,
  listLeaveRequests,
  getTeamLeaveRequests,
  getTeamLeaveSummary,
  getLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
} from '../controllers/leave-request.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin, requireAdminOrManager } from '../middleware/rbac.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// SELF-SERVICE ROUTES (Any authenticated user)
// ============================================

// Get current user's leave requests
router.get('/my', getMyLeaveRequests);

// Get current user's leave balances
router.get('/my/balances', getMyLeaveBalances);

// Create new leave request
router.post('/', createLeaveRequest);

// Cancel own pending leave request
router.put('/:id/cancel', cancelLeaveRequest);

// ============================================
// MANAGER ROUTES
// ============================================

// Get team's leave requests
router.get('/team', requireAdminOrManager, getTeamLeaveRequests);

// Get team leave summary
router.get('/team/summary', requireAdminOrManager, getTeamLeaveSummary);

// ============================================
// ADMIN ROUTES
// ============================================

// List all leave requests
router.get('/', requireAdminOrManager, listLeaveRequests);

// Get leave request by ID
router.get('/:id', requireAdminOrManager, getLeaveRequest);

// Approve leave request
router.put('/:id/approve', requireAdminOrManager, approveLeaveRequest);

// Reject leave request
router.put('/:id/reject', requireAdminOrManager, rejectLeaveRequest);

export default router;
