import { activities as mockActivities } from '~/data/mock'
import { assertPublicContentAvailable } from '~/server/utils/public-content-guard'

export default defineEventHandler(async (event) => {
  await assertPublicContentAvailable()

  const slug = getRouterParam(event, 'slug')
  const activity = slug
    ? await withMockFallback(
        () => fetchActivityBySlug(slug),
        () => mockActivities.find((item) => item.slug === slug) ?? null
      )
    : null

  if (!activity) {
    setResponseStatus(event, 404)
    return fail('NOT_FOUND', '活动不存在或未发布')
  }

  setPublicCache(event, 'medium')

  return ok(activity)
})
