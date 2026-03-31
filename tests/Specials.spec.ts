import { test, expect } from '@playwright/test'
import { PageManager } from '../pages/PageManager'

test.describe('Specials Page', () => {

    let pm: PageManager

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page)
        await pm.navigateTo().goToHome()
        await pm.navigateTo().goToSpecials()
    })

    test('Verify the products displayed have the Sale label', async () => {
        await expect(pm.onSpecials().productCards).toHaveCount(8)

        const allCards = await pm.onSpecials().productCards.all()

        for (const card of allCards) {
            await expect(pm.onSpecials().getSaleLabel(card)).toBeVisible()
        }
    })

    test('Sale price is lower than original price for all products', async () => {
        await expect(pm.onSpecials().productCards).toHaveCount(8)

        const allCards = await pm.onSpecials().productCards.all()

        for (const card of allCards) {
            const newPrice = await pm.onSpecials().parsePrice(pm.onSpecials().getNewPrice(card))
            const oldPrice = await pm.onSpecials().parsePrice(pm.onSpecials().getOldPrice(card))

            expect(newPrice).toBeLessThan(oldPrice)
        }
    })
})