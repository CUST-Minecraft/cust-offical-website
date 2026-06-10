import { posts } from '~/data/mock'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const post = posts.find((item) => item.slug === slug)

  return post ? ok(post) : fail('NOT_FOUND', '动态不存在或未发布')
})
