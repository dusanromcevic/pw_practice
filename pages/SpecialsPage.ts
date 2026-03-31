import { Page, Locator } from '@playwright/test'
import { HelperBase } from './HelperBase'

export class SpecialsPage extends HelperBase {

    readonly productCards: Locator

    constructor(page: Page) {
        super(page)
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

    // parsePrice removed — inherited from HelperBase
    // any other page object that needs price parsing can also use it directly
}