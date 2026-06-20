import type {
  AboutPageData,
  ActivitySummary,
  AnnouncementSummary,
  ApiResponse,
  ExternalService,
  HomeData,
  JoinPageData,
  MaintenancePageData,
  MemberProfile,
  PostSummary,
  ServiceStatus,
  SiteInfo
} from '~/types/content'

interface SiteSettingsData {
  site: SiteInfo
  navigation: { label: string; href: string }[]
  externalServices: ExternalService[]
  serviceStatus: ServiceStatus
}

export function useSiteSettings() {
  return usePublicAsyncData('site-settings', () => $fetch<ApiResponse<SiteSettingsData>>('/api/public/settings').then(unwrapApiResponse))
}

export function useHome() {
  return usePublicAsyncData('home', () => $fetch<ApiResponse<HomeData>>('/api/public/home').then(unwrapApiResponse))
}

export function useExternalServices() {
  return usePublicAsyncData('external-services', () => $fetch<ApiResponse<ExternalService[]>>('/api/public/external-services').then(unwrapApiResponse))
}

export function useAboutPage() {
  return usePublicAsyncData('about', () => $fetch<ApiResponse<AboutPageData>>('/api/public/about').then(unwrapApiResponse))
}

export function useJoinPage() {
  return usePublicAsyncData('join', () => $fetch<ApiResponse<JoinPageData>>('/api/public/join').then(unwrapApiResponse))
}

export function useMembers() {
  return usePublicAsyncData('members', () => $fetch<ApiResponse<MemberProfile[]>>('/api/public/members').then(unwrapApiResponse))
}

export function useActivities(params: Ref<Record<string, string | number>> | Record<string, string | number> = {}) {
  return usePublicAsyncData(`activities:${JSON.stringify(unref(params))}`, () =>
    $fetch<ApiResponse<ActivitySummary[]>>('/api/public/activities', { query: unref(params) }).then(unwrapApiResponse)
  )
}

export function useActivityDetail(slug: string) {
  return usePublicAsyncData(`activity:${slug}`, () =>
    $fetch<ApiResponse<ActivitySummary>>(`/api/public/activities/${slug}`).then(unwrapApiResponse)
  )
}

export function useAnnouncements(params: Ref<Record<string, string | number>> | Record<string, string | number> = {}) {
  return usePublicAsyncData(`announcements:${JSON.stringify(unref(params))}`, () =>
    $fetch<ApiResponse<AnnouncementSummary[]>>('/api/public/announcements', { query: unref(params) }).then(unwrapApiResponse)
  )
}

export function useAnnouncementDetail(slug: string) {
  return usePublicAsyncData(`announcement:${slug}`, () =>
    $fetch<ApiResponse<AnnouncementSummary>>(`/api/public/announcements/${slug}`).then(unwrapApiResponse)
  )
}

export function usePosts(params: Ref<Record<string, string | number>> | Record<string, string | number> = {}) {
  return usePublicAsyncData(`posts:${JSON.stringify(unref(params))}`, () =>
    $fetch<ApiResponse<PostSummary[]>>('/api/public/posts', { query: unref(params) }).then(unwrapApiResponse)
  )
}

export function usePostDetail(slug: string) {
  return usePublicAsyncData(`post:${slug}`, () =>
    $fetch<ApiResponse<PostSummary>>(`/api/public/posts/${slug}`).then(unwrapApiResponse)
  )
}

export function useMaintenancePage() {
  return usePublicAsyncData('maintenance', () => $fetch<ApiResponse<MaintenancePageData>>('/api/public/maintenance').then(unwrapApiResponse))
}

async function usePublicAsyncData<T>(key: string, handler: () => Promise<T>) {
  const result = await useAsyncData(key, handler)

  if (result.error.value) {
    throw result.error.value
  }

  return result
}

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw createError({
      statusCode: statusCodeForApiError(response.error.code),
      statusMessage: response.error.message
    })
  }

  return response.data
}

function statusCodeForApiError(code: string) {
  if (code === 'NOT_FOUND') {
    return 404
  }

  if (code === 'MAINTENANCE') {
    return 503
  }

  return 500
}
