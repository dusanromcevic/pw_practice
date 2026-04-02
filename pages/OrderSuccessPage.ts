import { Page, Locator } from '@playwright/test'

export class OrderSuccessPage {

    readonly page: Page
    readonly successHeading: Locator

    constructor(page: Page) {
        this.page = page
        this.successHeading = page.getByRole('heading', { name: 'YOUR ORDER HAS BEEN PROCESSED!' })
    }
}