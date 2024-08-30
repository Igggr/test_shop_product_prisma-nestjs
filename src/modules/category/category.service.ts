import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';


@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async createCategory(
        data: Omit<Prisma.CategoryCreateInput, 'createdAt' | 'updatedAt' | 'products'>,
    ): Promise<Category | null> {
        return this.prisma.category.create({ data });
    }

    async deleteCategory(categoryId: number): Promise<void> {
        await this.prisma.category.delete({ where: { id: categoryId } });
    }
}
