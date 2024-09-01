import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetProductRemainingQuantityRequest } from './types';

@Injectable()
export class WarehouseService {
    constructor(private prisma: PrismaService) { }

    async setProductRemainingQuantity({ productId, quantity }: SetProductRemainingQuantityRequest) {
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
