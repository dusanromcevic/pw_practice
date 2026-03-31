import { test, expect } from '@playwright/test'
import { PageManager } from '../pages/PageManager'

const expectedMenu = [
    {
        category: 'Apparel & accessories',
        subItems: ['Shoes', 'T-shirts']
    },
    {
        category: 'Makeup',
        subItems: ['Cheeks', 'Eyes', 'Face', 'Lips', 'Nails', 'Value Sets']
    },
    {
        category: 'Skincare',
        subItems: ['Eyes', 'Face', 'Gift Ideas & Sets', 'Hands & Nails', 'Sun']
    },
    {
        category: 'Fragrance',
        subItems: ['Men', 'Women']
    },
    {
        category: 'Men',
        subItems: ['Body & Shower', 'Fragrance Sets', 'Pre-Shave & Shaving', 'Skincare']
    },
    {
        category: 'Hair Care',
        subItems: ['Conditioner', 'Shampoo']
    },
    {
        category: 'Books',
        subItems: ['Audio CD', 'Paperback']
    },
]

test.describe('Homepage', () => {

    let pm: PageManager

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page)
        await pm.navigateTo().goToHome()
    })

    test.describe('Currency', () => {

        test('Verify currency list items', async ({ page }) => {
            await pm.onHomePage().openCurrencyPicker()
            await expect(pm.onHomePage().currencyOptions).toContainText(['Euro', 'Pound Sterling', 'US Dollar'])

            const currencies: { [key: string]: RegExp } = {
                'Euro': /currency=EUR/,
                'Pound Sterling': /currency=GBP/,
                'US Dollar': /currency=USD/
            }

            for (const currency in currencies) {
                await pm.onHomePage().selectCurrency(currency as 'Euro' | 'Pound Sterling' | 'US Dollar')
                await expect(page).toHaveURL(currencies[currency])
            }
        })
    })

    test.describe('Promo Section', () => {

        test('Verify promo section headings', async () => {
            const promoHeadings = ['Fast shipping', 'Easy Payments', 'Shipping Options', 'Large Variety']

            for (const heading of promoHeadings) {
                await expect(pm.onHomePage().promoBanner.getByRole('heading', { name: heading }))
                    .toContainText(heading)
            }
        })
    })

    test.describe('Navigation Visibility', () => {

        test('top-level nav items have correct text', async () => {
            for (const menuEntry of expectedMenu) {
                const navItemLocator = pm.onHomePage().getNavItem(menuEntry.category)
                const actualCategoryText = await navItemLocator.textContent()
                await expect(navItemLocator).toHaveText(actualCategoryText!)
            }
        })

        test('subcategory items are visible and have correct text on hover', async () => {
            for (const menuEntry of expectedMenu) {
                await pm.onHomePage().hoverNavItem(menuEntry.category)

                for (const subItem of menuEntry.subItems) {
                    const subItemLocator = pm.onHomePage().getSubItem(menuEntry.category, subItem)
                    const actualSubItemText = await subItemLocator.textContent()

                    await expect(subItemLocator).toBeVisible()
                    await expect(subItemLocator).toHaveText(actualSubItemText!)
                }
            }
        })
    })
})