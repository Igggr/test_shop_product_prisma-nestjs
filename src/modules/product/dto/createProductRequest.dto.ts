import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateProductRequest } from "../types/createProductRequest";
import { PriceDTO } from "./price.dto";

export class CreateProductRequestDTO implements CreateProductRequest {
    @ApiProperty({ example: 'banana'})
    name: string;

    @ApiPropertyOptional({example: 'yellow fruit'})
    description?: string;

    @ApiPropertyOptional({type: [PriceDTO]})
    prices?: PriceDTO[];
}