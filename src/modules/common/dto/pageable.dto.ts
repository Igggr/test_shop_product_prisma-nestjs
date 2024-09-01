import { ApiProperty } from "@nestjs/swagger";
import { PageableDto } from "../types/pageable";

export class PageableDTO implements PageableDto {
    @ApiProperty({example: 0})
    skip: number;

    @ApiProperty({example: 10})
    take: number;
}