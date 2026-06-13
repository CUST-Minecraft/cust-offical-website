import type { ApiResponse, PaginationMeta } from '~/types/content'

type CacheStrategy = 'short' | 'medium' | 'long' | 'none'

export function ok<T>(data: T, meta?: PaginationMeta | Record<string, unknown>): ApiResponse<T> {
  return meta ? { success: true, data, meta } : { success: true, data }
}

export function fail(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } }
}

export function maintenanceError(message = '内容服务暂时不可用，请稍后再试。') {
  return createError({
    statusCode: 503,
    statusMessage: '社团官网维护中',
    message,
    data: { code: 'MAINTENANCE' }
  })
}

export function setPublicCache(event: any, strategy: CacheStrategy) {
  const value = {
    short: 'public, max-age=60, s-maxage=300, stale-while-revalidate=60',
    medium: 'public, max-age=300, s-maxage=1800, stale-while-revalidate=300',
    long: 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400',
    none: 'no-store'
  }[strategy]

  setHeader(event, 'Cache-Control', value)
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const safePage = Math.max(1, page)
  const safePageSize = Math.max(1, pageSize)
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / safePageSize))
  const start = (safePage - 1) * safePageSize

  return {
    data: items.slice(start, start + safePageSize),
    meta: {
      page: safePage,
      pageSize: safePageSize,
      pageCount,
      total
    }
  }
}
