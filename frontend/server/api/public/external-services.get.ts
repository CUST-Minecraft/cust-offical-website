import { externalServices as mockExternalServices } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const services = await withMockFallback(() => fetchExternalServices(), () => mockExternalServices)

  setPublicCache(event, 'short')

  return ok(services)
})
