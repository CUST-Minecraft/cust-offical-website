import { maintenance as mockMaintenance, navigation as mockNavigation, serviceStatus as mockServiceStatus, site as mockSite } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const { site, navigation, serviceStatus } = await withMockFallback(
    () => fetchSiteSettings(),
    () => ({
      site: mockSite,
      navigation: mockNavigation,
      serviceStatus: mockServiceStatus,
      maintenance: {
        title: mockMaintenance.title,
        message: mockMaintenance.message,
        until: mockMaintenance.until,
        maintenanceEnabled: false
      }
    })
  )

  setPublicCache(event, 'short')

  return ok({ site, navigation, serviceStatus })
})
