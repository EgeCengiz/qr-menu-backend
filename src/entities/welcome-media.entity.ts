import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('welcome_media')
export class WelcomeMediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  videoUrl: string | null;

  @Column({ type: 'varchar', default: '' })
  posterImg: string;

  @Column({ type: 'varchar', default: 'HOOKAHLAB LOUNGE & CAFE' })
  title: string;

  @Column({ type: 'varchar', default: 'PREMIUM QR MENU EXPERIENCE' })
  subtitle: string;

  @Column({ type: 'int', default: 4 })
  durationSeconds: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
