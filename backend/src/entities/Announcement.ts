import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

// Announcement type enum
export enum AnnouncementType {
  GENERAL = 'general',
  HR_UPDATE = 'hr_update',
  POLICY = 'policy',
  EVENT = 'event',
  CELEBRATION = 'celebration',
  URGENT = 'urgent',
}

// Announcement priority enum
export enum AnnouncementPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({
    type: 'enum',
    enum: AnnouncementType,
    default: AnnouncementType.GENERAL,
  })
  @Index()
  type!: AnnouncementType;

  @Column({
    type: 'enum',
    enum: AnnouncementPriority,
    default: AnnouncementPriority.NORMAL,
  })
  @Index()
  priority!: AnnouncementPriority;

  @Column({ type: 'uuid' })
  @Index()
  created_by!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  author?: User;

  @Column({ type: 'timestamp with time zone', nullable: true })
  publish_date?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiry_date?: Date;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active!: boolean;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_pinned!: boolean;

  @Column({ type: 'uuid', array: true, nullable: true })
  target_departments?: string[];

  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at?: Date;
}
