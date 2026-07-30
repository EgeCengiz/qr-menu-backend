import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { SubCategoryEntity } from '../entities/sub-category.entity';
import { ProductEntity } from '../entities/product.entity';

// ─── DTOs ──────────────────────────────────────────────────────────────────────

export class CreateCategoryDto {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  img: string;
  position: number;
  videoUrl?: string;
}

export class UpdateCategoryDto {
  num?: string;
  title?: string;
  subtitle?: string;
  img?: string;
  position?: number;
  videoUrl?: string;
}

export class ReorderDto {
  id: string;
  position: number;
}

export class CreateSubCategoryDto {
  id: string; // short slug (will be prefixed with categoryId)
  title: string;
  position?: number;
}

export class UpdateSubCategoryDto {
  title?: string;
  position?: number;
}

export class CreateProductDto {
  name: string;
  desc: string;
  price: string;
  img: string;
  tags?: string[];
  isAvailable?: boolean;
  position?: number;
  subCategoryId?: string; // full composite id
}

export class UpdateProductDto {
  name?: string;
  desc?: string;
  price?: string;
  img?: string;
  tags?: string[];
  isAvailable?: boolean;
  position?: number;
  subCategoryId?: string;
}

// ─── Helper: map entity to response ───────────────────────────────────────────

function mapProduct(p: ProductEntity) {
  return {
    id: p.id,
    name: p.name,
    desc: p.desc,
    price: p.price,
    img: p.img,
    tags: p.tags ? (JSON.parse(p.tags) as string[]) : [],
    isAvailable: p.isAvailable,
    position: p.position,
    categoryId: p.categoryId,
    subCategoryId: p.subCategoryId,
    // For frontend compatibility: return short subCategory id
    subCategory: p.subCategoryId ? p.subCategoryId.split('__')[1] ?? p.subCategoryId : undefined,
  };
}

function mapSubCategory(s: SubCategoryEntity, products: ProductEntity[] = []) {
  const shortId = s.id.includes('__') ? s.id.split('__')[1] : s.id;
  const count = products.filter((p) => {
    if (!p.subCategoryId) return false;
    return (
      p.subCategoryId === s.id ||
      p.subCategoryId === shortId ||
      (p.subCategoryId.includes('__') && p.subCategoryId.split('__')[1] === shortId)
    );
  }).length;

  return {
    id: s.id,
    shortId,
    title: s.title,
    position: s.position,
    categoryId: s.categoryId,
    itemCount: `${count} ÜRÜN`,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    @InjectRepository(SubCategoryEntity)
    private readonly subCategoryRepo: Repository<SubCategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  // ── Categories ──────────────────────────────────────────────────────────────

  async findAllCategories() {
    const cats = await this.categoryRepo.find({
      order: { position: 'ASC' },
    });

    const result: object[] = [];
    for (const cat of cats) {
      const subCats = await this.subCategoryRepo.find({
        where: { categoryId: cat.id },
        order: { position: 'ASC' },
      });
      const products = await this.productRepo.find({
        where: { categoryId: cat.id },
        order: { position: 'ASC' },
      });

      result.push({
        id: cat.id,
        num: cat.num,
        title: cat.title,
        subtitle: cat.subtitle,
        img: cat.img,
        position: cat.position,
        videoUrl: cat.videoUrl,
        itemCount: `${products.length} ÜRÜN`,
        subCategories: subCats.map((s) => mapSubCategory(s, products)),
        items: products.map(mapProduct),
      });
    }

    return result;
  }

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.categoryRepo.findOne({ where: { id: dto.id } });
    if (existing) {
      throw new Error(`Category with id "${dto.id}" already exists`);
    }
    const cat = this.categoryRepo.create({ ...dto, videoUrl: dto.videoUrl ?? null });
    return this.categoryRepo.save(cat);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category "${id}" not found`);
    Object.assign(cat, dto);
    return this.categoryRepo.save(cat);
  }

  async deleteCategory(id: string) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category "${id}" not found`);
    await this.categoryRepo.remove(cat);
    return { success: true };
  }

  async reorderCategories(items: ReorderDto[]) {
    for (const item of items) {
      await this.categoryRepo.update({ id: item.id }, { position: item.position });
    }
    return { success: true };
  }

  // ── Sub Categories ──────────────────────────────────────────────────────────

  async findSubCategories(categoryId: string) {
    await this.requireCategory(categoryId);
    const subs = await this.subCategoryRepo.find({
      where: { categoryId },
      order: { position: 'ASC' },
    });
    const products = await this.productRepo.find({ where: { categoryId } });
    return subs.map((s) => mapSubCategory(s, products));
  }

  async createSubCategory(categoryId: string, dto: CreateSubCategoryDto) {
    await this.requireCategory(categoryId);
    const compositeId = `${categoryId}__${dto.id}`;
    const sub = this.subCategoryRepo.create({
      id: compositeId,
      title: dto.title,
      position: dto.position ?? 0,
      categoryId,
    });
    const saved = await this.subCategoryRepo.save(sub);
    return mapSubCategory(saved, []);
  }

  async updateSubCategory(categoryId: string, subId: string, dto: UpdateSubCategoryDto) {
    await this.requireCategory(categoryId);
    const sub = await this.subCategoryRepo.findOne({ where: { id: subId, categoryId } });
    if (!sub) throw new NotFoundException(`SubCategory "${subId}" not found`);
    Object.assign(sub, dto);
    const saved = await this.subCategoryRepo.save(sub);
    const products = await this.productRepo.find({ where: { categoryId } });
    return mapSubCategory(saved, products);
  }

  async deleteSubCategory(categoryId: string, subId: string) {
    await this.requireCategory(categoryId);
    const sub = await this.subCategoryRepo.findOne({ where: { id: subId, categoryId } });
    if (!sub) throw new NotFoundException(`SubCategory "${subId}" not found`);
    // Null out products that belong to this sub
    await this.productRepo.update({ subCategoryId: subId }, { subCategoryId: null });
    await this.subCategoryRepo.remove(sub);
    return { success: true };
  }

  // ── Products ────────────────────────────────────────────────────────────────

  async findProducts(categoryId: string) {
    await this.requireCategory(categoryId);
    const products = await this.productRepo.find({
      where: { categoryId },
      order: { position: 'ASC' },
    });
    return products.map(mapProduct);
  }

  async createProduct(categoryId: string, dto: CreateProductDto) {
    await this.requireCategory(categoryId);

    // Auto-increment position
    const maxPos = await this.productRepo
      .createQueryBuilder('p')
      .select('MAX(p.position)', 'max')
      .where('p.categoryId = :categoryId', { categoryId })
      .getRawOne<{ max: number | null }>();

    const position = dto.position ?? (maxPos?.max != null ? maxPos.max + 1 : 0);

    const product = this.productRepo.create({
      name: dto.name,
      desc: dto.desc,
      price: dto.price,
      img: dto.img,
      tags: dto.tags ? JSON.stringify(dto.tags) : null,
      isAvailable: dto.isAvailable ?? true,
      position,
      categoryId,
      subCategoryId: dto.subCategoryId ?? null,
    });
    const saved = await this.productRepo.save(product);
    return mapProduct(saved);
  }

  async updateProduct(categoryId: string, productId: number, dto: UpdateProductDto) {
    await this.requireCategory(categoryId);
    const product = await this.productRepo.findOne({
      where: { id: productId, categoryId },
    });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    if (dto.tags !== undefined) {
      product.tags = JSON.stringify(dto.tags);
    }
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.desc !== undefined) product.desc = dto.desc;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.img !== undefined) product.img = dto.img;
    if (dto.isAvailable !== undefined) product.isAvailable = dto.isAvailable;
    if (dto.position !== undefined) product.position = dto.position;
    if (dto.subCategoryId !== undefined) product.subCategoryId = dto.subCategoryId ?? null;

    const saved = await this.productRepo.save(product);
    return mapProduct(saved);
  }

  async reorderProducts(items: { id: number; position: number }[]) {
    for (const item of items) {
      await this.productRepo.update({ id: item.id }, { position: item.position });
    }
    return { success: true };
  }

  async deleteProduct(categoryId: string, productId: number) {
    await this.requireCategory(categoryId);
    const product = await this.productRepo.findOne({
      where: { id: productId, categoryId },
    });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);
    await this.productRepo.remove(product);
    return { success: true };
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private async requireCategory(id: string) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category "${id}" not found`);
    return cat;
  }
}
