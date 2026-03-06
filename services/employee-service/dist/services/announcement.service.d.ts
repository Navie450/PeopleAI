import { CreateAnnouncementDto, UpdateAnnouncementDto, ListAnnouncementsQuery, TogglePinDto, AnnouncementListItemResponse, AnnouncementDetailResponse } from '../dto/announcement.dto';
import { PaginationMeta } from '../types';
declare class AnnouncementService {
    listAnnouncements(query: ListAnnouncementsQuery, userDepartmentId?: string): Promise<{
        announcements: AnnouncementListItemResponse[];
        meta: PaginationMeta;
    }>;
    listAllAnnouncements(query: ListAnnouncementsQuery): Promise<{
        announcements: AnnouncementListItemResponse[];
        meta: PaginationMeta;
    }>;
    getAnnouncementById(id: string): Promise<AnnouncementDetailResponse>;
    createAnnouncement(data: CreateAnnouncementDto, createdBy: string): Promise<AnnouncementDetailResponse>;
    updateAnnouncement(id: string, data: UpdateAnnouncementDto, updatedBy: string): Promise<AnnouncementDetailResponse>;
    deleteAnnouncement(id: string, deletedBy: string): Promise<void>;
    togglePin(id: string, data: TogglePinDto, updatedBy: string): Promise<AnnouncementDetailResponse>;
    private createAuditLog;
    private mapToListItemResponse;
    private mapToDetailResponse;
}
export declare const announcementService: AnnouncementService;
export {};
//# sourceMappingURL=announcement.service.d.ts.map