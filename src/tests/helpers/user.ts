import { Page, BrowserContext, expect, Dialog } from '@playwright/test'
import * as generate from './generate'
import { goToHome } from './test'

export type UserObject = ReturnType<typeof generate.user>

export const getUserInitials = ({ username }: Pick<UserObject, 'username'>) =>
  username.slice(0, 2).toUpperCase()

export const getAvatarSelector = (user: Pick<UserObject, 'username'>) =>
  `[data-testid=avatar]:has-text("${getUserInitials(user)}")`

export class User {
  readonly page: Page
  readonly context: BrowserContext
  static sel_avatar = '.page-header [data-testid="avatar"]'

  constructor(page: Page, context: BrowserContext) {
    this.page = page
    this.context = context
  }

  async signup(remember = true) {
    const { page, context } = this
    const user = generate.user()
    await context.setGeolocation({
      longitude: 40.75808762313903,
      latitude: -73.97944200206541,
    })

    await goToHome({ page })
    await page.click('text=Log in')
    await page.click('text=Sign up instead')
    await page.fill('[placeholder="Username"]', user.username)
    await page.fill('[placeholder="Password"]', user.password)
    await page.fill('[placeholder="Confirm password"]', user.password)
    if (remember) {
      await page.check('.checkbox:has([name="remember"])')
    } else {
      await page.uncheck('.checkbox:has([name="remember"])')
    }
    await page.click('button:has-text("Sign up")')
    await page.waitForLoadState('networkidle')

    return user
  }

  async login({ username, password }: UserObject, remember = true) {
    const { page, context } = this
    await context.setGeolocation({
      longitude: 40.75808762313903,
      latitude: -73.97944200206541,
    })

    await goToHome({ page })
    await page.click('text=Log in')
    await page.fill('[placeholder="Username"]', username)
    await page.fill('[placeholder="Password"]', password)
    if (remember) {
      await page.check('.checkbox:has([name="remember"])')
    } else {
      await page.uncheck('.checkbox:has([name="remember"])')
    }
    await page.click('button:has-text("Log in")')
    await page.waitForLoadState('networkidle')
  }

  async logout() {
    const { page } = this
    const ondialog = async (dlg: Dialog) => {
      await dlg.accept()
    }
    page.on('dialog', ondialog)
    await page.click(User.sel_avatar)
    await page.click('button:has-text("Log out")')
    page.off('dialog', ondialog)
    await page.waitForLoadState('networkidle')
  }

  async addContact({ username }: UserObject) {
    const { page } = this

    await page.click('.page-header button[title="User search"]')
    await page.fill('[name="query"]', username)
    await page.click(getAvatarSelector({ username }))
    await page.click('button[title="Add contact"]')
  }

  async view({ username }: UserObject) {
    const { page } = this

    await page.click('.page-header button[title="User search"]')
    await page.fill('[name="query"]', username)
    await page.click(getAvatarSelector({ username }))
  }
}
