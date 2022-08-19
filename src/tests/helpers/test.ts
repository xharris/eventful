/* eslint-disable unused-imports/no-unused-vars */
import { Dialog, test as base, Page, Browser, Response, Locator } from '@playwright/test'
import { cleanDB } from './db'
import { User } from './user'
import { Event } from './event'
import { Plan } from './plan'
import { PageWrapper } from './page'

export type BasicOptions = {
  wrapper: PageWrapper
  user: User
  event: Event
  plan: Plan
  beforeAfter: void
  acceptConfirm: (dlg: Dialog) => Promise<void>
  denyConfirm: (dlg: Dialog) => Promise<void>
  goToHome: () => Promise<Response | null>
}

export type IinitPage = {
  page: Page
  grantPermissions?: () => Promise<void>
} & Omit<BasicOptions, 'beforeAfter'>

export const goToHome = async ({ page }: { page: Page }) => await page.goto('/')

export const initPage = async (browser: Browser): Promise<IinitPage> => {
  const context = await browser.newContext()
  const page = await context.newPage()
  const wrapper = new PageWrapper(page)
  return {
    page,
    wrapper,
    user: new User(page, context),
    event: new Event(page),
    plan: new Plan(page),
    acceptConfirm: async (dlg: Dialog) => await dlg.accept(),
    denyConfirm: async (dlg: Dialog) => await dlg.dismiss(),
    goToHome: () => goToHome({ page }),
    grantPermissions: () => context.grantPermissions(['geolocation', 'notifications']),
  }
}

export const getElementRect = async (locator: Locator) =>
  await locator.evaluate((node) => node.getBoundingClientRect())

export const basicTest = base.extend<BasicOptions>({
  wrapper: async ({ page }, use) => await use(new PageWrapper(page)),
  user: async ({ page, context }, use) => await use(new User(page, context)),
  event: async ({ page }, use) => await use(new Event(page)),
  plan: async ({ page }, use) => await use(new Plan(page)),
  acceptConfirm: async ({}, use) => {
    await use(async (dlg: Dialog) => {
      await dlg.accept()
    })
  },
  denyConfirm: async ({}, use) => {
    await use(async (dlg: Dialog) => {
      await dlg.dismiss()
    })
  },
  goToHome: ({ page }, use) => use(() => goToHome({ page })),
  beforeAfter: [
    async ({ browser, context }, use) => {
      try {
        await context.grantPermissions(
          browser.browserType().name() === 'webkit'
            ? ['geolocation']
            : ['geolocation', 'notifications']
        )
      } catch (e) {}
      await use()
      // await cleanDB()
    },
    { auto: true },
  ],
})
