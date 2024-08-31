import { Body, Controller, Post } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
    constructor(private _storeService: StoreService) { }
    
    @Post('create')
    createStore(@Body() dto) {
        return this._storeService.createStore(dto);
    }
}
