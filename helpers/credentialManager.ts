import * as fs from 'fs'
import * as path from 'path'
import { AccountCredentials } from './testDataHelper'

// Credentials are stored in a file that is gitignored
// This file is written by the registration test and read by the login test
const CREDENTIALS_PATH = path.join(process.cwd(), 'test-data/credentials.json')

export function saveCredentials(credentials: AccountCredentials): void {
    // Create the test-data folder if it doesn't exist yet
    const dir = path.dirname(CREDENTIALS_PATH)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2))
}

export function loadCredentials(): AccountCredentials {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error(
            'credentials.json not found — make sure the registration test has run first'
        )
    }

    const raw = fs.readFileSync(CREDENTIALS_PATH, 'utf-8')
    return JSON.parse(raw) as AccountCredentials
}