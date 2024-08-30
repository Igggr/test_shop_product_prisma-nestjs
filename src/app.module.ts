import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { StoreModule } from './modules/store/store.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [ProductModule, StoreModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
