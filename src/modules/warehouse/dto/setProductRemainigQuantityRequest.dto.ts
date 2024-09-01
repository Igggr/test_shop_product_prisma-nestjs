import { ApiProperty } from "@nestjs/swagger";
import { SetProductRemainingQuantityRequest } from "../types";

export class SetProductRemainingQuantityRequestDTO implements SetProductRemainingQuantityRequest {
    @ApiProperty({ example: 1, description: 'Id продукта' })
    productId: number;

    @ApiProperty({ example: 1, description: 'Количество остатков в магазине' })
    quantity: number;
}