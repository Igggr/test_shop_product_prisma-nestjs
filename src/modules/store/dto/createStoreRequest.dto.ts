import { ApiProperty } from "@nestjs/swagger";
import { CreateStoreRequest } from "../types";

export class CreateStoreRequestDTO implements CreateStoreRequest {
    @ApiProperty({example: 'store 1'})
    name: string;

    @ApiProperty({ example: 'Moscow'})
    location: string;
}