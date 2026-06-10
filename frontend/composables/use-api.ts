import type {
  AboutPageData,
  ActivitySummary,
  AnnouncementSummary,
  ApiResponse,
  HomeData,
  JoinPageData,
  MemberAccount,
  MemberProfile,
  MemberService,
  PostSummary,
  ServiceStatus,
  SiteInfo
} from '~/types/content'

interface SiteSettingsData {
  site: SiteInfo
  navigation: { label: string; href: string }[]
  serviceStatus: ServiceStatus
}

export function useSiteSettings() {
  return useAsyncData('site-settings', () => $fetch<ApiResponse<SiteSettingsData>>('/api/public/settings').then(unwrapApiResponse))
}

export function useHome() {
  return useAsyncData('home', () => $fetch<ApiResponse<HomeData>>('/api/public/home').then(unwrapApiResponse))
}

export function useAboutPage() {
  return useAsyncData('about', () => $fetch<ApiResponse<AboutPageData>>('/api/public/about').then(unwrapApiResponse))
}

export function useJoinPage() {
  return useAsyncData('join', () => $fetch<ApiResponse<JoinPageData>>('/api/public/join').then(unwrapApiResponse))
}

export function useMembers() {
  return useAsyncData('members', () => $fetch<ApiResponse<MemberProfile[]>>('/api/public/members').then(unwrapApiResponse))
}

export function useActivities(params: Ref<Record<string, string | number>> | Record<string, string | number> = {}) {
  return useAsyncData(`activities:${JSON.stringify(unref(params))}`, () =>
    $fetch<ApiResponse<ActivitySummary[]>>('/api/public/activities', { query: unref(params) }).then(unwrapApiResponse)
  )
}

export function useActivityDetail(slug: string) {
  return useAsyncData(`activity:${slug}`, () =>
    $fetch<ApiResponse<ActivitySummary>>(`/api/public/activities/${slug}`).then(unwrapApiResponse)
  )
}

export function useAnnouncements(params: Ref<Record<string, string | number>> | Record<string, string | number> = {}) {
  return useAsyncData(`announcements:${JSON.stringify(unref(params))}`, () =>
    $fetch<ApiResponse<AnnouncementSummary[]>>('/api/public/announcements', { query: unref(params) }).then(unwrapApiResponse)
  )
}

export function useAnnouncementDetail(slug: string) {
  return useAsyncData(`announcement:${slug}`, () =>
    $fetch<ApiResponse<AnnouncementSummary>>(`/api/public/announcements/${slug}`).then(unwrapApiResponse)
  )
}

export function usePosts(params: Ref<Record<string, string | number>> | Record<string, string | number> = {}) {
  return useAsyncData(`posts:${JSON.stringify(unref(params))}`, () =>
    $fetch<ApiResponse<PostSummary[]>>('/api/public/posts', { query: unref(params) }).then(unwrapApiResponse)
  )
}

export function usePostDetail(slug: string) {
  return useAsyncData(`post:${slug}`, () =>
    $fetch<ApiResponse<PostSummary>>(`/api/public/posts/${slug}`).then(unwrapApiResponse)
  )
}

export function useMemberMe() {
  return useAsyncData('member-me', () => $fetch<ApiResponse<MemberAccount>>('/api/member/me').then(unwrapApiResponse))
}

export function useMemberServices() {
  return useAsyncData('member-services', () => $fetch<ApiResponse<MemberService[]>>('/api/member/services').then(unwrapApiResponse))
}

export function useMaintenancePage() {
  return useAsyncData('maintenance', () => $fetch<ApiResponse<Record<string, unknown>>>('/api/public/maintenance').then(unwrapApiResponse))
}

function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw createError({
      statusCode: response.error.code === 'NOT_FOUND' ? 404 : 500,
      statusMessage: response.error.message
    })
  }

  return response.data
}
