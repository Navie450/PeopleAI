"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementService = void 0;
const database_1 = require("../config/database");
const Announcement_1 = require("../entities/Announcement");
const Department_1 = require("../entities/Department");
const AuditLog_1 = require("../entities/AuditLog");
const typeorm_1 = require("typeorm");
const logger_1 = require("../utils/logger");
const errors_1 = require("../utils/errors");
class AnnouncementService {
    // List announcements (for authenticated users - shows active, non-expired)
    async listAnnouncements(query, userDepartmentId) {
        const announcementRepository = database_1.AppDataSource.getRepository(Announcement_1.Announcement);
        const page = query.page || 1;
        const limit = Math.min(query.limit || 10, 100);
        const skip = (page - 1) * limit;
        const queryBuilder = announcementRepository
            .createQueryBuilder('announcement')
            .where('announcement.deleted_at IS NULL');
        // For non-admin users, only show active announcements
        if (!query.is_active) {
            queryBuilder.andWhere('announcement.is_active = :isActive', { isActive: true });
        }
        else {
            queryBuilder.andWhere('announcement.is_active = :isActive', { isActive: query.is_active });
        }
        // Filter by expiry (unless include_expired is true)
        if (!query.include_expired) {
            queryBuilder.andWhere('(announcement.expiry_date IS NULL OR announcement.expiry_date >= :now)', { now: new Date() });
        }
        // Filter by publish date (only show published announcements)
        queryBuilder.andWhere('(announcement.publish_date IS NULL OR announcement.publish_date <= :now)', { now: new Date() });
        // Filter by department (show announcements with no target or matching department)
        if (userDepartmentId) {
            queryBuilder.andWhere('(announcement.target_departments IS NULL OR :departmentId = ANY(announcement.target_departments))', { departmentId: userDepartmentId });
        }
        // Apply additional filters
        if (query.type) {
            queryBuilder.andWhere('announcement.type = :type', { type: query.type });
        }
        if (query.priority) {
            queryBuilder.andWhere('announcement.priority = :priority', { priority: query.priority });
        }
        if (query.is_pinned !== undefined) {
            queryBuilder.andWhere('announcement.is_pinned = :isPinned', { isPinned: query.is_pinned });
        }
        if (query.search) {
            queryBuilder.andWhere('(announcement.title ILIKE :search OR announcement.content ILIKE :search)', { search: `%${query.search}%` });
        }
        // Get total count
        const total = await queryBuilder.getCount();
        // Apply sorting - pinned first, then by sort criteria
        queryBuilder.orderBy('announcement.is_pinned', 'DESC');
        if (query.sort_by === 'priority') {
            // Custom priority order
            queryBuilder.addOrderBy(`CASE announcement.priority
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'normal' THEN 3
          WHEN 'low' THEN 4
        END`, query.sort_order === 'asc' ? 'ASC' : 'DESC');
        }
        else {
            queryBuilder.addOrderBy(`announcement.${query.sort_by}`, query.sort_order === 'asc' ? 'ASC' : 'DESC');
        }
        // Get paginated results
        const announcements = await queryBuilder.skip(skip).take(limit).getMany();
        const responses = announcements.map((a) => this.mapToListItemResponse(a));
        const meta = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
        return { announcements: responses, meta };
    }
    // List all announcements for admin (includes inactive and expired)
    async listAllAnnouncements(query) {
        const announcementRepository = database_1.AppDataSource.getRepository(Announcement_1.Announcement);
        const page = query.page || 1;
        const limit = Math.min(query.limit || 10, 100);
        const skip = (page - 1) * limit;
        const queryBuilder = announcementRepository
            .createQueryBuilder('announcement')
            .where('announcement.deleted_at IS NULL');
        // Apply filters
        if (query.is_active !== undefined) {
            queryBuilder.andWhere('announcement.is_active = :isActive', { isActive: query.is_active });
        }
        if (query.type) {
            queryBuilder.andWhere('announcement.type = :type', { type: query.type });
        }
        if (query.priority) {
            queryBuilder.andWhere('announcement.priority = :priority', { priority: query.priority });
        }
        if (query.is_pinned !== undefined) {
            queryBuilder.andWhere('announcement.is_pinned = :isPinned', { isPinned: query.is_pinned });
        }
        if (query.department_id) {
            queryBuilder.andWhere(':departmentId = ANY(announcement.target_departments)', {
                departmentId: query.department_id,
            });
        }
        if (query.search) {
            queryBuilder.andWhere('(announcement.title ILIKE :search OR announcement.content ILIKE :search)', { search: `%${query.search}%` });
        }
        // Get total count
        const total = await queryBuilder.getCount();
        // Apply sorting
        if (query.sort_by === 'priority') {
            queryBuilder.orderBy(`CASE announcement.priority
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'normal' THEN 3
          WHEN 'low' THEN 4
        END`, query.sort_order === 'asc' ? 'ASC' : 'DESC');
        }
        else {
            queryBuilder.orderBy(`announcement.${query.sort_by}`, query.sort_order === 'asc' ? 'ASC' : 'DESC');
        }
        // Get paginated results
        const announcements = await queryBuilder.skip(skip).take(limit).getMany();
        const responses = announcements.map((a) => this.mapToListItemResponse(a));
        const meta = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
        return { announcements: responses, meta };
    }
    // Get announcement by ID
    async getAnnouncementById(id) {
        const announcementRepository = database_1.AppDataSource.getRepository(Announcement_1.Announcement);
        const announcement = await announcementRepository
            .createQueryBuilder('announcement')
            .where('announcement.id = :id', { id })
            .andWhere('announcement.deleted_at IS NULL')
            .getOne();
        if (!announcement) {
            throw new errors_1.NotFoundError('Announcement not found');
        }
        return this.mapToDetailResponse(announcement);
    }
    // Create announcement (admin only)
    async createAnnouncement(data, createdBy) {
        const announcementRepository = database_1.AppDataSource.getRepository(Announcement_1.Announcement);
        // Validate target departments if provided
        if (data.target_departments && data.target_departments.length > 0) {
            const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
            const departments = await departmentRepository.find({
                where: { id: (0, typeorm_1.In)(data.target_departments), deleted_at: (0, typeorm_1.IsNull)() },
            });
            if (departments.length !== data.target_departments.length) {
                throw new errors_1.ValidationError('One or more invalid department IDs');
            }
        }
        try {
            const announcement = announcementRepository.create({
                title: data.title,
                content: data.content,
                type: data.type,
                priority: data.priority,
                is_active: data.is_active,
                is_pinned: data.is_pinned,
                target_departments: data.target_departments,
                created_by: createdBy,
                publish_date: data.publish_date ? new Date(data.publish_date) : undefined,
                expiry_date: data.expiry_date ? new Date(data.expiry_date) : undefined,
            });
            await announcementRepository.save(announcement);
            // Create audit log
            await this.createAuditLog({
                user_id: createdBy,
                action: 'CREATE_ANNOUNCEMENT',
                resource_type: 'announcement',
                resource_id: announcement.id,
                changes: {
                    title: data.title,
                    type: data.type,
                    priority: data.priority,
                },
            });
            logger_1.logger.info('Announcement created:', { id: announcement.id, createdBy });
            return this.getAnnouncementById(announcement.id);
        }
        catch (error) {
            logger_1.logger.error('Failed to create announcement:', error);
            throw error;
        }
    }
    // Update announcement (admin only)
    async updateAnnouncement(id, data, updatedBy) {
        const announcementRepository = database_1.AppDataSource.getRepository(Announcement_1.Announcement);
        const announcement = await announcementRepository.findOne({
            where: { id, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!announcement) {
            throw new errors_1.NotFoundError('Announcement not found');
        }
        // Validate target departments if being updated
        if (data.target_departments && data.target_departments.length > 0) {
            const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
            const departments = await departmentRepository.find({
                where: { id: (0, typeorm_1.In)(data.target_departments), deleted_at: (0, typeorm_1.IsNull)() },
            });
            if (departments.length !== data.target_departments.length) {
                throw new errors_1.ValidationError('One or more invalid department IDs');
            }
        }
        const changes = {};
        // Track changes
        if (data.title && data.title !== announcement.title) {
            changes.title = { from: announcement.title, to: data.title };
        }
        if (data.is_active !== undefined && data.is_active !== announcement.is_active) {
            changes.is_active = { from: announcement.is_active, to: data.is_active };
        }
        // Apply updates
        const updateData = { ...data };
        if (data.publish_date) {
            updateData.publish_date = new Date(data.publish_date);
        }
        if (data.expiry_date) {
            updateData.expiry_date = new Date(data.expiry_date);
        }
        if (data.publish_date === null) {
            updateData.publish_date = undefined;
        }
        if (data.expiry_date === null) {
            updateData.expiry_date = undefined;
        }
        Object.assign(announcement, updateData);
        await announcementRepository.save(announcement);
        // Create audit log
        if (Object.keys(changes).length > 0) {
            await this.createAuditLog({
                user_id: updatedBy,
                action: 'UPDATE_ANNOUNCEMENT',
                resource_type: 'announcement',
                resource_id: id,
                changes,
            });
        }
        logger_1.logger.info('Announcement updated:', { id, updatedBy });
        return this.getAnnouncementById(id);
    }
    // Delete announcement (admin only)
    async deleteAnnouncement(id, deletedBy) {
        const announcementRepository = database_1.AppDataSource.getRepository(Announcement_1.Announcement);
        const announcement = await announcementRepository.findOne({
            where: { id, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!announcement) {
            throw new errors_1.NotFoundError('Announcement not found');
        }
        // Soft delete
        announcement.deleted_at = new Date();
        await announcementRepository.save(announcement);
        // Create audit log
        await this.createAuditLog({
            user_id: deletedBy,
            action: 'DELETE_ANNOUNCEMENT',
            resource_type: 'announcement',
            resource_id: id,
            changes: { title: announcement.title },
        });
        logger_1.logger.info('Announcement deleted:', { id, deletedBy });
    }
    // Toggle pin status (admin only)
    async togglePin(id, data, updatedBy) {
        const announcementRepository = database_1.AppDataSource.getRepository(Announcement_1.Announcement);
        const announcement = await announcementRepository.findOne({
            where: { id, deleted_at: (0, typeorm_1.IsNull)() },
        });
        if (!announcement) {
            throw new errors_1.NotFoundError('Announcement not found');
        }
        announcement.is_pinned = data.is_pinned;
        await announcementRepository.save(announcement);
        await this.createAuditLog({
            user_id: updatedBy,
            action: data.is_pinned ? 'PIN_ANNOUNCEMENT' : 'UNPIN_ANNOUNCEMENT',
            resource_type: 'announcement',
            resource_id: id,
            changes: { is_pinned: data.is_pinned },
        });
        logger_1.logger.info(`Announcement ${data.is_pinned ? 'pinned' : 'unpinned'}:`, { id, updatedBy });
        return this.getAnnouncementById(id);
    }
    async createAuditLog(data) {
        const auditLogRepository = database_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
        const auditLog = auditLogRepository.create(data);
        await auditLogRepository.save(auditLog);
    }
    mapToListItemResponse(announcement) {
        return {
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            priority: announcement.priority,
            created_by: announcement.created_by,
            publish_date: announcement.publish_date,
            expiry_date: announcement.expiry_date,
            is_active: announcement.is_active,
            is_pinned: announcement.is_pinned,
            target_departments: announcement.target_departments,
            created_at: announcement.created_at,
            updated_at: announcement.updated_at,
        };
    }
    async mapToDetailResponse(announcement) {
        const response = this.mapToListItemResponse(announcement);
        // Get department details if target_departments is set
        if (announcement.target_departments && announcement.target_departments.length > 0) {
            const departmentRepository = database_1.AppDataSource.getRepository(Department_1.Department);
            const departments = await departmentRepository.find({
                where: { id: (0, typeorm_1.In)(announcement.target_departments) },
            });
            return {
                ...response,
                target_department_details: departments.map((d) => ({
                    id: d.id,
                    name: d.name,
                })),
            };
        }
        return response;
    }
}
exports.announcementService = new AnnouncementService();
//# sourceMappingURL=announcement.service.js.map