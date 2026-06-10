import { posts } from '~/data/mock'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const pageSize = Number(query.pageSize ?? 10)
  const category = typeof query.category === 'string' ? query.category : ''
  const tag = typeof query.tag === 'string' ? query.tag : ''
  const filtered = posts.filter((post) => {
    const matchCategory = category ? post.category === category : true
    const matchTag = tag ? post.tags.includes(tag) : true
    return matchCategory && matchTag
  })
  const { data, meta } = paginate(filtered, page, pageSize)

  return ok(data, meta)
})
