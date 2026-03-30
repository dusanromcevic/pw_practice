import { Page, Locator } from '@playwright/test'

export class HomePage {

    readonly page: Page

    // --- Locators ---
    readonly currencyPicker: Locator
    readonly currencyOptions: Locator
    readonly promoBanner: Locator

    constructor(page: Page) {
        this.page = page
        this.currencyPicker  = page.locator('a.dropdown-toggle').first()
        this.currencyOptions = page.locator('.dropdown-menu.currency').getByRole('listitem')
        this.promoBanner     = page.locator('.promo_section')
    }

    // --- Private helper ---

    // Scopes to direct child li of the top-level nav ul only
    // This prevents the nested 'Men' sub-item inside Fragrance from ever
    // being considered as a candidate for the top-level 'Men' container
    private getNavItemContainer(categoryName: string): Locator {
        return this.page.locator('#categorymenu ul').first().locator('> li').filter({
            has: this.page.locator(`> a:has-text("${categoryName}")`)
        })
    }

    // --- Nav menu methods ---
    getNavItem(categoryName: string): Locator {
        return this.getNavItemContainer(categoryName)
            .getByRole('link', { name: categoryName, exact: true })
    }

    async hoverNavItem(categoryName: string): Promise<void> {
        await this.getNavItem(categoryName).hover()
    }

    getSubItems(categoryName: string): Locator {
        return this.getNavItemContainer(categoryName)
            .locator('ul')
            .getByRole('link')
    }

    getSubItem(categoryName: string, subItemName: string): Locator {
        return this.getNavItemContainer(categoryName)
            .locator('ul')
            .getByRole('link', { name: subItemName, exact: true })
    }

    // --- Currency methods ---
    async openCurrencyPicker(): Promise<void> {
        await this.currencyPicker.hover()
    }

    async selectCurrency(currency: 'Euro' | 'Pound Sterling' | 'US Dollar'): Promise<void> {
        await this.openCurrencyPicker()
        await this.currencyOptions.filter({ hasText: currency }).click()
    }
}