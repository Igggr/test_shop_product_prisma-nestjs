import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { omit, pick } from 'src/modules/common/utils';
import { Currency } from 'src/modules/common/enums';
import { CreateProductRequest } from './types/createProductRequest';
import { GetProductsRequest } from './types/getProductsRequest';

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

    async getProducts(data: GetProductsRequest) {
        const where = {
            ...(data.categoryName ?
                {
                    categories: {
                        some: { name: data.categoryName }
                    }
                }
                : {}
            ),
            ...(data.storeId ? {
                storeStocks: {
                    some: { storeId: data.storeId }
                }

            } : {})

        }
        const count = await this.prisma.product.count({where});
        const products = await this.prisma.product.findMany({
            where,
        });
        return { totalAmount: count, data: products };
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
