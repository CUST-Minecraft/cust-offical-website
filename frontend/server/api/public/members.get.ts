import { members as mockMembers } from '~/data/mock'
import { assertPublicContentAvailable } from '~/server/utils/public-content-guard'

export default defineEventHandler(async (event) => {
  await assertPublicContentAvailable()

  const data = await withMockFallback(() => fetchMembers(), () => mockMembers)
  setPublicCache(event, 'medium')

  return ok(data)
})
