import { ApiProperty } from "@nestjs/swagger";

export class ProductDTO {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'banana' })
    name: string;

    @ApiProperty({ example: "yellow fruit",  })
    description: string;

    @ApiProperty({ example: "2024-09-01T14:20:37.639Z" })
    createdAt: string;

    @ApiProperty({ example: "2024-09-01T14:20:37.639Z" })
    updatedAt: string;
}