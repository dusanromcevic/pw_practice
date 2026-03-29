import {test, expect} from '@playwright/test';


test.beforeEach(async ({page}) => {
    await page.goto('');
});

test('Verify currency list items', async ({page}) => {

    const currencyPicker = page.locator('a.dropdown-toggle').first();

    await currencyPicker.hover();

    const currencyOptions = page.locator('.dropdown-menu.currency').getByRole('listitem');


    const euro = currencyOptions.filter({ hasText: 'Euro' })
    const poundSterling = currencyOptions.filter({ hasText: 'Pound Sterling' })
    const usDollar = currencyOptions.filter({ hasText: 'US Dollar' })

    await expect(currencyOptions).toContainText(['Euro', 'Pound Sterling', 'US Dollar']);

    const currencies: { [key: string]: RegExp } = {
        'Euro': /currency=EUR/,
        'Pound Sterling': /currency=GBP/,
        'US Dollar': /currency=USD/
    }

    for( const currency in currencies) {
        await currencyOptions.filter({ hasText: currency }).click();
        await expect(page).toHaveURL(currencies[currency]);
        if (currency !== 'US Dollar') {
        await currencyPicker.hover();
        }
    }
})

test('Verify promo section', async ({page}) => {

    const promoBanner = page.locator('.promo_section'); 

    const promoHeadings = ['Fast shipping', 'Easy Payments', 'Shipping Options', 'Large Variety'];

    for (const heading of promoHeadings) {
        await expect(promoBanner.getByRole('heading', { name: heading })).toContainText(heading);
    }
})