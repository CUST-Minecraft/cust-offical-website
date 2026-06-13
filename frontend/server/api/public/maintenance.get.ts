export default defineEventHandler(async (event) => {
  try {
    const { maintenance, serviceStatus } = await fetchSiteSettings()
    setPublicCache(event, maintenance.maintenanceEnabled ? 'none' : 'short')

    return ok({ ...maintenance, serviceStatus })
  } catch (error) {
    if (!isStrapiUnavailable(error)) {
      throw error
    }

    setPublicCache(event, 'none')

    return ok({
      title: '社团官网维护中',
      message: '内容服务暂时不可用，请稍后再试。',
      maintenanceEnabled: true,
      serviceStatus: {
        label: '社团服务状态',
        href: '/maintenance',
        services: []
      }
    })
  }
})
