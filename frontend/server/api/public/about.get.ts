import { aboutPage as mockAboutPage } from '~/data/mock'
import { assertPublicContentAvailable } from '~/server/utils/public-content-guard'

export default defineEventHandler(async (event) => {
  await assertPublicContentAvailable()

  const data = await withMockFallback(() => fetchAboutPage(), () => mockAboutPage)
  setPublicCache(event, 'medium')

  return ok(data)
})
