import { members as mockMembers } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const data = await withMockFallback(() => fetchMembers(), () => mockMembers)
  setPublicCache(event, 'medium')

  return ok(data)
})
