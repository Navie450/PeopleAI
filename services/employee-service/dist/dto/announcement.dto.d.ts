import { z } from 'zod';
import { AnnouncementType, AnnouncementPriority } from '../entities/Announcement';
export declare const createAnnouncementSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodNativeEnum<typeof AnnouncementType>>;
    priority: z.ZodDefault<z.ZodNativeEnum<typeof AnnouncementPriority>>;
    publish_date: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    expiry_date: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, unknown>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    is_pinned: z.ZodDefault<z.ZodBoolean>;
    target_departments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: AnnouncementType;
    is_active: boolean;
    title: string;
    content: string;
    priority: AnnouncementPriority;
    is_pinned: boolean;
    publish_date?: string | undefined;
    expiry_date?: string | undefined;
    target_departments?: string[] | undefined;
}, {
    title: string;
    content: string;
    type?: AnnouncementType | undefined;
    is_active?: boolean | undefined;
    priority?: AnnouncementPriority | undefined;
    publish_date?: unknown;
    expiry_date?: unknown;
    is_pinned?: boolean | undefined;
    target_departments?: string[] | undefined;
}>;
export type CreateAnnouncementDto = z.infer<typeof createAnnouncementSchema>;
export declare const updateAnnouncementSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof AnnouncementType>>;
    priority: z.ZodOptional<z.ZodNativeEnum<typeof AnnouncementPriority>>;
    publish_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    expiry_date: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    is_active: z.ZodOptional<z.ZodBoolean>;
    is_pinned: z.ZodOptional<z.ZodBoolean>;
    target_departments: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    type?: AnnouncementType | undefined;
    is_active?: boolean | undefined;
    title?: string | undefined;
    content?: string | undefined;
    priority?: AnnouncementPriority | undefined;
    publish_date?: string | null | undefined;
    expiry_date?: string | null | undefined;
    is_pinned?: boolean | undefined;
    target_departments?: string[] | null | undefined;
}, {
    type?: AnnouncementType | undefined;
    is_active?: boolean | undefined;
    title?: string | undefined;
    content?: string | undefined;
    priority?: AnnouncementPriority | undefined;
    publish_date?: string | null | undefined;
    expiry_date?: string | null | undefined;
    is_pinned?: boolean | undefined;
    target_departments?: string[] | null | undefined;
}>;
export type UpdateAnnouncementDto = z.infer<typeof updateAnnouncementSchema>;
export declare const listAnnouncementsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof AnnouncementType>>;
    priority: z.ZodOptional<z.ZodNativeEnum<typeof AnnouncementPriority>>;
    is_active: z.ZodOptional<z.ZodBoolean>;
    is_pinned: z.ZodOptional<z.ZodBoolean>;
    department_id: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    include_expired: z.ZodDefault<z.ZodBoolean>;
    sort_by: z.ZodDefault<z.ZodEnum<["created_at", "publish_date", "priority", "title"]>>;
    sort_order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sort_by: "created_at" | "title" | "priority" | "publish_date";
    sort_order: "asc" | "desc";
    include_expired: boolean;
    type?: AnnouncementType | undefined;
    search?: string | undefined;
    is_active?: boolean | undefined;
    department_id?: string | undefined;
    priority?: AnnouncementPriority | undefined;
    is_pinned?: boolean | undefined;
}, {
    type?: AnnouncementType | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    is_active?: boolean | undefined;
    department_id?: string | undefined;
    priority?: AnnouncementPriority | undefined;
    is_pinned?: boolean | undefined;
    page?: number | undefined;
    sort_by?: "created_at" | "title" | "priority" | "publish_date" | undefined;
    sort_order?: "asc" | "desc" | undefined;
    include_expired?: boolean | undefined;
}>;
export type ListAnnouncementsQuery = z.infer<typeof listAnnouncementsQuerySchema>;
export declare const togglePinSchema: z.ZodObject<{
    is_pinned: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    is_pinned: boolean;
}, {
    is_pinned: boolean;
}>;
export type TogglePinDto = z.infer<typeof togglePinSchema>;
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
//# sourceMappingURL=announcement.dto.d.ts.map