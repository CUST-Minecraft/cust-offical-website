import { activities as mockActivities } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const pageSize = Number(query.pageSize ?? 10)
  const status = typeof query.status === 'string' ? query.status : ''
  const { data, meta } = await withMockFallback(
    () => fetchActivities({ page, pageSize, status }),
    () => paginate(status ? mockActivities.filter((activity) => activity.status === status) : mockActivities, page, pageSize)
  )

  setPublicCache(event, 'short')

  return ok(data, meta)
})
