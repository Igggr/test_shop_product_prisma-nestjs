import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async createProduct(
        data: Omit<Prisma.ProductCreateInput, 'createdAt' | 'updatedAt'>,
    ): Promise<Product | null> {
        return this.prisma.product.create({ data });
    }


}
