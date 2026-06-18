export async function assertPublicContentAvailable() {
  let maintenance

  try {
    maintenance = await fetchMaintenancePage()
  } catch (error) {
    if (!isStrapiUnavailable(error)) {
      throw error
    }

    if (!import.meta.dev) {
      throw maintenanceError()
    }

    return
  }

  if (maintenance.maintenanceEnabled) {
    throw maintenanceError(maintenance.message)
  }
}
