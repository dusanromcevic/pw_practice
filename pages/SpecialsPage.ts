import { Page, Locator } from '@playwright/test'

export class SpecialsPage {

    readonly page: Page
    readonly productCards: Locator

    constructor(page: Page) {
        this.page = page
        this.productCards = page.locator('.col-md-3.col-sm-6.col-xs-12')
    }

    getSaleLabel(card: Locator): Locator {
        return card.locator('span.sale')
    }

    getNewPrice(card: Locator): Locator {
        return card.locator('.pricenew')
    }

    getOldPrice(card: Locator): Locator {
        return card.locator('.priceold')
    }

    // Price parsing logic lives here — spec never needs to know about $ or string conversion
    async parsePrice(locator: Locator): Promise<number> {
        const text = await locator.textContent()
        return Number(text?.replace('$', ''))
    }
}