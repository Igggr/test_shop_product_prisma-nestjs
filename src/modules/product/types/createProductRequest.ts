import { Currency } from "src/common/enums";

export type CreateProductRequest = {
    name: string;
    description?: string;
    prices?: Array<{ currency: Currency, amount: number }>,
}