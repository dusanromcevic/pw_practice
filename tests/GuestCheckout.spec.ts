import { test, expect, Page } from '@playwright/test'
import { PageManager } from '../pages/PageManager'
import { loadCredentials } from '../helpers/credentialManager'
import MailSlurp from 'mailslurp-client'
import { MatchOptionFieldEnum, MatchOptionShouldEnum } from 'mailslurp-client/dist/generated/models/MatchOption'

test.describe.configure({ mode: 'serial' })

test.describe('Guest Checkout', () => {

    let page: Page
    let pm: PageManager

    // Loaded once — used for form fill and MailSlurp email check
    const credentials = loadCredentials()
    const mailslurp   = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY ?? '' })

    // Product constants — single source of truth for all assertions in this file
    const PRODUCT_NAME = 'BeneFit Girl Meets Pearl'
    const UNIT_PRICE   = 19.00
    const QUANTITY     = 2
    const SUBTOTAL     = UNIT_PRICE * QUANTITY  // 38.00
    const SHIPPING     = 2.00
    const TOTAL        = SUBTOTAL + SHIPPING    // 40.00

    // One shared browser page for the entire flow
    // This preserves session cookies and cart state between tests
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage()
        pm   = new PageManager(page)
    })

    test.afterAll(async () => {
        await page.close()
    })

    test('Add product to cart and verify cart contents', async () => {
        await pm.navigateTo().goToHome()
        await pm.navigateTo().goToFeaturedProduct(PRODUCT_NAME)
        await pm.onProduct().setQuantity(QUANTITY)
        await pm.onProduct().addToCart()

        await expect(pm.onCart().cartProductName).toContainText(PRODUCT_NAME)
        await expect(pm.onCart().cartUnitPrice).toContainText(`$${UNIT_PRICE.toFixed(2)}`)
        await expect(pm.onCart().cartRowTotal).toContainText(`$${SUBTOTAL.toFixed(2)}`)
    })

    test('Nav bar cart dropdown sub-total matches cart page sub-total', async () => {
        // Read the sub-total directly from the cart page summary table
        const cartPageSubTotal = await pm.onCart().summarySubTotal.textContent()

        // Open the nav bar dropdown and verify it shows the same value
        await pm.onCart().openCartDropdown()
        await expect(pm.onCart().miniCartDropdown).toBeVisible()
        await expect(pm.onCart().miniCartSubTotal).toHaveText(cartPageSubTotal!)
    })

    test('Cart total is sub-total plus flat shipping rate', async () => {
        const subTotal = await pm.onCart().parsePrice(pm.onCart().summarySubTotal)
        const shipping = await pm.onCart().parsePrice(pm.onCart().summaryShipping)
        const total    = await pm.onCart().parsePrice(pm.onCart().summaryTotal)

        expect(subTotal).toBe(SUBTOTAL)
        expect(shipping).toBe(SHIPPING)
        expect(total).toBe(subTotal + shipping)
    })

    test('Complete guest checkout form and proceed to confirmation', async () => {
        await pm.onCart().goToCheckout()
        await pm.navigateTo().selectGuestCheckout()

        await pm.onGuestCheckout().fillPersonalDetails(
            credentials.firstName,
            credentials.lastName,
            credentials.email,
            credentials.telephone
        )

        await pm.onGuestCheckout().fillAddress(
            credentials.address1,
            credentials.city,
            credentials.zipCode
        )

        // Greater London = 3553 — same region value used in registration
        await pm.onGuestCheckout().selectRegion('3553')
        await pm.onGuestCheckout().continue()
    })

    test('Confirmation page shows correct product and pricing', async () => {
        await expect(pm.onConfirmation().cartProductName).toContainText(PRODUCT_NAME)
        await expect(pm.onConfirmation().cartUnitPrice).toContainText(`$${UNIT_PRICE.toFixed(2)}`)
        await expect(pm.onConfirmation().cartQuantity).toContainText(`${QUANTITY}`)
        await expect(pm.onConfirmation().cartRowTotal).toContainText(`$${SUBTOTAL.toFixed(2)}`)

        const subTotal = await pm.onConfirmation().parsePrice(pm.onConfirmation().summarySubTotal)
        const shipping = await pm.onConfirmation().parsePrice(pm.onConfirmation().summaryShipping)
        const total    = await pm.onConfirmation().parsePrice(pm.onConfirmation().summaryTotal)

        expect(subTotal).toBe(SUBTOTAL)
        expect(shipping).toBe(SHIPPING)
        expect(total).toBe(subTotal + shipping)
    })

    test('Confirm order and verify success page', async () => {
        await pm.onConfirmation().confirmOrder()

        await expect(pm.onOrderSuccess().successHeading).toBeVisible({ timeout: 15000 })
    })

test('Order confirmation email is received via MailSlurp', async () => {
    const emails = await mailslurp.waitForMatchingEmails(
        {
            matches: [
                {
                    field: MatchOptionFieldEnum.SUBJECT,
                    should: MatchOptionShouldEnum.CONTAIN,
                    value: 'Order'
                }
            ]
        },
        1,           // count — wait for at least 1 matching email
        credentials.inboxId,
        30000,       // timeout in ms
        true         // unread only
    )

    const fullEmail = await mailslurp.getEmail(emails[0].id!)

    expect(fullEmail.subject).toContain('Order')
    expect(fullEmail.body).toContain(PRODUCT_NAME)
})
})