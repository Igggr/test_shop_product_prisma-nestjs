import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';
import { Currency } from 'src/common/enums';

@Controller('product')
export class ProductController {
    constructor(private _productService: ProductService) {}

    @Post('create')
    async createProduct(
        @Body() data: Omit<Prisma.ProductCreateInput, 'createdAt' | 'updatedAt' | 'price' | 'categories'> & {
            prices?: Array<{ currency: Currency, amount: number }>,
        },
    ) {
        return this._productService.createProduct(data);
    }

    @Delete('delete/:id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number,
    ) {
        return this._productService.deleteProduct(id);
    }
}
