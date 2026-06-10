import { activities } from '~/data/mock'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const pageSize = Number(query.pageSize ?? 10)
  const status = typeof query.status === 'string' ? query.status : ''
  const filtered = status ? activities.filter((activity) => activity.status === status) : activities
  const { data, meta } = paginate(filtered, page, pageSize)

  return ok(data, meta)
})
