import { ApiProperty } from "@nestjs/swagger";
import { CategoryDTO } from "../../category/dto";
import { ProductDTO, StoreStockDTO, WarehouseStockDTO } from "../../common/dto";
import { PriceDTO } from "./price.dto";

export class GetProductResponseDTO extends ProductDTO {
    @ApiProperty({type: [CategoryDTO]})
    categories: CategoryDTO;

    @ApiProperty({ type: [PriceDTO] })
    prices: PriceDTO;

    @ApiProperty({type: WarehouseStockDTO})
    warehouseStock: WarehouseStockDTO;

    @ApiProperty({ type: [StoreStockDTO] })
    storeStocks: StoreStockDTO[]
}