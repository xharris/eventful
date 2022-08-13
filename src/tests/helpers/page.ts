import { Page } from '@playwright/test'

export class PageWrapper {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async blur(selector: string) {
    const { page } = this
    await page.locator(selector).evaluate((e) => e.blur())
  }
}
