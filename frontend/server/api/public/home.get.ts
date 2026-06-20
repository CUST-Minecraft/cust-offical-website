import { home as mockHome } from '~/data/mock'
import { assertPublicContentAvailable } from '~/server/utils/public-content-guard'

export default defineEventHandler(async (event) => {
  await assertPublicContentAvailable()

  const data = await withMockFallback(() => fetchHomeData(), () => mockHome)
  setPublicCache(event, 'short')

  return ok(data)
})
