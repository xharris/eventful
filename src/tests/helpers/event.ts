import { Page } from '@playwright/test'
import * as generate from './generate'
import { goToHome } from './test'

export type EventObject = ReturnType<typeof generate.event>

export class Event {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async create() {
    const { page } = this
    const event = generate.event()

    await goToHome({ page })
    await page.fill('[name="name"]', event.name)
    await page.click('[title="Add event"]')
    await page.waitForLoadState('networkidle')

    return event
  }

  async visit({ name }: EventObject) {
    const { page } = this

    await goToHome({ page })
    await page.click(`text=${name}`)
    await page.waitForLoadState('networkidle')
  }
}
