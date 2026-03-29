import{test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.locator('#block_frame_featured_1769').getByRole('link', { name: 'Skinsheen Bronzer Stick' }).click();   
});

test('Verify product name and price', async ({page}) => {

    const productName = page.locator('#product_details').getByText('Skinsheen Bronzer Stick');
    const productPrice = page.locator('.productpageprice').getByText('$29.50');

    await expect(productName).toContainText('Skinsheen Bronzer Stick');
    await expect(productPrice).toContainText('$29.50'); 
})

test('Verify price change when increasing quantity', async ({page}) => {

    const quantityInput = page.locator('#product_quantity');

    await quantityInput.fill('2', { timeout: 2000 });

    const totalPrice = page.locator('.total-price');

    await expect(totalPrice).toContainText('$59.00');
})