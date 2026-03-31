import { Page } from '@playwright/test'
import { NavigationPage } from './NavigationPage'
import { HomePage } from './Homepage'
import { SpecialsPage } from './SpecialsPage'
import { ProductPage } from './ProductPage'

export class PageManager {

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly homePage: HomePage
    private readonly specialsPage: SpecialsPage
    private readonly productPage: ProductPage

    constructor(page: Page) {
        this.page        = page
        this.navigationPage = new NavigationPage(page)
        this.homePage       = new HomePage(page)
        this.specialsPage   = new SpecialsPage(page)
        this.productPage    = new ProductPage(page)
    }

    navigateTo(): NavigationPage  { return this.navigationPage }
    onHomePage(): HomePage        { return this.homePage }
    onSpecials(): SpecialsPage    { return this.specialsPage }
    onProduct():  ProductPage     { return this.productPage }
}