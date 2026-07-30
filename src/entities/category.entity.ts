import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubCategoryEntity } from './sub-category.entity';
import { ProductEntity } from './product.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', default: '' })
  num: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', default: '' })
  subtitle: string;

  @Column({ type: 'varchar', default: '' })
  img: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  videoUrl: string | null;

  @OneToMany(() => SubCategoryEntity, (sub) => sub.category, {
    cascade: true,
    eager: false,
  })
  subCategories: SubCategoryEntity[];

  @OneToMany(() => ProductEntity, (prod) => prod.category, {
    cascade: true,
    eager: false,
  })
  items: ProductEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
