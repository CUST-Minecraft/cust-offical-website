import { announcements as mockAnnouncements } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const pageSize = Number(query.pageSize ?? 10)
  const category = typeof query.category === 'string' ? query.category : ''
  const { data, meta } = await withMockFallback(
    () => fetchAnnouncements({ page, pageSize, category }),
    () => paginate(category ? mockAnnouncements.filter((announcement) => announcement.category === category) : mockAnnouncements, page, pageSize)
  )

  setPublicCache(event, 'short')

  return ok(data, meta)
})
