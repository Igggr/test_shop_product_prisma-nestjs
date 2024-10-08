import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductRequest } from './types/createProductRequest';
import { CreateProductRequestDTO } from './dto/createProductRequest.dto';
import { UpdateProductRequestDTO } from './dto/updateProductRequest.dto';
import { GetProductsRequest } from './types/getProductsRequest';
import { GetProductsRequestDTO, GetProductsResponseDTO } from './dto';
import { ProductDTO } from '../common/dto';
import { GetProductResponseDTO } from './dto/getProductResponse.dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
    constructor(private _productService: ProductService) {}

    @ApiBody({ type: CreateProductRequestDTO })
    @ApiOperation({ summary: 'Создание продукта' })
    @ApiResponse({ type: ProductDTO })
    @Post('create')
    async createProduct(
        @Body() data: CreateProductRequest,
    ) {
        return this._productService.createProduct(data);
    }

    @ApiResponse({type: GetProductResponseDTO })
    @ApiParam({ name: 'id', example: 1, description: 'Id продукта' })
    @ApiOperation({ summary: 'Получение информации о продукте по id' })
    @Get('getProduct/:id')
    getProduct(@Param('id', ParseIntPipe) id: number) {
        return this._productService.getProduct(id);
    }

    @HttpCode(HttpStatus.OK)
    @ApiResponse({type: GetProductsResponseDTO})
    @ApiBody({type: GetProductsRequestDTO})
    @ApiOperation({ summary: 'Запрос списка продуктов' })
    @Post('getProducts')
    getProducts(@Body() dto: GetProductsRequest) {
        return this._productService.getProducts(dto);
    }

    @ApiResponse({ type: ProductDTO })
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
