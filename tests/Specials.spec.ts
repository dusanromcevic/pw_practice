import { test, expect } from '@playwright/test'
import { NavigationPage } from '../pages/NavigationPage'
import { SpecialsPage } from '../pages/SpecialsPage'

test.describe('Specials Page', () => {

    test.beforeEach(async ({ page }) => {
        const nav = new NavigationPage(page)
        await nav.goToHome()
        await nav.goToSpecials()
    })

    test('Verify the products displayed have the Sale label', async ({ page }) => {
        const specialsPage = new SpecialsPage(page)

        await expect(specialsPage.productCards).toHaveCount(8)

        const allCards = await specialsPage.productCards.all()

        for (const card of allCards) {
            await expect(specialsPage.getSaleLabel(card)).toBeVisible()
        }
    })

    test('Sale price is lower than original price for all products', async ({ page }) => {
        const specialsPage = new SpecialsPage(page)

        await expect(specialsPage.productCards).toHaveCount(8)

        const allCards = await specialsPage.productCards.all()

        for (const card of allCards) {
            const newPrice = await specialsPage.parsePrice(specialsPage.getNewPrice(card))
            const oldPrice = await specialsPage.parsePrice(specialsPage.getOldPrice(card))

            expect(newPrice).toBeLessThan(oldPrice)
        }
    })
})