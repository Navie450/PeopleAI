"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcement = exports.AnnouncementPriority = exports.AnnouncementType = void 0;
const typeorm_1 = require("typeorm");
// Announcement type enum
var AnnouncementType;
(function (AnnouncementType) {
    AnnouncementType["GENERAL"] = "general";
    AnnouncementType["HR_UPDATE"] = "hr_update";
    AnnouncementType["POLICY"] = "policy";
    AnnouncementType["EVENT"] = "event";
    AnnouncementType["CELEBRATION"] = "celebration";
    AnnouncementType["URGENT"] = "urgent";
})(AnnouncementType || (exports.AnnouncementType = AnnouncementType = {}));
// Announcement priority enum
var AnnouncementPriority;
(function (AnnouncementPriority) {
    AnnouncementPriority["LOW"] = "low";
    AnnouncementPriority["NORMAL"] = "normal";
    AnnouncementPriority["HIGH"] = "high";
    AnnouncementPriority["CRITICAL"] = "critical";
})(AnnouncementPriority || (exports.AnnouncementPriority = AnnouncementPriority = {}));
let Announcement = class Announcement {
    id;
    title;
    content;
    type;
    priority;
    created_by;
    publish_date;
    expiry_date;
    is_active;
    is_pinned;
    target_departments;
    // Timestamps
    created_at;
    updated_at;
    deleted_at;
};
exports.Announcement = Announcement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Announcement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Announcement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Announcement.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AnnouncementType,
        default: AnnouncementType.GENERAL,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Announcement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AnnouncementPriority,
        default: AnnouncementPriority.NORMAL,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Announcement.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Announcement.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], Announcement.prototype, "publish_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], Announcement.prototype, "expiry_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], Announcement.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], Announcement.prototype, "is_pinned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true }),
    __metadata("design:type", Array)
], Announcement.prototype, "target_departments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Announcement.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Announcement.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], Announcement.prototype, "deleted_at", void 0);
exports.Announcement = Announcement = __decorate([
    (0, typeorm_1.Entity)('announcements')
], Announcement);
//# sourceMappingURL=Announcement.js.map