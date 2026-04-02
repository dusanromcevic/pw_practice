import { Page, Locator } from '@playwright/test'
import { HelperBase } from './HelperBase'

export class CartPage extends HelperBase {

    // --- Nav bar cart ---
    readonly cartNavToggle: Locator
    readonly cartNavTotal: Locator

    // --- Mini cart dropdown ---
    readonly miniCartDropdown: Locator
    readonly miniCartSubTotal: Locator

    // --- Cart page table ---
    readonly cartProductName: Locator
    readonly cartUnitPrice: Locator
    readonly cartQuantity: Locator
    readonly cartRowTotal: Locator

    // --- Cart page summary ---
    readonly summarySubTotal: Locator
    readonly summaryShipping: Locator
    readonly summaryTotal: Locator

    // --- Actions ---
    readonly checkoutButton: Locator

    constructor(page: Page) {
        super(page)

        // Nav bar cart toggle — scoped by the cart_total span inside it
        this.cartNavToggle = page.locator('a.dropdown-toggle:has(.cart_total)')
        this.cartNavTotal  = page.locator('.cart_total')

        // Mini cart dropdown and its totals rows
        this.miniCartDropdown = page.locator('.topcartopen')
        this.miniCartSubTotal = page.locator('.topcartopen .totals tr')
            .filter({ hasText: 'Sub-Total' })
            .locator('span.cart_block_total').last()

        // Cart page table — product row cells
        this.cartProductName = page.getByRole('link', { name: 'BeneFit Girl Meets Pearl' })
        this.cartUnitPrice   = page.locator('td.align_right').first()
        this.cartQuantity    = page.locator('td input[name*="quantity"]')
        this.cartRowTotal    = page.locator('td.align_right').last()

        // Cart page summary — scoped to #totals_table, value span only via :not(.extra)
        const totalsTable = page.locator('#totals_table')

        this.summarySubTotal = totalsTable.locator('tr:has(span:text("Sub-Total:")) span.bold:not(.extra)')
        this.summaryShipping = totalsTable.locator('tr:has(span:text("Flat Shipping Rate:")) span.bold:not(.extra)')
        this.summaryTotal = totalsTable.locator('span.bold.totalamout:not(.extra)')


        // Checkout button — there are two on the page (top and bottom), either works
        this.checkoutButton = page.locator('a.btn-orange[title="Checkout"]').first()

    }

    async openCartDropdown(): Promise<void> {
        await this.cartNavToggle.hover()
    }

    async goToCheckout(): Promise<void> {
        await this.checkoutButton.click()
    }
}