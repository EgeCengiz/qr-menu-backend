import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('store_settings')
export class SettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: 'HOOKAHLAB RİZE' })
  storeName: string;

  @Column({ type: 'varchar', default: 'Bize uğrayın.' })
  title: string;

  @Column({ type: 'varchar', default: 'Çarşı Mahallesi, TOKİ AVM' })
  addressLine1: string;

  @Column({ type: 'varchar', default: 'Merkez / Rize' })
  addressLine2: string;

  @Column({ type: 'varchar', default: 'Her gün 08:30 – 00:00' })
  workingHours: string;

  @Column({ type: 'varchar', default: 'Hafta içi 08:30–15:00' })
  breakfastWeekdays: string;

  @Column({ type: 'varchar', default: 'Hafta sonu 08:30–16:00' })
  breakfastWeekends: string;

  @Column({ type: 'varchar', default: '05513832509' })
  phone: string;

  @Column({ type: 'varchar', default: '0 551 383 25 09' })
  phoneDisplay: string;

  @Column({ type: 'varchar', length: 500, default: 'https://www.google.com/maps/search/?api=1&query=HookahLab+Rize+TOK%C4%B0+AVM' })
  googleMapsUrl: string;

  @Column({ type: 'varchar', default: 'Resmî tatillerde çalışma saatleri değişebilir.' })
  note: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
