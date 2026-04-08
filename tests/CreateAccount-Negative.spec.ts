import { test, expect } from '@playwright/test'
import { PageManager } from '../pages/PageManager'
import { faker } from '@faker-js/faker'

test.describe('Account Creation Validation', () => {

    let pm: PageManager

    // Valid mandatory field values — reused across scenarios that need a
    // partially filled form to isolate only the field being tested
    const validFirstName = faker.person.firstName()
    const validLastName  = faker.person.lastName()
    const validEmail     = faker.internet.email()
    const validAddress   = faker.location.streetAddress()
    const validCity      = faker.location.city()
    const validZipCode   = faker.location.zipCode('??# #??')
    const validLoginName = faker.internet.username()
    const validPassword  = faker.internet.password({ length: 12, memorable: false })

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page)
        await pm.navigateTo().goToHome()
        await pm.navigateTo().goToCreateAccount()
    })

test('Blank form submission shows mandatory field errors', async () => {
    await pm.onCreateAccount().submitRegistration()

    await expect(pm.onCreateAccount().topAlertError)
        .toContainText('Error: You must agree to the Privacy Policy!')

    await expect(pm.onCreateAccount().firstNameError).toBeVisible()
    await expect(pm.onCreateAccount().lastNameError).toBeVisible()
    await expect(pm.onCreateAccount().emailError).toBeVisible()
    await expect(pm.onCreateAccount().address1Error).toBeVisible()
    await expect(pm.onCreateAccount().cityError).toBeVisible()
    await expect(pm.onCreateAccount().zipCodeError).toBeVisible()
    await expect(pm.onCreateAccount().loginNameError).toBeVisible()
    await expect(pm.onCreateAccount().passwordError).toBeVisible()
})

    test('Invalid email format shows email validation error', async () => {
        // A range of broken email formats — each should trigger the same error
        const invalidEmails = [
            faker.lorem.word(),                                           // no @ at all
            `${faker.internet.username()}@`,                              // missing domain
            `@${faker.internet.domainName()}`,                            // missing local part
            `${faker.internet.username()}..${faker.internet.domainName()}` // double dot
        ]

        for (const invalidEmail of invalidEmails) {
            await pm.onCreateAccount().fillPersonalDetails(
                validFirstName,
                validLastName,
                invalidEmail,
                ''
            )
            await pm.onCreateAccount().fillAddress(validAddress, validCity, validZipCode)
            await pm.onCreateAccount().selectRegion('3553')
            await pm.onCreateAccount().fillLoginDetails(validLoginName, validPassword)
            await pm.onCreateAccount().acceptPrivacyPolicy()
            await pm.onCreateAccount().submitRegistration()

            await expect(pm.onCreateAccount().emailError)
                .toBeVisible()

            // Navigate back to get a fresh form for the next invalid email
            await pm.navigateTo().goToCreateAccount()
        }
    })

    test('Password below minimum length shows password validation error', async () => {
        // 3 characters — one below the minimum of 4
        const shortPassword = faker.internet.password({ length: 3, memorable: false })

        await pm.onCreateAccount().fillPersonalDetails(
            validFirstName,
            validLastName,
            validEmail,
            ''
        )
        await pm.onCreateAccount().fillAddress(validAddress, validCity, validZipCode)
        await pm.onCreateAccount().selectRegion('3553')
        await pm.onCreateAccount().fillLoginDetails(validLoginName, shortPassword)
        await pm.onCreateAccount().acceptPrivacyPolicy()
        await pm.onCreateAccount().submitRegistration()

        await expect(pm.onCreateAccount().passwordError).toBeVisible()
    })

    test('Mismatched password confirmation shows confirm validation error', async () => {
        const differentPassword = faker.internet.password({ length: 12, memorable: false })

        await pm.onCreateAccount().fillPersonalDetails(
            validFirstName,
            validLastName,
            validEmail,
            ''
        )
        await pm.onCreateAccount().fillAddress(validAddress, validCity, validZipCode)
        await pm.onCreateAccount().selectRegion('3553')

        // Fill password fields manually to use two different values
        await pm.onCreateAccount().passwordInput.fill(validPassword)
        await pm.onCreateAccount().passwordConfirmInput.fill(differentPassword)
        await pm.onCreateAccount().loginNameInput.fill(validLoginName)

        await pm.onCreateAccount().acceptPrivacyPolicy()
        await pm.onCreateAccount().submitRegistration()

        await expect(pm.onCreateAccount().passwordConfirmError).toBeVisible()
    })
})