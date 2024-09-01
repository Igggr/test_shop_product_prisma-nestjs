import { PageableDTO } from "src/modules/common/dto";
import { GetProductsRequest } from "../types/getProductsRequest";
import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class GetProductsRequestDTO extends PartialType(PageableDTO) implements GetProductsRequest {
    @ApiPropertyOptional({ description: 'Название категории', example: 'sport' })
    categoryName?: string;

    @ApiPropertyOptional({ description: 'Id магазина', example: 1 })
    storeId?: number;
}