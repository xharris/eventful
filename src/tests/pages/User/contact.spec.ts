import { expect } from '@playwright/test'
import { basicTest } from 'src/tests/helpers/test'

basicTest.describe('User - Contacts', () => {
  basicTest('add/remove contact', async ({ page, user }) => {
    const u1 = await user.signup()
    await user.logout()
    await user.signup()
    await user.addContact(u1)
    await expect(page.locator('button[title="Remove contact"]')).toBeVisible()
  })
})
