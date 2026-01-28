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

@Entity('token_cache')
export class TokenCache {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  user_id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  token_jti!: string;

  @Column({ type: 'timestamp with time zone' })
  @Index()
  expires_at!: Date;

  @Column({ type: 'boolean', default: false })
  revoked!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
