import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "../../common/enums";

export class PriceDTO {
    @ApiProperty({ example: Currency.USD})
    currency: Currency;

    @ApiProperty({ type: Number, example: 1.2 })
    amount: number;
}