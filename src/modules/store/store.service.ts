import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { pick } from 'src/common/utils';

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
}
