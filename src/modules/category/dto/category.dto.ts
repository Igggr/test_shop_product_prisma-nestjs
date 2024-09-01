import { ApiProperty } from "@nestjs/swagger"
import { Category } from '../types'

export class CategoryDTO implements Category {
    @ApiProperty({ example: 1 })
    id: 1;

    @ApiProperty({example: 'food'})
    name: string;
    
    @ApiProperty({ example: "2024-09-01T14:12:21.461Z" })
    createdAt: string;

    @ApiProperty({ example: "2024-09-01T14:12:21.461Z" })
    updatedAt: string;
}