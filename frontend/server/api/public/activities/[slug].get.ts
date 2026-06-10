import { activities } from '~/data/mock'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const activity = activities.find((item) => item.slug === slug)

  return activity ? ok(activity) : fail('NOT_FOUND', '活动不存在或未发布')
})
