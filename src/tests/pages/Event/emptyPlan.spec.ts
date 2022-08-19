import { expect } from '@playwright/test'
import { basicTest } from 'src/tests/helpers/test'
import { UserObject } from 'src/tests/helpers/user'

basicTest.describe('Empty Plan - Who', () => {
  let u1: UserObject, u2: UserObject, u3: UserObject
  basicTest.beforeEach(async ({ user }) => {
    u1 = await user.signup()
    await user.logout()
    u2 = await user.signup()
    await user.logout()
    u3 = await user.signup()
  })

  basicTest('can add only contacts and self', async ({ page, user, event, plan }) => {
    // u3 is contacts with u1
    await user.addContact(u1)
    const e1 = await event.create()

    await plan.create('Empty')
    await plan.edit()

    await page.click('[data-testid="plan"] [data-testid="select"]')

    await expect(page.locator(`.rs__menu-portal :text("${u1.username}")`)).toBeVisible()
    await expect(page.locator(`.rs__menu-portal :text("${u2.username}")`)).not.toBeVisible()
    await expect(page.locator(`.rs__menu-portal :text("${u3.username}")`)).toBeVisible()
  })

  basicTest("can't remove non-contacts/non-self", async ({ page, user, event, plan }) => {
    await user.addContact(u1)
    await user.addContact(u2)
    const e1 = await event.create()

    await plan.create('Empty')
    await plan.edit()
    const p1 = await plan.setWhat()

    // u3 can add u1 and u2 to event
    await plan.addWho(u1, u2)
    await expect(
      page.locator(
        `[data-testid="plan"] [data-testid="select"] .rs__multi-value__label:text("${u1.username}")`
      )
    ).toBeVisible()
    await expect(
      page.locator(
        `[data-testid="plan"] [data-testid="select"] .rs__multi-value__label:text("${u2.username}")`
      )
    ).toBeVisible()
    await plan.save()
    await user.logout()

    // u1 can remove u1 but not u2
    await user.login(u1)
    await event.visit(e1)
    await plan.edit(p1)
    await expect(
      page.locator(
        `[data-testid="plan"] [data-testid="select"] :text("${u1.username}") + .rs__multi-value__remove`
      )
    ).toBeVisible()
    await expect(
      page.locator(
        `[data-testid="plan"] [data-testid="select"] :text("${u2.username}") + .rs__multi-value__remove`
      )
    ).not.toBeVisible()
  })
})
