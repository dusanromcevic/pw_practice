import { Page, Locator } from '@playwright/test'

export class ProductPage {

    readonly page: Page
    readonly productName: Locator
    readonly productPrice: Locator
    readonly quantityInput: Locator
    readonly totalPrice: Locator

    constructor(page: Page) {
        this.page = page
        this.productName  = page.locator('#product_details')
        this.productPrice = page.locator('.productpageprice')
        this.quantityInput = page.locator('#product_quantity')
        this.totalPrice   = page.locator('.total-price')
    }

    async setQuantity(quantity: number): Promise<void> {
        await this.quantityInput.fill(quantity.toString())
    }
}