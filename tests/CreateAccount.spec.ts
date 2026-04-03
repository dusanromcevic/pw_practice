import { test, expect } from '@playwright/test'
import { PageManager } from '../pages/PageManager'
import { generateAccountCredentials } from '../helpers/testDataHelper'
import { saveCredentials } from '../helpers/credentialManager'
import * as fs from 'fs'
import * as path from 'path'

test.describe.configure({ mode: 'serial' })

test.describe('Account Creation', () => {

    let pm: PageManager

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page)
        await pm.navigateTo().goToHome()
        await pm.navigateTo().goToCreateAccount()
    })

    test.describe('Navigation to Create Account page', () => {

        test('Verify that the Create Account page is displayed', async () => {
            const heading = await pm.onCreateAccount().getHeading()
            expect(heading).toContain('Create Account')
        })
    })

    test.describe('Register a new account', () => {

        test('Successfully register with valid details', async () => {

        const credentialsPath = path.join(process.cwd(), 'test-data/credentials.json')
        const forceRegistration = process.env.FORCE_REGISTRATION === 'true'

        // Skip cleanly if credentials exist and we're not forcing a fresh registration
        // test.skip() marks the test as skipped in the report — more honest than return
        if (fs.existsSync(credentialsPath) && !forceRegistration) {
            test.skip(true, 'Credentials already exist — set FORCE_REGISTRATION=true to re-register')
            return
        }

        const credentials = await generateAccountCredentials()

            // Fill the form section by section
            await pm.onCreateAccount().fillPersonalDetails(
                credentials.firstName,
                credentials.lastName,
                credentials.email,
                credentials.telephone
            )

            await pm.onCreateAccount().fillAddress(
                credentials.address1,
                credentials.city,
                credentials.zipCode
            )

            // Country is pre-selected as United Kingdom — no need to select it
            // Greater London value = '3553' from the form's option list
            await pm.onCreateAccount().selectRegion('3553')

            await pm.onCreateAccount().fillLoginDetails(
                credentials.loginName,
                credentials.password
            )

            await pm.onCreateAccount().subscribeNewsletter(false)
            await pm.onCreateAccount().acceptPrivacyPolicy()
            await pm.onCreateAccount().submitRegistration()

            // Assert successful registration — save credentials ONLY if registration passed
            await expect(pm.onCreateAccount().getSuccessMessage()).toContainText(
                'Your Account Has Been Created!',
                { timeout: 10000 }
            )

            // Credentials saved after assertion — guarantees only valid credentials are stored
            saveCredentials(credentials)
        })
    })
})