import { posts as mockPosts } from '~/data/mock'
import { assertPublicContentAvailable } from '~/server/utils/public-content-guard'

export default defineEventHandler(async (event) => {
  await assertPublicContentAvailable()

  const query = getQuery(event)
  const { page, pageSize } = normalizePagination(query.page, query.pageSize)
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
