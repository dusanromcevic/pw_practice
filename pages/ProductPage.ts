import { Page, Locator } from '@playwright/test'
import { HelperBase } from './HelperBase'

export class ProductPage extends HelperBase {

    readonly productName: Locator
    readonly productPrice: Locator
    readonly quantityInput: Locator
    readonly totalPrice: Locator
    readonly addToCartButton: Locator

    constructor(page: Page) {
        super(page)
        this.productName    = page.locator('#product_details')
        this.productPrice   = page.locator('.productpageprice')
        this.quantityInput  = page.locator('#product_quantity')
        this.totalPrice     = page.locator('.total-price')
        this.addToCartButton = page.getByRole('link', { name: 'Add to Cart' })
    }

    async setQuantity(quantity: number): Promise<void> {
        await this.quantityInput.fill(quantity.toString())
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click()
    }
}