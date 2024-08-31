import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { omit } from 'src/common/utils';
import { Currency } from 'src/common/enums';
import { itxClientDenyList } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async createProduct(
        data: Omit<Prisma.ProductCreateInput, 'createdAt' | 'updatedAt' | 'price' | 'categories'> &
        {
            prices?: Array<{ currency: Currency, amount: number }>,
        },
    ): Promise<Product | null> {
        const product = await this.prisma.product.create({ data: omit(['storeStocks', 'warehouseStocks', 'prices'], data) });

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

    async deleteProduct(productId: number) {
        return this.prisma.product.delete({ where: { id: productId } });
    }
}
