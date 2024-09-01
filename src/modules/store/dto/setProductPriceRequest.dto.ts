import { ApiProperty, PickType } from "@nestjs/swagger";
import { SetProductPriceRequest } from "../types";
import { SetProductRemainingQuantityRequestDTO } from "./setProductRemainingQunatityRequestRequest.dto";
import { Currency } from "src/common/enums";

export class SetProductPriceRequestDTO
    extends PickType(SetProductRemainingQuantityRequestDTO, ['productId'])
    implements SetProductPriceRequest {

    @ApiProperty({example: 1.3 })
    amount: number;

    @ApiProperty({example: Currency.USD})
    currency: Currency;
}