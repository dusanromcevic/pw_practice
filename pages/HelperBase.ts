import { Page, Locator } from '@playwright/test'

export class HelperBase {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    // Shared across any page object that needs to parse a price string
    async parsePrice(locator: Locator): Promise<number> {
        const text = await locator.textContent()
        return Number(text?.replace('$', ''))
    }
}