import { PageableDto } from "src/modules/common/types";

export type GetProductsRequest = {
    storeId?: number,
    categoryName?: string,
} & Partial<PageableDto>;