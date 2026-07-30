import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService, CreateCategoryDto, UpdateCategoryDto, ReorderDto, CreateSubCategoryDto, UpdateSubCategoryDto, CreateProductDto, UpdateProductDto } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ── Categories (public read, JWT write) ─────────────────────────────────────

  @Get()
  findAll() {
    return this.categoriesService.findAllCategories();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  reorder(@Body() items: ReorderDto[]) {
    return this.categoriesService.reorderCategories(items);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }

  // ── Sub Categories ──────────────────────────────────────────────────────────

  @Get(':categoryId/subcategories')
  findSubCategories(@Param('categoryId') categoryId: string) {
    return this.categoriesService.findSubCategories(categoryId);
  }

  @Post(':categoryId/subcategories')
  @UseGuards(JwtAuthGuard)
  createSubCategory(
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateSubCategoryDto,
  ) {
    return this.categoriesService.createSubCategory(categoryId, dto);
  }

  @Put(':categoryId/subcategories/:subId')
  @UseGuards(JwtAuthGuard)
  updateSubCategory(
    @Param('categoryId') categoryId: string,
    @Param('subId') subId: string,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.categoriesService.updateSubCategory(categoryId, subId, dto);
  }

  @Delete(':categoryId/subcategories/:subId')
  @UseGuards(JwtAuthGuard)
  deleteSubCategory(
    @Param('categoryId') categoryId: string,
    @Param('subId') subId: string,
  ) {
    return this.categoriesService.deleteSubCategory(categoryId, subId);
  }

  // ── Products ────────────────────────────────────────────────────────────────

  @Get(':categoryId/products')
  findProducts(@Param('categoryId') categoryId: string) {
    return this.categoriesService.findProducts(categoryId);
  }

  @Post(':categoryId/products')
  @UseGuards(JwtAuthGuard)
  createProduct(
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.categoriesService.createProduct(categoryId, dto);
  }

  @Put(':categoryId/products/:productId')
  @UseGuards(JwtAuthGuard)
  updateProduct(
    @Param('categoryId') categoryId: string,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.categoriesService.updateProduct(categoryId, productId, dto);
  }

  @Delete(':categoryId/products/:productId')
  @UseGuards(JwtAuthGuard)
  deleteProduct(
    @Param('categoryId') categoryId: string,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.categoriesService.deleteProduct(categoryId, productId);
  }
}
