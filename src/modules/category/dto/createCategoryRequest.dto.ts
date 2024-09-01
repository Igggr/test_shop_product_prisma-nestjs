import { ApiProperty } from "@nestjs/swagger";
import { CreateCategoryRequest } from "../types";

export class CreateCategoryRequestDTO implements CreateCategoryRequest {
    @ApiProperty({ example: 'food' })
    name: string;
}