import { expect } from '@playwright/test'
import { basicTest } from 'src/tests/helpers/test'

basicTest.describe('User - View', () => {
  basicTest('add/remove contact', async ({ page, user }) => {
    const u1 = await user.signup()
    user.view(u1)
    await expect(page.locator(`text=${u1.username}`)).toBeVisible()
  })
})
