import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { SubCategoryEntity } from './sub-category.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', default: '' })
  desc: string;

  @Column({ type: 'varchar', default: '' })
  price: string;

  @Column({ type: 'varchar', default: '' })
  img: string;

  @Column({ type: 'text', nullable: true, default: null })
  tags: string | null; // JSON array as string

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'int', default: 0 })
  position: number;

  @Column({ type: 'varchar' })
  categoryId: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  subCategoryId: string | null;

  @ManyToOne(() => CategoryEntity, (cat) => cat.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ManyToOne(() => SubCategoryEntity, (sub) => sub.items, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategoryEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
