import { ApiProperty } from "@nestjs/swagger";

export class StoreDTO {
    @ApiProperty({ example: 1})
    id: number;

    @ApiProperty({ example: 'store 1' })
    name: string;

    @ApiProperty({ example: 'Moscow' })
    location: string;

    @ApiProperty({ example: "2024-09-01T14:12:21.461Z" })
    createdAt: string;

    @ApiProperty({ example: "2024-09-01T14:12:21.461Z" })
    updatedAt: string;
}