import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';

@Controller('product')
export class ProductController {
    constructor(private _productService: ProductService) {}

    @Post('create')
    async createProduct(
        @Body() data: Omit<Prisma.ProductCreateInput, 'createdAt' | 'updatedAt'>,
    ) {
        return this._productService.createProduct(data);
    }
}
