import { Page, Locator } from '@playwright/test'
import { HelperBase } from './HelperBase'

export class LoginPage extends HelperBase {

    // --- Locators ---
    readonly loginNameInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly forgotPasswordLink: Locator
    readonly forgotLoginLink: Locator

    // --- Post-login ---
    // Using the sidebar 'My Account' heading — stable and not affected by dynamic username
    readonly accountHeading: Locator

    constructor(page: Page) {
        super(page)
        this.loginNameInput     = page.locator('#loginFrm_loginname')
        this.passwordInput      = page.locator('#loginFrm_password')
        this.loginButton        = page.getByTitle('Login')
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' })
        this.forgotLoginLink    = page.getByRole('link', { name: 'Forgot your login?' })
        this.accountHeading     = page.locator('h2.heading2')
    }

    async login(loginName: string, password: string): Promise<void> {
        await this.loginNameInput.fill(loginName)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }
}