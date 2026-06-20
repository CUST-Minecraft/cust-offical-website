import { externalServices as mockExternalServices, maintenancePage as mockMaintenancePage, navigation as mockNavigation, site as mockSite } from '~/data/mock'

export default defineEventHandler(async (event) => {
  const { site, navigation, externalServices, serviceStatus } = await withMockFallback(
    () => fetchSiteSettings(),
    () => ({
      site: mockSite,
      navigation: mockNavigation,
      externalServices: mockExternalServices,
      serviceStatus: mockMaintenancePage.serviceStatus,
      maintenance: mockMaintenancePage
    })
  )

  setPublicCache(event, 'short')

  return ok({ site, navigation, externalServices, serviceStatus })
})
