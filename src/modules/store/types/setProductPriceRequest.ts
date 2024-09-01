import { Currency } from "src/modules/common/enums"

export type SetProductPriceRequest = {
    productId: number,
    amount: number,
    currency: Currency,
}