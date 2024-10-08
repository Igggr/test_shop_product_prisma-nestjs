import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { StoreModule } from './modules/store/store.module';
import { CategoryModule } from './modules/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';

@Module({
  imports: [
    CategoryModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
    }),
    ProductModule,
    StoreModule,
    PrismaModule,
    WarehouseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
