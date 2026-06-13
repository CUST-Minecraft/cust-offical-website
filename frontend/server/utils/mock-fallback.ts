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
  const message = error instanceof Error ? error.message : String(error)
  const cause = error instanceof Error && 'cause' in error ? String(error.cause) : ''
  const statusCode = typeof error === 'object' && error && 'statusCode' in error ? Number(error.statusCode) : undefined

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
