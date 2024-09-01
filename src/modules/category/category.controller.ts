import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Prisma } from '@prisma/client';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryRequest } from './types';
import { CategoryDTO, CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from './dto';
import { GetCategoryResponseDTO } from './dto/getCategoryResponse.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private _categoryService: CategoryService) { }
    
    @ApiResponse({ type: CategoryDTO })
    @ApiBody({ type: CreateCategoryRequestDTO })
    @ApiOperation({ summary: 'Создание новой категории' })
    @Post('create')
    createCategory(@Body() dto: CreateCategoryRequest) {
        return this._categoryService.createCategory(dto)
    }

    @ApiResponse({type: GetCategoryResponseDTO})
    @ApiParam({ name: 'id', example: 1, description: 'Id категории' })
    @ApiOperation({ summary: 'Получение информации о категории по id' })
    @Get('getCategory/:id')
    getCategory(@Param('id', ParseIntPipe) id: number,) {
        return this._categoryService.getCategory(id);
    }

    @ApiResponse({ type: CategoryDTO })
    @ApiBody({ type: UpdateCategoryRequestDTO })
    @ApiParam({name: 'id', example: 1, description: 'Id категории'})
    @ApiOperation({ summary: 'Обновление информации о категории' })
    @Put('updateCategory/:id')
    updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: Omit<Prisma.CategoryUpdateInput, "createdAt" | "updatedAt">,
    ) {
        return this._categoryService.updateCategory(id, dto)
    }

    @ApiParam({ name: 'id', example: 1, description: 'Id категории' })
    @ApiOperation({ summary: 'Удаление категории' })
    @Delete('delete/:id')
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this._categoryService.deleteCategory(id);
    }
}
