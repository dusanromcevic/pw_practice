import { test, expect } from '@playwright/test'
import { PageManager } from '../pages/PageManager'
import { loadCredentials } from '../helpers/credentialManager'

test.describe('Account Login', () => {

    let pm: PageManager

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page)
        await pm.navigateTo().goToHome()
        await pm.navigateTo().goToLogin()
    })

    test('Successfully login with registered credentials', async () => {
        const credentials = loadCredentials()

        await pm.onLogin().login(credentials.loginName, credentials.password)

        await expect(pm.onLogin().accountHeading)
            .toContainText('My Account', { timeout: 10000 })
    })
})