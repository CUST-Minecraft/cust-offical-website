import { joinPage as mockJoinPage } from '~/data/mock'
import { assertPublicContentAvailable } from '~/server/utils/public-content-guard'

export default defineEventHandler(async (event) => {
  await assertPublicContentAvailable()

  const data = await withMockFallback(() => fetchJoinPage(), () => mockJoinPage)
  setPublicCache(event, 'medium')

  return ok(data)
})
