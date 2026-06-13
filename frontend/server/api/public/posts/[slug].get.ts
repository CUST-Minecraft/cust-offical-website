import { posts as mockPosts } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const post = slug
    ? await withMockFallback(
        () => fetchPostBySlug(slug),
        () => mockPosts.find((item) => item.slug === slug) ?? null
      )
    : null

  if (!post) {
    setResponseStatus(event, 404)
    return fail('NOT_FOUND', '动态不存在或未发布')
  }

  setPublicCache(event, 'medium')

  return ok(post)
})
