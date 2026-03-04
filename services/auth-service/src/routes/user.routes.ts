import { Router } from 'express';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  getUserRoles,
  assignRole,
  removeRole,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin, requireAdminOrManager, requireSelfOrAdmin } from '../middleware/rbac.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// List users - Admin and Manager can access
router.get('/', requireAdminOrManager, listUsers);

// Get user - Admin, Manager, or self
router.get('/:id', requireSelfOrAdmin, getUser);

// Create user - Admin only
router.post('/', requireAdmin, createUser);

// Update user - Admin only (self-update can be added with different route)
router.put('/:id', requireAdmin, updateUser);

// Delete user - Admin only
router.delete('/:id', requireAdmin, deleteUser);

// Activate/Deactivate user - Admin only
router.patch('/:id/activate', requireAdmin, activateUser);
router.patch('/:id/deactivate', requireAdmin, deactivateUser);

// Role management - Admin only
router.get('/:id/roles', requireAdminOrManager, getUserRoles);
router.post('/:id/roles', requireAdmin, assignRole);
router.delete('/:id/roles/:roleId', requireAdmin, removeRole);

export default router;
