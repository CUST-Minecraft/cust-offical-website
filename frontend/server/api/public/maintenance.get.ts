export default defineEventHandler(async (event) => {
  try {
    const maintenance = await fetchMaintenancePage()
    const { serviceStatus } = maintenance
    setPublicCache(event, maintenance.maintenanceEnabled ? 'none' : 'short')

    return ok({ ...maintenance, serviceStatus })
  } catch (error) {
    if (!isStrapiUnavailable(error)) {
      throw error
    }

    setPublicCache(event, 'none')

    return ok(defaultMaintenancePage(true))
  }
})
