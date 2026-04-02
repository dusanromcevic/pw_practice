import { Page, Locator } from '@playwright/test'
import { HelperBase } from './HelperBase'

export class GuestCheckoutPage extends HelperBase {

    // --- Personal Details ---
    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly emailInput: Locator
    readonly telephoneInput: Locator

    // --- Address ---
    readonly address1Input: Locator
    readonly cityInput: Locator
    readonly regionSelect: Locator
    readonly zipCodeInput: Locator
    readonly countrySelect: Locator

    // --- Order Summary panel (right side) ---
    readonly orderSummaryProductName: Locator
    readonly orderSummarySubTotal: Locator
    readonly orderSummaryTotal: Locator

    // --- Submit ---
    readonly continueButton: Locator

    constructor(page: Page) {
        super(page)

        // Personal Details
        this.firstNameInput = page.locator('#guestFrm_firstname')
        this.lastNameInput  = page.locator('#guestFrm_lastname')
        this.emailInput     = page.locator('#guestFrm_email')
        this.telephoneInput = page.locator('#guestFrm_telephone')

        // Address
        this.address1Input  = page.locator('#guestFrm_address_1')
        this.cityInput      = page.locator('#guestFrm_city')
        this.regionSelect   = page.locator('#guestFrm_zone_id')
        this.zipCodeInput   = page.locator('#guestFrm_postcode')
        this.countrySelect  = page.locator('#guestFrm_country_id')

        // Order Summary panel
        this.orderSummaryProductName = page.locator('.thumbnails-checkout a')
        this.orderSummarySubTotal    = page.locator('tr:has(td:text("Sub-Total:")) td').last()
        this.orderSummaryTotal       = page.locator('tr:has(td:text("Total:")) td').last()

        // Continue button — scoped by title attribute
        this.continueButton = page.getByTitle('Continue')
    }

    async fillPersonalDetails(
        firstName: string,
        lastName: string,
        email: string,
        telephone: string
    ): Promise<void> {
        await this.firstNameInput.fill(firstName)
        await this.lastNameInput.fill(lastName)
        await this.emailInput.fill(email)
        await this.telephoneInput.fill(telephone)
    }

    async fillAddress(
        address1: string,
        city: string,
        zipCode: string
    ): Promise<void> {
        await this.address1Input.fill(address1)
        await this.cityInput.fill(city)
        await this.zipCodeInput.fill(zipCode)
    }

    async selectRegion(regionValue: string): Promise<void> {
        await this.regionSelect.selectOption({ value: regionValue })
    }

    async continue(): Promise<void> {
        await this.continueButton.click()
    }
}