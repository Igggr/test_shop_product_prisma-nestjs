import { ProductDTO } from "../../common/dto";
import { CategoryDTO } from "./category.dto";
import { ApiProperty } from "@nestjs/swagger";

export class GetCategoryResponseDTO extends CategoryDTO {
    @ApiProperty({ type: [ProductDTO] })
    products: ProductDTO[];
}