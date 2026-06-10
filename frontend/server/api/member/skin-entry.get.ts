import { currentMember, site } from '~/data/mock'

export default defineEventHandler(() => {
  if (currentMember.role === 'visitor') {
    return fail('UNAUTHORIZED', '请先登录')
  }

  return ok({ url: site.skinConsoleUrl, label: '进入皮肤站控制台' })
})
