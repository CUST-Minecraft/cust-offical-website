import type { ApiResponse, PaginationMeta } from '~/types/content'

export function ok<T>(data: T, meta?: PaginationMeta | Record<string, unknown>): ApiResponse<T> {
  return meta ? { success: true, data, meta } : { success: true, data }
}

export function fail(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } }
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
