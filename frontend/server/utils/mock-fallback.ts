export async function withMockFallback<T>(fetcher: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await fetcher()
  } catch (error) {
    if (!isStrapiUnavailable(error)) {
      throw error
    }

    if (isProduction()) {
      throw maintenanceError()
    }

    return fallback()
  }
}

export function isStrapiUnavailable(error: unknown) {
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase()
  const cause = (error instanceof Error && 'cause' in error ? String(error.cause) : '').toUpperCase()
  const statusCode = statusCodeFromError(error)

  return (
    message.includes('fetch failed') ||
    message.includes('<no response>') ||
    message.includes('timeout') ||
    cause.includes('ECONNREFUSED') ||
    cause.includes('ECONNRESET') ||
    cause.includes('ETIMEDOUT') ||
    cause.includes('ENOTFOUND') ||
    statusCode === 502 ||
    statusCode === 503 ||
    statusCode === 504
  )
}

function isProduction() {
  return !import.meta.dev
}

function statusCodeFromError(error: unknown) {
  if (typeof error !== 'object' || !error) {
    return undefined
  }

  const record = error as Record<string, unknown>
  const status = record.statusCode ?? record.status
  const statusCode = Number(status)

  return Number.isFinite(statusCode) ? statusCode : undefined
}
