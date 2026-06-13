import { ok } from '~/server/utils/api-response'

interface AgentStatus {
  available: boolean
  message: string
  checkedAt: string
}

export default defineEventHandler(async (event) => {
  setPublicCache(event, 'none')

  const config = useRuntimeConfig()
  const serviceUrl = stripTrailingSlash(String(config.agentServiceUrl || ''))

  if (!serviceUrl) {
    return ok<AgentStatus>({
      available: false,
      message: 'Agent 服务尚未配置',
      checkedAt: new Date().toISOString()
    })
  }

  try {
    await $fetch(`${serviceUrl}/health`, { timeout: 3000 })

    return ok<AgentStatus>({
      available: true,
      message: 'Agent 服务在线',
      checkedAt: new Date().toISOString()
    })
  } catch {
    return ok<AgentStatus>({
      available: false,
      message: 'Agent 服务当前不可用',
      checkedAt: new Date().toISOString()
    })
  }
})

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}
