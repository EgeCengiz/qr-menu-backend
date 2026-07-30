import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';

@Entity('sub_categories')
export class SubCategoryEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @Column({ type: 'varchar' })
  categoryId: string;

  @ManyToOne(() => CategoryEntity, (cat) => cat.subCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @OneToMany(() => ProductEntity, (prod) => prod.subCategory, {
    eager: false,
  })
  items: ProductEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
