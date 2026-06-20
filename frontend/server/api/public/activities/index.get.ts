import { activities as mockActivities } from '~/data/mock'
import { assertPublicContentAvailable } from '~/server/utils/public-content-guard'

export default defineEventHandler(async (event) => {
  await assertPublicContentAvailable()

  const query = getQuery(event)
  const { page, pageSize } = normalizePagination(query.page, query.pageSize)
  const status = typeof query.status === 'string' ? query.status : ''
  const { data, meta } = await withMockFallback(
    () => fetchActivities({ page, pageSize, status }),
    () => paginate(status ? mockActivities.filter((activity) => activity.status === status) : mockActivities, page, pageSize)
  )

  setPublicCache(event, 'short')

  return ok(data, meta)
})
