import { aboutPage as mockAboutPage } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const data = await withMockFallback(() => fetchAboutPage(), () => mockAboutPage)
  setPublicCache(event, 'medium')

  return ok(data)
})
