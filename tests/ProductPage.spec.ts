import { test, expect } from '@playwright/test'
import { NavigationPage } from '../pages/NavigationPage'
import { ProductPage } from '../pages/ProductPage'

test.describe('Product Page', () => {

    test.beforeEach(async ({ page }) => {
        const nav = new NavigationPage(page)
        await nav.goToHome()
        await nav.goToFeaturedProduct('Skinsheen Bronzer Stick')
    })

    test('Verify product name and price', async ({ page }) => {
        const productPage = new ProductPage(page)

        await expect(productPage.productName).toContainText('Skinsheen Bronzer Stick')
        await expect(productPage.productPrice).toContainText('$29.50')
    })

    test('Verify price change when increasing quantity', async ({ page }) => {
        const productPage = new ProductPage(page)

        await productPage.setQuantity(2)

        await expect(productPage.totalPrice).toContainText('$59.00')
    })
})