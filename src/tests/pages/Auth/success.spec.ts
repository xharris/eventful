import { expect } from '@playwright/test'
import { basicTest } from 'src/tests/helpers/test'
import { User, getAvatarSelector } from 'src/tests/helpers/user'

basicTest.describe('Auth - Sucessful', () => {
  basicTest('sign up', async ({ page, user }) => {
    const u1 = await user.signup()
    await expect(page.locator(getAvatarSelector(u1))).toBeVisible()
  })

  basicTest('log out', async ({ page, user }) => {
    await user.signup()
    await user.logout()
    await expect(page.locator(User.sel_avatar)).not.toBeVisible()
  })

  basicTest('log in', async ({ page, user }) => {
    const u1 = await user.signup()
    await user.logout()
    await user.login(u1)
    await expect(page.locator(getAvatarSelector(u1))).toBeVisible()
  })
})
