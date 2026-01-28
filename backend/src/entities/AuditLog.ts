import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  user_id?: string;

  @Column({ type: 'varchar', length: 100 })
  action!: string;

  @Column({ type: 'varchar', length: 50 })
  resource_type!: string;

  @Column({ type: 'uuid', nullable: true })
  resource_id?: string;

  @Column({ type: 'jsonb', nullable: true })
  changes?: Record<string, unknown>;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address?: string;

  @Column({ type: 'text', nullable: true })
  user_agent?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Index()
  created_at!: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
