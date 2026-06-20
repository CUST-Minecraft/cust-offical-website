import { announcements as mockAnnouncements } from '~/data/mock'
import { assertPublicContentAvailable } from '~/server/utils/public-content-guard'

export default defineEventHandler(async (event) => {
  await assertPublicContentAvailable()

  const slug = getRouterParam(event, 'slug')
  const announcement = slug
    ? await withMockFallback(
        () => fetchAnnouncementBySlug(slug),
        () => mockAnnouncements.find((item) => item.slug === slug) ?? null
      )
    : null

  if (!announcement) {
    setResponseStatus(event, 404)
    return fail('NOT_FOUND', '公告不存在或未发布')
  }

  setPublicCache(event, 'medium')

  return ok(announcement)
})
