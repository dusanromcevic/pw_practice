import { Page, Locator } from '@playwright/test'
import { HelperBase } from './HelperBase'

export class CheckoutConfirmationPage extends HelperBase {

    // --- Items in cart table ---
    // All scoped within table.confirm_products to avoid any ambiguity
    readonly cartProductName: Locator
    readonly cartUnitPrice: Locator
    readonly cartQuantity: Locator
    readonly cartRowTotal: Locator

    // --- Price breakdown ---
    // Scoped within div.cart-info to avoid collision with any other tables on page
    readonly summarySubTotal: Locator
    readonly summaryShipping: Locator
    readonly summaryTotal: Locator

    // --- Action ---
    readonly confirmOrderButton: Locator

    constructor(page: Page) {
        super(page)

        // Scope the whole cart table once — all product cells hang off this
        const confirmProductsTable = page.locator('table.confirm_products')

        this.cartProductName = confirmProductsTable.locator('a.checkout_heading')
        this.cartUnitPrice   = confirmProductsTable.locator('tr td:nth-child(3)')
        this.cartQuantity    = confirmProductsTable.locator('tr td:nth-child(4)')
        this.cartRowTotal    = confirmProductsTable.locator('tr td.checkout_heading')

        // Price breakdown scoped within div.cart-info, value span only via :not(.extra)
        const cartInfo = page.locator('div.cart-info')

        this.summarySubTotal = cartInfo.locator('tr:has(span:text("Sub-Total:")) span.bold:not(.extra)')
        this.summaryShipping = cartInfo.locator('tr:has(span:text("Flat Shipping Rate:")) span.bold:not(.extra)')
        this.summaryTotal = cartInfo.locator('span.bold.totalamout:not(.extra)')

        // Confirm Order — button with title attribute
        this.confirmOrderButton = page.getByTitle('Confirm Order')
    }

    async confirmOrder(): Promise<void> {
        await this.confirmOrderButton.click()
    }
}