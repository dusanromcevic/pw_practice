import { test, expect } from '@playwright/test'
import { NavigationPage } from '../pages/NavigationPage'
import { HomePage } from '../pages/HomePage'

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

    let homePage: HomePage

    test.beforeEach(async ({ page }) => {
        const nav = new NavigationPage(page)
        await nav.goToHome()
        homePage = new HomePage(page)
    })

    test.describe('Currency', () => {

        test('Verify currency list items', async ({ page }) => {
            await homePage.openCurrencyPicker()
            await expect(homePage.currencyOptions).toContainText(['Euro', 'Pound Sterling', 'US Dollar'])

            const currencies: { [key: string]: RegExp } = {
                'Euro': /currency=EUR/,
                'Pound Sterling': /currency=GBP/,
                'US Dollar': /currency=USD/
            }

            for (const currency in currencies) {
                await homePage.selectCurrency(currency as 'Euro' | 'Pound Sterling' | 'US Dollar')
                await expect(page).toHaveURL(currencies[currency])
            }
        })
    })

    test.describe('Promo Section', () => {

        test('Verify promo section headings', async () => {
            const promoHeadings = ['Fast shipping', 'Easy Payments', 'Shipping Options', 'Large Variety']

            for (const heading of promoHeadings) {
                await expect(homePage.promoBanner.getByRole('heading', { name: heading }))
                    .toContainText(heading)
            }
        })
    })

    test.describe('Navigation Visibility', () => {

        test('top-level nav items have correct text', async () => {
            for (const menuEntry of expectedMenu) {
                const navItemLocator = homePage.getNavItem(menuEntry.category)
                const actualCategoryText = await navItemLocator.textContent()
                await expect(navItemLocator).toHaveText(actualCategoryText!)
            }
        })

        test('subcategory items are visible and have correct text on hover', async () => {
            for (const menuEntry of expectedMenu) {
                await homePage.hoverNavItem(menuEntry.category)

                for (const subItem of menuEntry.subItems) {
                    const subItemLocator = homePage.getSubItem(menuEntry.category, subItem)
                    const actualSubItemText = await subItemLocator.textContent()

                    await expect(subItemLocator).toBeVisible()
                    await expect(subItemLocator).toHaveText(actualSubItemText!)
                }
            }
        })
    })
})