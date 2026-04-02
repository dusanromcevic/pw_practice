import { Page } from '@playwright/test'
import { NavigationPage } from './NavigationPage'
import { HomePage } from './Homepage'
import { SpecialsPage } from './SpecialsPage'
import { ProductPage } from './ProductPage'
import { CreateAccountPage } from './CreateAccountPage'
import { LoginPage } from './LoginPage'
import { CartPage } from './CartPage'
import { GuestCheckoutPage } from './GuestCheckoutPage'
import { CheckoutConfirmationPage } from './CheckoutConfirmationPage'
import { OrderSuccessPage } from './OrderSuccessPage'          // ← added

export class PageManager {

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly homePage: HomePage
    private readonly specialsPage: SpecialsPage
    private readonly productPage: ProductPage
    private readonly createAccountPage: CreateAccountPage
    private readonly loginPage: LoginPage
    private readonly cartPage: CartPage
    private readonly guestCheckoutPage: GuestCheckoutPage
    private readonly checkoutConfirmationPage: CheckoutConfirmationPage
    private readonly orderSuccessPage: OrderSuccessPage        // ← added

    constructor(page: Page) {
        this.page                     = page
        this.navigationPage           = new NavigationPage(page)
        this.homePage                 = new HomePage(page)
        this.specialsPage             = new SpecialsPage(page)
        this.productPage              = new ProductPage(page)
        this.createAccountPage        = new CreateAccountPage(page)
        this.loginPage                = new LoginPage(page)
        this.cartPage                 = new CartPage(page)
        this.guestCheckoutPage        = new GuestCheckoutPage(page)
        this.checkoutConfirmationPage = new CheckoutConfirmationPage(page)
        this.orderSuccessPage         = new OrderSuccessPage(page)  // ← added
    }

    navigateTo():          NavigationPage           { return this.navigationPage }
    onHomePage():          HomePage                 { return this.homePage }
    onSpecials():          SpecialsPage             { return this.specialsPage }
    onProduct():           ProductPage              { return this.productPage }
    onCreateAccount():     CreateAccountPage        { return this.createAccountPage }
    onLogin():             LoginPage                { return this.loginPage }
    onCart():              CartPage                 { return this.cartPage }
    onGuestCheckout():     GuestCheckoutPage        { return this.guestCheckoutPage }
    onConfirmation():      CheckoutConfirmationPage { return this.checkoutConfirmationPage }
    onOrderSuccess():      OrderSuccessPage         { return this.orderSuccessPage }  // ← added
}