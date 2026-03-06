"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePinSchema = exports.listAnnouncementsQuerySchema = exports.updateAnnouncementSchema = exports.createAnnouncementSchema = void 0;
const zod_1 = require("zod");
const Announcement_1 = require("../entities/Announcement");
// Helpers
const emptyToUndefined = (val) => (val === '' ? undefined : val);
const optionalString = zod_1.z.preprocess(emptyToUndefined, zod_1.z.string().optional());
// Create Announcement Schema
exports.createAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
    content: zod_1.z.string().min(1, 'Content is required'),
    type: zod_1.z.nativeEnum(Announcement_1.AnnouncementType).default(Announcement_1.AnnouncementType.GENERAL),
    priority: zod_1.z.nativeEnum(Announcement_1.AnnouncementPriority).default(Announcement_1.AnnouncementPriority.NORMAL),
    publish_date: optionalString,
    expiry_date: optionalString,
    is_active: zod_1.z.boolean().default(true),
    is_pinned: zod_1.z.boolean().default(false),
    target_departments: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
// Update Announcement Schema
exports.updateAnnouncementSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    content: zod_1.z.string().min(1).optional(),
    type: zod_1.z.nativeEnum(Announcement_1.AnnouncementType).optional(),
    priority: zod_1.z.nativeEnum(Announcement_1.AnnouncementPriority).optional(),
    publish_date: zod_1.z.string().nullable().optional(),
    expiry_date: zod_1.z.string().nullable().optional(),
    is_active: zod_1.z.boolean().optional(),
    is_pinned: zod_1.z.boolean().optional(),
    target_departments: zod_1.z.array(zod_1.z.string().uuid()).nullable().optional(),
});
// List Announcements Query Schema
exports.listAnnouncementsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    type: zod_1.z.nativeEnum(Announcement_1.AnnouncementType).optional(),
    priority: zod_1.z.nativeEnum(Announcement_1.AnnouncementPriority).optional(),
    is_active: zod_1.z.coerce.boolean().optional(),
    is_pinned: zod_1.z.coerce.boolean().optional(),
    department_id: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().optional(),
    include_expired: zod_1.z.coerce.boolean().default(false),
    sort_by: zod_1.z.enum(['created_at', 'publish_date', 'priority', 'title']).default('created_at'),
    sort_order: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
// Toggle Pin Schema
exports.togglePinSchema = zod_1.z.object({
    is_pinned: zod_1.z.boolean(),
});
//# sourceMappingURL=announcement.dto.js.map