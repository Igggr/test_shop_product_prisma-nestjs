import { ApiProperty } from "@nestjs/swagger";
import { ProductDTO } from "../../common/dto";

export class GetProductsResponseDTO {
    @ApiProperty({ type: Number, example: 134 })
    totalAmount: number;

    @ApiProperty({type: [ProductDTO]})
    data: ProductDTO[]
}