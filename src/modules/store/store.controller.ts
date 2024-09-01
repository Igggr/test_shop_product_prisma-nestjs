import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
    constructor(private _storeService: StoreService) { }
    
    @Post('create')
    createStore(@Body() dto) {
        return this._storeService.createStore(dto);
    }

    @Get('getStore/:id')
    getStore(@Param('id', ParseIntPipe) id: number) {
        return this._storeService.getStore(id);
    }

    @Put('setProductRemainingQuantity')
    setProductRemainingQuantity(@Body() { productId, storeId, quantity }: { productId: number, storeId: number, quantity: number }) {
        return this._storeService.setProductRemainingQuantity({ productId, storeId, quantity });
    }
}
