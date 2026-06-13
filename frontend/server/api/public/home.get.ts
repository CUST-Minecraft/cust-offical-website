import { home as mockHome } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const data = await withMockFallback(() => fetchHomeData(), () => mockHome)
  setPublicCache(event, 'short')

  return ok(data)
})
