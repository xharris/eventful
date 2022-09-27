import { Page } from '@playwright/test'
import casual from 'casual'
import { UserObject } from './user'

export class Plan {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async create(type: 'Empty' | 'Lodging' | 'Carpool' | 'Location') {
    const { page } = this

    await page.click('button[title="Add plan"]')
    await page.click(`text=${type}`)
  }

  async edit(what?: string) {
    const { page } = this

    await page.click(
      what
        ? `[data-testid="plan"] :text("${what}")`
        : `[data-testid="plan"] :text-matches("untitled \\\\w+", "i")`
    )
  }

  async save() {
    const { page } = this
    await page.click('[data-testid="plan"] [title="Save plan"]')
  }

  async setWhat() {
    const { page } = this

    const what = casual.title
    await page.fill(`[data-testid="plan"] [name="what"]`, what)

    return what
  }

  async addWho(...users: UserObject[]) {
    const { page } = this

    for (const user of users) {
      await page.click('[data-testid="plan"] [data-testid="select"]', {
        position: {
          x: 2,
          y: 2,
        },
      })
      await page.click(`.rs__menu-portal :text("${user.username}")`)
    }
  }
}
