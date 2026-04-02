import { Page, Locator } from '@playwright/test'
import { HelperBase } from './HelperBase'

export class CreateAccountPage extends HelperBase {

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

    // --- Login Details ---
    readonly loginNameInput: Locator
    readonly passwordInput: Locator
    readonly passwordConfirmInput: Locator

    // --- Newsletter ---
    readonly newsletterYes: Locator
    readonly newsletterNo: Locator

    // --- Submit ---
    readonly privacyPolicyCheckbox: Locator
    readonly continueButton: Locator

    // --- Success ---
    readonly successMessage: Locator

    constructor(page: Page) {
        super(page)

        // Personal Details
        this.firstNameInput       = page.locator('#AccountFrm_firstname')
        this.lastNameInput        = page.locator('#AccountFrm_lastname')
        this.emailInput           = page.locator('#AccountFrm_email')
        this.telephoneInput       = page.locator('#AccountFrm_telephone')

        // Address
        this.address1Input        = page.locator('#AccountFrm_address_1')
        this.cityInput            = page.locator('#AccountFrm_city')
        this.regionSelect         = page.locator('#AccountFrm_zone_id')
        this.zipCodeInput         = page.locator('#AccountFrm_postcode')
        this.countrySelect        = page.locator('#AccountFrm_country_id')

        // Login Details
        this.loginNameInput       = page.locator('#AccountFrm_loginname')
        this.passwordInput        = page.locator('#AccountFrm_password')
        this.passwordConfirmInput = page.locator('#AccountFrm_confirm')

        // Newsletter
        this.newsletterYes        = page.locator('#AccountFrm_newsletter1')
        this.newsletterNo         = page.locator('#AccountFrm_newsletter0')

        // Submit
        this.privacyPolicyCheckbox = page.locator('#AccountFrm_agree')
        this.continueButton        = page.getByTitle('Continue')

        // Success
        this.successMessage        = page.locator('span.maintext')
    }

    // --- Heading ---
    async getHeading(): Promise<string> {
        return await this.page.locator('span:has-text("CREATE ACCOUNT")').textContent() ?? ''
    }

    // --- Form fill methods ---
    async fillPersonalDetails(
        firstName: string,
        lastName: string,
        email: string,
        telephone: string
    ): Promise<void> {
        await this.firstNameInput.pressSequentially(firstName, { delay: 100 })
        await this.lastNameInput.pressSequentially(lastName, { delay: 100 })
        await this.emailInput.pressSequentially(email, { delay: 100 })
        await this.telephoneInput.pressSequentially(telephone, { delay: 100 })
    }

    async fillAddress(
        address1: string,
        city: string,
        zipCode: string
    ): Promise<void> {
        await this.address1Input.pressSequentially(address1, { delay: 100 })
        await this.cityInput.pressSequentially(city, { delay: 100 })
        await this.zipCodeInput.pressSequentially(zipCode, { delay: 100 })
    }

    // Country is pre-selected as United Kingdom on page load — this method
    // is available for future tests that need a different country
    async selectCountry(countryValue: string): Promise<void> {
        await this.countrySelect.selectOption({ value: countryValue })
        await this.regionSelect.waitFor({ state: 'visible' })
    }

    // Selects region by option value — more reliable than label matching
    // Greater London = '3553', see form HTML for full list of values
    async selectRegion(regionValue: string): Promise<void> {
        await this.regionSelect.waitFor({ state: 'visible' })
        await this.regionSelect.selectOption({ value: regionValue })
    }

    async fillLoginDetails(
        loginName: string,
        password: string
    ): Promise<void> {
        await this.loginNameInput.pressSequentially(loginName, { delay: 100 })
        await this.passwordInput.pressSequentially(password, { delay: 100 })
        await this.passwordConfirmInput.pressSequentially(password, { delay: 100 })
    }

    async subscribeNewsletter(subscribe: boolean): Promise<void> {
        subscribe
            ? await this.newsletterYes.click()
            : await this.newsletterNo.click()
    }

    async acceptPrivacyPolicy(): Promise<void> {
        await this.privacyPolicyCheckbox.check()
    }

    async submitRegistration(): Promise<void> {
        await this.continueButton.click()
    }

    // --- Success ---
    getSuccessMessage(): Locator {
        return this.successMessage
    }
}