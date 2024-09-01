import { Currency } from "src/modules/common/enums";

export type CreateProductRequest = {
    name: string;
    description?: string;
    prices?: Array<{ currency: Currency, amount: number }>,
}