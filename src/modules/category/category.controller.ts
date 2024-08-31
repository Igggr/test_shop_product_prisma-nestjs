import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Prisma } from '@prisma/client';

@Controller('category')
export class CategoryController {
    constructor(private _categoryService: CategoryService) { }
    
    @Post('create')
    createCategory(@Body() dto: Omit<Prisma.CategoryCreateInput, 'createdAt' | 'updatedAt'>) {
        return this._categoryService.createCategory(dto)
    }

    @Get('getCategory/:id')
    getCategory(@Param('id', ParseIntPipe) id: number,) {
        return this._categoryService.getCategory(id);
    }

    @Put('updateCategory/:id')
    updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: Omit<Prisma.CategoryUpdateInput, "createdAt" | "updatedAt">,
    ) {
        return this._categoryService.updateCategory(id, dto)
    }

    @Delete('delete/:id')
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this._categoryService.deleteCategory(id);
    }
}
