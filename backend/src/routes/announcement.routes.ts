import { Router } from 'express';
import {
  listAnnouncements,
  listAllAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePin,
} from '../controllers/announcement.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/rbac.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// PUBLIC ROUTES (Any authenticated user)
// ============================================

// List active announcements (filtered by department)
router.get('/', listAnnouncements);

// Get announcement by ID
router.get('/:id', getAnnouncement);

// ============================================
// ADMIN ROUTES
// ============================================

// List all announcements (including inactive/expired)
router.get('/admin/all', requireAdmin, listAllAnnouncements);

// Create new announcement
router.post('/', requireAdmin, createAnnouncement);

// Update announcement
router.put('/:id', requireAdmin, updateAnnouncement);

// Delete announcement
router.delete('/:id', requireAdmin, deleteAnnouncement);

// Toggle pin status
router.put('/:id/pin', requireAdmin, togglePin);

export default router;
