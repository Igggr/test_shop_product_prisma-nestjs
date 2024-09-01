import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProductRequest } from './types/createProductRequest';
import { CreateProductRequestDTO } from './dto/createProductRequest.dto';
import { UpdateProductRequestDTO } from './dto/updateProductRequest.dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
    constructor(private _productService: ProductService) {}

    @ApiBody({ type: CreateProductRequestDTO })
    @ApiOperation({ summary: 'Создание продукта' })
    @Post('create')
    async createProduct(
        @Body() data: CreateProductRequest,
    ) {
        return this._productService.createProduct(data);
    }

    @ApiParam({ name: 'id', example: 1, description: 'Id продукта' })
    @ApiOperation({ summary: 'Получение информации о продукте по id' })
    @Get('getProduct/:id')
    getProduct(@Param('id', ParseIntPipe) id: number) {
        return this._productService.getProduct(id);
    }

    @ApiBody({ type: UpdateProductRequestDTO })
    @ApiParam({ name: 'id', example: 1, description: 'Id продукта' })
    @ApiOperation({ summary: 'Обновление информации о продукте' })
    @Put('updateProduct/:id')
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto ,
    ) {
        return this._productService.updateProduct(id, dto)
    }

    @ApiParam({ name: 'id', example: 1, description: 'Id продукта' })
    @ApiOperation({ summary: 'Удаление продукта' })
    @Delete('delete/:id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number,
    ) {
        return this._productService.deleteProduct(id);
    }
}
