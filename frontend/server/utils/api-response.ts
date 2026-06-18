import type { ApiResponse, PaginationMeta } from '~/types/content'

type CacheStrategy = 'short' | 'medium' | 'long' | 'none'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

interface PaginationOptions {
  defaultPage?: number
  defaultPageSize?: number
  maxPageSize?: number
}

export function normalizePagination(
  pageInput: unknown,
  pageSizeInput: unknown,
  options: PaginationOptions = {}
) {
  const defaultPage = options.defaultPage ?? DEFAULT_PAGE
  const defaultPageSize = options.defaultPageSize ?? DEFAULT_PAGE_SIZE
  const maxPageSize = options.maxPageSize ?? MAX_PAGE_SIZE
  const page = positiveIntegerValue(pageInput, defaultPage)
  const pageSize = Math.min(positiveIntegerValue(pageSizeInput, defaultPageSize), maxPageSize)

  return { page, pageSize }
}

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
  const { page: safePage, pageSize: safePageSize } = normalizePagination(page, pageSize)
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

function positiveIntegerValue(value: unknown, fallback: number) {
  const candidate = Array.isArray(value) ? value[0] : value
  const numericValue = typeof candidate === 'number'
    ? candidate
    : typeof candidate === 'string' && candidate.trim()
      ? Number(candidate)
      : NaN

  if (!Number.isFinite(numericValue)) {
    return fallback
  }

  const integerValue = Math.floor(numericValue)
  return integerValue >= 1 ? integerValue : fallback
}
