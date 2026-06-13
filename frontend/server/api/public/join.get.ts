import { joinPage as mockJoinPage } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const data = await withMockFallback(() => fetchJoinPage(), () => mockJoinPage)
  setPublicCache(event, 'medium')

  return ok(data)
})
