import { announcements } from '~/data/mock'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const announcement = announcements.find((item) => item.slug === slug)

  return announcement ? ok(announcement) : fail('NOT_FOUND', '公告不存在或未发布')
})
