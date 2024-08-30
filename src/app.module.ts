import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { StoreModule } from './modules/store/store.module';
import { CategoryModule } from './modules/category/category.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CategoryModule,
    ConfigModule.forRoot(),
    ProductModule,
    StoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
