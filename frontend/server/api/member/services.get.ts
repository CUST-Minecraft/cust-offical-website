import { currentMember, memberServices } from '~/data/mock'
import type { MemberAccount } from '~/types/content'

const roleRank: Record<MemberAccount['role'], number> = {
  visitor: 0,
  member: 1,
  'content-admin': 2,
  'super-admin': 3
}

export default defineEventHandler(() => {
  const services = memberServices.filter(
    (service) => roleRank[currentMember.role] >= roleRank[service.requiredRole]
  )

  return ok(services)
})
