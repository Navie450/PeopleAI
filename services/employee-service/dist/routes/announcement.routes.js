"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const announcement_controller_1 = require("../controllers/announcement.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// ============================================
// PUBLIC ROUTES (Any authenticated user)
// ============================================
// List active announcements (filtered by department)
router.get('/', announcement_controller_1.listAnnouncements);
// Get announcement by ID
router.get('/:id', announcement_controller_1.getAnnouncement);
// ============================================
// ADMIN ROUTES
// ============================================
// List all announcements (including inactive/expired)
router.get('/admin/all', rbac_middleware_1.requireAdmin, announcement_controller_1.listAllAnnouncements);
// Create new announcement
router.post('/', rbac_middleware_1.requireAdmin, announcement_controller_1.createAnnouncement);
// Update announcement
router.put('/:id', rbac_middleware_1.requireAdmin, announcement_controller_1.updateAnnouncement);
// Delete announcement
router.delete('/:id', rbac_middleware_1.requireAdmin, announcement_controller_1.deleteAnnouncement);
// Toggle pin status
router.put('/:id/pin', rbac_middleware_1.requireAdmin, announcement_controller_1.togglePin);
exports.default = router;
//# sourceMappingURL=announcement.routes.js.map