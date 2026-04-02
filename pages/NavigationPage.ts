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

    async goToCreateAccount(): Promise<void> {
        await this.page.getByRole('link', { name: 'Login or register' }).click()
        await this.page.getByRole('button', { name: 'Continue' }).click()
    }

    async goToLogin(): Promise<void> {
        await this.page.getByRole('link', { name: 'Login or register' }).click()
    }

    async selectGuestCheckout(): Promise<void> {
        await this.page.getByLabel('Guest Checkout').click()
        await this.page.getByRole('button', { name: 'Continue' }).click()
    }
}