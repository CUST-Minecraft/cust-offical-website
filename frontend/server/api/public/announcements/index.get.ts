import { announcements as mockAnnouncements } from '~/data/mock'
import { assertPublicContentAvailable } from '~/server/utils/public-content-guard'

export default defineEventHandler(async (event) => {
  await assertPublicContentAvailable()

  const query = getQuery(event)
  const { page, pageSize } = normalizePagination(query.page, query.pageSize)
  const category = typeof query.category === 'string' ? query.category : ''
  const { data, meta } = await withMockFallback(
    () => fetchAnnouncements({ page, pageSize, category }),
    () => paginate(category ? mockAnnouncements.filter((announcement) => announcement.category === category) : mockAnnouncements, page, pageSize)
  )

  setPublicCache(event, 'short')

  return ok(data, meta)
})
