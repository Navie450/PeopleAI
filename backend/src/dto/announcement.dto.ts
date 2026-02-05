import { z } from 'zod';
import { AnnouncementType, AnnouncementPriority } from '../entities/Announcement';

// Helpers
const emptyToUndefined = (val: unknown) => (val === '' ? undefined : val);
const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

// Create Announcement Schema
export const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  content: z.string().min(1, 'Content is required'),
  type: z.nativeEnum(AnnouncementType).default(AnnouncementType.GENERAL),
  priority: z.nativeEnum(AnnouncementPriority).default(AnnouncementPriority.NORMAL),
  publish_date: optionalString,
  expiry_date: optionalString,
  is_active: z.boolean().default(true),
  is_pinned: z.boolean().default(false),
  target_departments: z.array(z.string().uuid()).optional(),
});

export type CreateAnnouncementDto = z.infer<typeof createAnnouncementSchema>;

// Update Announcement Schema
export const updateAnnouncementSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  type: z.nativeEnum(AnnouncementType).optional(),
  priority: z.nativeEnum(AnnouncementPriority).optional(),
  publish_date: z.string().nullable().optional(),
  expiry_date: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  is_pinned: z.boolean().optional(),
  target_departments: z.array(z.string().uuid()).nullable().optional(),
});

export type UpdateAnnouncementDto = z.infer<typeof updateAnnouncementSchema>;

// List Announcements Query Schema
export const listAnnouncementsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  type: z.nativeEnum(AnnouncementType).optional(),
  priority: z.nativeEnum(AnnouncementPriority).optional(),
  is_active: z.coerce.boolean().optional(),
  is_pinned: z.coerce.boolean().optional(),
  department_id: z.string().uuid().optional(),
  search: z.string().optional(),
  include_expired: z.coerce.boolean().default(false),
  sort_by: z.enum(['created_at', 'publish_date', 'priority', 'title']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListAnnouncementsQuery = z.infer<typeof listAnnouncementsQuerySchema>;

// Toggle Pin Schema
export const togglePinSchema = z.object({
  is_pinned: z.boolean(),
});

export type TogglePinDto = z.infer<typeof togglePinSchema>;

// Response Interfaces
export interface AnnouncementListItemResponse {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  created_by: string;
  author?: {
    id: string;
    full_name: string;
  };
  publish_date?: Date;
  expiry_date?: Date;
  is_active: boolean;
  is_pinned: boolean;
  target_departments?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface AnnouncementDetailResponse extends AnnouncementListItemResponse {
  target_department_details?: Array<{
    id: string;
    name: string;
  }>;
}
