import { PartialType, PickType } from "@nestjs/swagger";
import { CreateProductRequestDTO } from "./createProductRequest.dto";

export class UpdateProductRequestDTO extends PartialType(PickType(CreateProductRequestDTO, ['name', 'description'])) {}