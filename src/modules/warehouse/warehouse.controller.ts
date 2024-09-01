import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
    constructor(private _warehouseService: WarehouseService) { }
    
    @HttpCode(HttpStatus.OK)
    @Post('setProductRemainingQuantity')
    setProductRemainingQuantity(@Body() dto: { productId: number, quantity: number}) {
        return this._warehouseService.setProductRemainingQuantity(dto)

    }

}
