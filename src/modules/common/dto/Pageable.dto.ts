import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageableDto } from "../types/pageable";

export class PageableDTO implements PageableDto {
    @ApiPropertyOptional({example: 0})
    skip: number;

    @ApiPropertyOptional({example: 10})
    take: number;
}