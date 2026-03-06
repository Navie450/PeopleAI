"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePin = exports.deleteAnnouncement = exports.updateAnnouncement = exports.createAnnouncement = exports.getAnnouncement = exports.listAllAnnouncements = exports.listAnnouncements = void 0;
const announcement_service_1 = require("../services/announcement.service");
const employee_service_1 = require("../services/employee.service");
const logger_1 = require("../utils/logger");
const announcement_dto_1 = require("../dto/announcement.dto");
// List announcements (for authenticated users)
const listAnnouncements = async (req, res, next) => {
    try {
        const query = announcement_dto_1.listAnnouncementsQuerySchema.parse(req.query);
        const userId = req.user?.id;
        // Get user's department for filtering
        let userDepartmentId;
        if (userId) {
            try {
                const employee = await employee_service_1.employeeService.getEmployeeByUserId(userId);
                userDepartmentId = employee.department?.id;
            }
            catch {
                // User may not have an employee record
            }
        }
        const { announcements, meta } = await announcement_service_1.announcementService.listAnnouncements(query, userDepartmentId);
        const response = {
            success: true,
            data: announcements,
            meta: { pagination: meta },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.listAnnouncements = listAnnouncements;
// List all announcements for admin
const listAllAnnouncements = async (req, res, next) => {
    try {
        const query = announcement_dto_1.listAnnouncementsQuerySchema.parse(req.query);
        const { announcements, meta } = await announcement_service_1.announcementService.listAllAnnouncements(query);
        const response = {
            success: true,
            data: announcements,
            meta: { pagination: meta },
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.listAllAnnouncements = listAllAnnouncements;
// Get announcement by ID
const getAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const announcement = await announcement_service_1.announcementService.getAnnouncementById(id);
        const response = {
            success: true,
            data: announcement,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnnouncement = getAnnouncement;
// Create announcement (admin only)
const createAnnouncement = async (req, res, next) => {
    try {
        const createdBy = req.user?.id;
        if (!createdBy) {
            throw new Error('User not authenticated');
        }
        const data = announcement_dto_1.createAnnouncementSchema.parse(req.body);
        const announcement = await announcement_service_1.announcementService.createAnnouncement(data, createdBy);
        logger_1.logger.info('Announcement created via API:', {
            id: announcement.id,
            createdBy,
        });
        const response = {
            success: true,
            data: announcement,
            message: 'Announcement created successfully',
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.createAnnouncement = createAnnouncement;
// Update announcement (admin only)
const updateAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedBy = req.user?.id;
        if (!updatedBy) {
            throw new Error('User not authenticated');
        }
        const data = announcement_dto_1.updateAnnouncementSchema.parse(req.body);
        const announcement = await announcement_service_1.announcementService.updateAnnouncement(id, data, updatedBy);
        logger_1.logger.info('Announcement updated via API:', {
            id,
            updatedBy,
        });
        const response = {
            success: true,
            data: announcement,
            message: 'Announcement updated successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.updateAnnouncement = updateAnnouncement;
// Delete announcement (admin only)
const deleteAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedBy = req.user?.id;
        if (!deletedBy) {
            throw new Error('User not authenticated');
        }
        await announcement_service_1.announcementService.deleteAnnouncement(id, deletedBy);
        logger_1.logger.info('Announcement deleted via API:', {
            id,
            deletedBy,
        });
        const response = {
            success: true,
            message: 'Announcement deleted successfully',
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
// Toggle pin status (admin only)
const togglePin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedBy = req.user?.id;
        if (!updatedBy) {
            throw new Error('User not authenticated');
        }
        const data = announcement_dto_1.togglePinSchema.parse(req.body);
        const announcement = await announcement_service_1.announcementService.togglePin(id, data, updatedBy);
        logger_1.logger.info(`Announcement ${data.is_pinned ? 'pinned' : 'unpinned'} via API:`, {
            id,
            updatedBy,
        });
        const response = {
            success: true,
            data: announcement,
            message: `Announcement ${data.is_pinned ? 'pinned' : 'unpinned'} successfully`,
        };
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
exports.togglePin = togglePin;
//# sourceMappingURL=announcement.controller.js.map