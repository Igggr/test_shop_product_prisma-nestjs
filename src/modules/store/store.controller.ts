import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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
}
