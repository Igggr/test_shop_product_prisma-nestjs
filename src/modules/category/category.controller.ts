import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Prisma } from '@prisma/client';

@Controller('category')
export class CategoryController {
    constructor(private _categoryService: CategoryService) { }
    
    @Post('/create')
    createCategory(@Body() dto: Omit<Prisma.CategoryCreateInput, 'createdAt' | 'updatedAt' | 'products'>) {
        return this._categoryService.createCategory(dto)
    }

    @Delete('/delete/:id')
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this._categoryService.deleteCategory(id);
    }
}
