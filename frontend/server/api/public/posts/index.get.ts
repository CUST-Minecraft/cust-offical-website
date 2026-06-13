import { posts as mockPosts } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const pageSize = Number(query.pageSize ?? 10)
  const category = typeof query.category === 'string' ? query.category : ''
  const tag = typeof query.tag === 'string' ? query.tag : ''
  const { data, meta } = await withMockFallback(
    () => fetchPosts({ page, pageSize, category, tag }),
    () =>
      paginate(
        mockPosts.filter((post) => (!category || post.category === category) && (!tag || post.tags.includes(tag))),
        page,
        pageSize
      )
  )

  setPublicCache(event, 'short')

  return ok(data, meta)
})
