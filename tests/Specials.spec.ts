import{test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.getByRole('link', { name: '  Specials' }).click();   
})


test('Verify the products displayed have the Specials label', async ({page}) => {

// Product cards — scoped by the column wrapper that contains each product
const productCards = page.locator('.col-md-3.col-sm-6.col-xs-12')

await expect(productCards).toHaveCount(8)

const allCards = await productCards.all()

for (const card of allCards) {
    // .sale has no text content — CSS-only rendered, so user-facing locator isn't possible here
    const saleLabel = card.locator('span.sale')
    await expect(saleLabel).toBeVisible()
}

})


test('Sale price is lower than original price for all products', async ({ page }) => {

    const productCards = page.locator('.col-md-3.col-sm-6.col-xs-12')
    await expect(productCards).toHaveCount(8)

    const allCards = await productCards.all()

    for (const card of allCards) {
        const newPriceText = await card.locator('.pricenew').textContent()
        const oldPriceText = await card.locator('.priceold').textContent()

        const newPrice = Number(newPriceText?.replace('$', ''))
        const oldPrice = Number(oldPriceText?.replace('$', ''))

        expect(newPrice).toBeLessThan(oldPrice)
    }
})
