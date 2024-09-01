import { ProductDTO } from "../../common/dto";
import { StoreDTO } from "./store.dto";
import { PriceDTO } from "../../product/dto/price.dto";
import { ApiProperty } from "@nestjs/swagger";

class ProductWithPriceDTO extends ProductDTO {
    @ApiProperty({type: [PriceDTO]})
    prices: Array<PriceDTO>
}

export class GetStoreResponseDTO extends StoreDTO {
    @ApiProperty({ type: [ProductWithPriceDTO]})
    products: ProductWithPriceDTO
}