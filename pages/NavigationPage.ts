import { Page } from '@playwright/test'

export class NavigationPage {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async goToHome(): Promise<void> {
        await this.page.goto('/')
    }

    async goToSpecials(): Promise<void> {
        await this.page.getByRole('link', { name: 'Specials' }).click()
    }

    async goToFeaturedProduct(productName: string): Promise<void> {
        await this.page.locator('#block_frame_featured_1769')
            .getByRole('link', { name: productName })
            .click()
    }
}