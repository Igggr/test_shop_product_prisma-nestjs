import { ApiProperty } from "@nestjs/swagger";

export class StoreStockDTO {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    storeId: number;

    @ApiProperty({example: 19})
    quantity: number;

    @ApiProperty({ example: "2024-09-01T14:20:37.639Z" })
    createdAt: string;

    @ApiProperty({ example: "2024-09-01T14:20:37.639Z" })
    updatedAt: string;        
}