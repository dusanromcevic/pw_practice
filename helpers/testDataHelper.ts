import { faker } from '@faker-js/faker'
import MailSlurp from 'mailslurp-client'

// MailSlurp client is initialised once with your API key
// Store your API key in a .env file as MAILSLURP_API_KEY and never commit it
const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY ?? '' })

export interface AccountCredentials {
    // Personal Details
    firstName: string
    lastName: string
    email: string
    telephone: string

    // Address
    address1: string
    city: string
    zipCode: string

    // Login Details
    loginName: string
    password: string

    // MailSlurp inbox ID — stored so the login test could check emails later if needed
    inboxId: string
}

export async function generateAccountCredentials(): Promise<AccountCredentials> {
    // Create a real MailSlurp inbox — this gives us a unique real email address
    const inbox = await mailslurp.createInbox()

    const firstName = faker.person.firstName()
    const lastName  = faker.person.lastName()
    const loginName = faker.internet.username({ firstName, lastName })

    return {
        // Personal Details
        firstName,
        lastName,
        email:     inbox.emailAddress!,
        telephone: faker.phone.number(),

        // Address — UK zip code format to match the hardcoded United Kingdom selection
        address1: faker.location.streetAddress(),
        city:     faker.location.city(),
        zipCode:  faker.location.zipCode('??# #??'),

        // Login Details
        loginName,
        password: faker.internet.password({ length: 12, memorable: false }),

        // MailSlurp inbox ID
        inboxId: inbox.id!,
    }
}