import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { omit, pick } from 'src/common/utils';
import { Currency } from 'src/common/enums';
import { CreateProductRequest } from './types/createProductRequest';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async createProduct(
        data: CreateProductRequest,
    ): Promise<Product | null> {
        const product = await this.prisma.product.create({ data: pick(['name', 'description'], data) });

        if (data.prices) {
            await this.prisma.price.createMany({
                data: data.prices.map((price) => ({
                    ...price,
                    productId: product.id,
                })),
            });
        }
        return product
    }

    async getProduct(productId: number) {
        return this.prisma.product.findUniqueOrThrow({
            where: { id: productId },
            include: { categories: true, prices: true, storeStocks: true, warehouseStock: true }
        });
    }

    async updateProduct(productId: number, data: Pick<Prisma.ProductUpdateInput, 'name' | 'description'>) {
        return this.prisma.product.update({
            where: { id: productId },
            data: pick(['name', 'description'], data)
        });
    }

    async deleteProduct(productId: number) {
        return this.prisma.product.delete({ where: { id: productId } });
    }
}
