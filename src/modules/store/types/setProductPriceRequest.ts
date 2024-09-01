import { Currency } from "src/common/enums"

export type SetProductPriceRequest = {
    productId: number,
    amount: number,
    currency: Currency,
}