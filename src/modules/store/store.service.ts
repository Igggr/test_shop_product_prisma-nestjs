import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { pick } from 'src/common/utils';
import { Currency } from 'src/common/enums';

@Injectable()
export class StoreService {
    constructor(private prisma: PrismaService) { }
    
    async createStore(data: Pick<Prisma.StoreCreateInput, 'name' | 'location'>) {
        return this.prisma.store.create({ data: pick(['name', 'location'], data) });
    }

    async getStore(storeId: number) {

        return this.prisma.store.findUniqueOrThrow({
            where: { id: storeId },
            include: { storeStocks: { include: { product: { include: { prices: true } } } } }
        })
    }

    async setProductRemainingQuantity({ productId, storeId, quantity }: { productId: number, storeId: number, quantity: number }) {
        return this.prisma.storeStock.update({
            where: {
                productId_storeId: { storeId, productId },
            },
            data: { quantity: quantity }
        })
    }

    async setProductPrice({ productId, currency, amount }: { productId: number, currency: Currency, amount: number }) {
        await this.prisma.price.upsert({
            where: {
                productId_currency: {
                    productId,
                    currency,
                },
            },
            update: {
                amount: new Prisma.Decimal(amount),
            },
            create: {
                amount: new Prisma.Decimal(amount),
                currency,
                productId,
            },
        });
    }
}
