import { test, expect } from '@playwright/test'
import { PageManager } from '../pages/PageManager'
import { time } from 'node:console'

test.describe('Product Page', () => {

    let pm: PageManager

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page)
        await pm.navigateTo().goToHome()
        await pm.navigateTo().goToFeaturedProduct('Skinsheen Bronzer Stick')
    })

    test('Verify product name and price', async () => {
        await expect(pm.onProduct().productName).toContainText('Skinsheen Bronzer Stick')
        await expect(pm.onProduct().productPrice).toContainText('$29.50')
    })

    test('Verify price change when increasing quantity', async () => {
        await pm.onProduct().setQuantity(2)

        await expect(pm.onProduct().totalPrice).toContainText('$59.00', { timeout: 5000 })
    })
})