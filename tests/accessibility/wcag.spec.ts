import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const pages = [
  '/',
  '/sobre',
  '/servicos',
  '/contato',
  '/legal/privacidade',
  '/dados-abertos'
]

for (const page of pages) {
  test(`${page} deve atender WCAG 2.1 AA`, async ({ page: pg }) => {
    await pg.goto(page)
    const results = await new AxeBuilder({ page: pg })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
}
