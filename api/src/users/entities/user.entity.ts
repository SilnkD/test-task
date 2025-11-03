import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column({ length: 72 })
  passwordHash: string;

  @Column({ length: 32 })
  salt: string;

  @Column({ nullable: true, length: 128 })
  displayName?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  refreshToken?: string | null;
}
