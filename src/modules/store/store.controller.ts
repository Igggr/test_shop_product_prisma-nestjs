import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { StoreService } from './store.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStoreRequestDTO, GetStoreResponseDTO, StoreDTO } from './dto';
import { SetProductPriceRequest, SetProductRemainingQuantityRequest } from './types';
import { SetProductRemainingQuantityRequestDTO } from './dto/setProductRemainingQunatityRequestRequest.dto';
import { SetProductPriceRequestDTO } from './dto/setProductPriceRequest.dto';

@ApiTags('store')
@Controller('store')
export class StoreController {
    constructor(private _storeService: StoreService) { }
    
    @ApiResponse({type: StoreDTO })
    @ApiBody({ type: CreateStoreRequestDTO })
    @ApiOperation({ summary: 'Создание магазина' })
    @Post('create')
    createStore(@Body() dto) {
        return this._storeService.createStore(dto);
    }

    @ApiResponse({ type: GetStoreResponseDTO })
    @ApiParam({ name: 'id', example: 1, description: 'Id магазина' })
    @ApiOperation({ summary: 'Получение информации о магазине по id' })
    @Get('getStore/:id')
    getStore(@Param('id', ParseIntPipe) id: number) {
        return this._storeService.getStore(id);
    }

    @ApiBody({ type: SetProductRemainingQuantityRequestDTO })
    @ApiOperation({ summary: 'Установить количество остатков товара в магазине' })
    @Put('setProductRemainingQuantity')
    setProductRemainingQuantity(@Body() { productId, storeId, quantity }: SetProductRemainingQuantityRequest) {
        return this._storeService.setProductRemainingQuantity({ productId, storeId, quantity });
    }

    @ApiBody({ type: SetProductPriceRequestDTO })
    @ApiOperation({ summary: 'Установить цену товара в магазине' })
    @HttpCode(HttpStatus.OK)
    @Post('setProductPrice')
    setProductPrice(@Body() dto: SetProductPriceRequest) {
        return this._storeService.setProductPrice(dto);
    }
}
