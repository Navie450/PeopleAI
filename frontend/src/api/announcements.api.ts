import { apiClient } from './client'
import type {
  ApiResponse,
  Announcement,
  AnnouncementListItem,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  ListAnnouncementsQuery,
  TogglePinDto,
} from '@/types'

export const announcementsApi = {
  // ============================================
  // PUBLIC ENDPOINTS (Authenticated users)
  // ============================================

  // List active announcements (filtered by user's department)
  list: (params?: ListAnnouncementsQuery) =>
    apiClient.get<ApiResponse<AnnouncementListItem[]>>('/announcements', { params }),

  // Get announcement by ID
  getById: (id: string) =>
    apiClient.get<ApiResponse<Announcement>>(`/announcements/${id}`),

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  // List all announcements (including inactive/expired)
  listAll: (params?: ListAnnouncementsQuery) =>
    apiClient.get<ApiResponse<AnnouncementListItem[]>>('/announcements/admin/all', { params }),

  // Create new announcement
  create: (data: CreateAnnouncementDto) =>
    apiClient.post<ApiResponse<Announcement>>('/announcements', data),

  // Update announcement
  update: (id: string, data: UpdateAnnouncementDto) =>
    apiClient.put<ApiResponse<Announcement>>(`/announcements/${id}`, data),

  // Delete announcement
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/announcements/${id}`),

  // Toggle pin status
  togglePin: (id: string, data: TogglePinDto) =>
    apiClient.put<ApiResponse<Announcement>>(`/announcements/${id}/pin`, data),
}
