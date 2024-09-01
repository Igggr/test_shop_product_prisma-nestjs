import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetProductRemainingQuantityRequestDTO } from './dto/setProductRemainigQuantityRequest.dto';
import { SetProductRemainingQuantityRequest } from './types';

@ApiTags('warehouse')
@Controller('warehouse')
export class WarehouseController {
    constructor(private _warehouseService: WarehouseService) { }
    
    @ApiBody({ type: SetProductRemainingQuantityRequestDTO })
    @ApiOperation({ summary: 'Установить количество остатков товара на складе' })
    @HttpCode(HttpStatus.OK)
    @Post('setProductRemainingQuantity')
    setProductRemainingQuantity(@Body() dto: SetProductRemainingQuantityRequest) {
        return this._warehouseService.setProductRemainingQuantity(dto)
    }
}
