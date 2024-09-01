import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Prisma, Product } from '@prisma/client';
import { pick } from 'src/modules/common/utils';
import { CreateCategoryRequest } from './types';


@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async createCategory(
        data: CreateCategoryRequest,
    ): Promise<Category | null> {
        return this.prisma.category.create({ data });
    }

    async getCategory(categoryId: number): Promise<Category & { products: Product[] }> {
        return this.prisma.category.findUniqueOrThrow({ where: { id: categoryId }, include: { products: true } });
    }

    async updateCategory(categoryId: number, data: Pick<Prisma.CategoryUpdateInput, 'name'>) {
        return this.prisma.category.update({ where: { id: categoryId }, data: pick(['name'], data)})
    }

    async deleteCategory(categoryId: number): Promise<void> {
        await this.prisma.category.delete({ where: { id: categoryId } });
    }
}
