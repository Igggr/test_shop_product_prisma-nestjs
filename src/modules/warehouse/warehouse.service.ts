import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WarehouseService {
    constructor(private prisma: PrismaService) { }

    async setProductRemainingQuantity({ productId, quantity }: { productId: number, quantity: number }) {
        await this.prisma.warehouseStock.upsert({
            where: {
                productId
            },
            update: {
                quantity,
            },
            create: {
                quantity,
                productId,
            },
        });
        
    }
}
