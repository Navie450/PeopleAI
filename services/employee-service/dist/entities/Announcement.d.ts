export declare enum AnnouncementType {
    GENERAL = "general",
    HR_UPDATE = "hr_update",
    POLICY = "policy",
    EVENT = "event",
    CELEBRATION = "celebration",
    URGENT = "urgent"
}
export declare enum AnnouncementPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare class Announcement {
    id: string;
    title: string;
    content: string;
    type: AnnouncementType;
    priority: AnnouncementPriority;
    created_by: string;
    publish_date?: Date;
    expiry_date?: Date;
    is_active: boolean;
    is_pinned: boolean;
    target_departments?: string[];
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}
//# sourceMappingURL=Announcement.d.ts.map