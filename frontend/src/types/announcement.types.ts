// Announcement Type
export type AnnouncementType =
  | 'general'
  | 'hr_update'
  | 'policy'
  | 'event'
  | 'celebration'
  | 'urgent'

// Announcement Priority
export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'critical'

// Announcement Author Info
export interface AnnouncementAuthor {
  id: string
  full_name: string
}

// Announcement List Item
export interface AnnouncementListItem {
  id: string
  title: string
  content: string
  type: AnnouncementType
  priority: AnnouncementPriority
  created_by: string
  author?: AnnouncementAuthor
  publish_date?: string
  expiry_date?: string
  is_active: boolean
  is_pinned: boolean
  target_departments?: string[]
  created_at: string
  updated_at: string
}

// Announcement Detail
export interface Announcement extends AnnouncementListItem {
  target_department_details?: Array<{
    id: string
    name: string
  }>
}

// Create Announcement DTO
export interface CreateAnnouncementDto {
  title: string
  content: string
  type?: AnnouncementType
  priority?: AnnouncementPriority
  publish_date?: string
  expiry_date?: string
  is_active?: boolean
  is_pinned?: boolean
  target_departments?: string[]
}

// Update Announcement DTO
export interface UpdateAnnouncementDto {
  title?: string
  content?: string
  type?: AnnouncementType
  priority?: AnnouncementPriority
  publish_date?: string | null
  expiry_date?: string | null
  is_active?: boolean
  is_pinned?: boolean
  target_departments?: string[] | null
}

// List Announcements Query
export interface ListAnnouncementsQuery {
  page?: number
  limit?: number
  type?: AnnouncementType
  priority?: AnnouncementPriority
  is_active?: boolean
  is_pinned?: boolean
  department_id?: string
  search?: string
  include_expired?: boolean
  sort_by?: 'created_at' | 'publish_date' | 'priority' | 'title'
  sort_order?: 'asc' | 'desc'
}

// Toggle Pin DTO
export interface TogglePinDto {
  is_pinned: boolean
}

// Announcement type display names
export const announcementTypeLabels: Record<AnnouncementType, string> = {
  general: 'General',
  hr_update: 'HR Update',
  policy: 'Policy',
  event: 'Event',
  celebration: 'Celebration',
  urgent: 'Urgent',
}

// Announcement priority display names
export const announcementPriorityLabels: Record<AnnouncementPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  critical: 'Critical',
}

// Announcement type colors for UI
export const announcementTypeColors: Record<AnnouncementType, string> = {
  general: '#64748B',
  hr_update: '#3B82F6',
  policy: '#8B5CF6',
  event: '#10B981',
  celebration: '#F59E0B',
  urgent: '#EF4444',
}

// Announcement priority colors for UI
export const announcementPriorityColors: Record<AnnouncementPriority, 'default' | 'primary' | 'warning' | 'error'> = {
  low: 'default',
  normal: 'primary',
  high: 'warning',
  critical: 'error',
}
