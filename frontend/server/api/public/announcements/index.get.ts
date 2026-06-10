import { announcements } from '~/data/mock'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const pageSize = Number(query.pageSize ?? 10)
  const category = typeof query.category === 'string' ? query.category : ''
  const filtered = category
    ? announcements.filter((announcement) => announcement.category === category)
    : announcements
  const sorted = [...filtered].sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
  const { data, meta } = paginate(sorted, page, pageSize)

  return ok(data, meta)
})
