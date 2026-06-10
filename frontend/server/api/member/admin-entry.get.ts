import { currentMember, site } from '~/data/mock'

export default defineEventHandler(() => {
  if (!['content-admin', 'super-admin'].includes(currentMember.role)) {
    return fail('FORBIDDEN', '当前账号没有内容后台权限')
  }

  return ok({ url: site.adminConsoleUrl, label: '进入内容后台' })
})
