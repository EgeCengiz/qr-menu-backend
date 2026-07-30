import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { CategoryEntity } from '../entities/category.entity';
import { SubCategoryEntity } from '../entities/sub-category.entity';
import { ProductEntity } from '../entities/product.entity';
import { WelcomeMediaEntity } from '../entities/welcome-media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      SubCategoryEntity,
      ProductEntity,
      WelcomeMediaEntity,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
