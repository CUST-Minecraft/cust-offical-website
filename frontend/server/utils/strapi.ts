import type {
  AboutPageData,
  ActivitySummary,
  AnnouncementSummary,
  GalleryItem,
  HeroSlide,
  HomeData,
  ImageRef,
  JoinPageData,
  MemberProfile,
  NavLink,
  PaginationMeta,
  PostSummary,
  ServerInfo,
  ServiceStatus,
  SiteInfo
} from '~/types/content'

interface StrapiListResponse<T> {
  data: T[]
  meta?: { pagination?: PaginationMeta }
}

interface StrapiSingleResponse<T> {
  data: T | null
}

type StrapiQuery = Record<string, string | number | boolean | undefined>
type StrapiMedia = { url?: string; alternativeText?: string | null; caption?: string | null; name?: string }

interface SiteSettingsBundle {
  site: SiteInfo
  navigation: NavLink[]
  serviceStatus: ServiceStatus
  maintenance: {
    title: string
    message: string
    until?: string
    maintenanceEnabled: boolean
  }
}

interface PaginatedData<T> {
  data: T[]
  meta?: PaginationMeta
}

export async function fetchSiteSettings(): Promise<SiteSettingsBundle> {
  const setting: Record<string, any> | null = await strapiSingle<Record<string, any>>('/site-setting', {
    populate: '*'
  })

  if (!setting) {
    throw createError({ statusCode: 503, statusMessage: '站点配置不存在' })
  }

  const site: SiteInfo = {
    name: stringValue(setting.name),
    shortName: stringValue(setting.shortName),
    englishName: stringValue(setting.englishName),
    logoText: stringValue(setting.logoText),
    logoImage: setting.logoImage ? mediaUrl(setting.logoImage) : undefined,
    copyright: stringValue(setting.copyright),
    credit: stringValue(setting.credit),
    socials: arrayValue<string>(setting.socials),
    skinConsoleUrl: stringValue(setting.skinConsoleUrl),
    documentCenterUrl: stringValue(setting.documentCenterUrl) || undefined
  }

  const navigation = arrayValue<Record<string, string>>(setting.navigation).map<NavLink>((item) => ({
    label: stringValue(item.label),
    href: stringValue(item.href)
  }))

  const serviceStatus: ServiceStatus = {
    label: stringValue(setting.serviceStatusLabel),
    href: stringValue(setting.serviceStatusHref || '/maintenance'),
    services: arrayValue<Record<string, any>>(setting.serviceStatusServices).map((item) => ({
      name: stringValue(item.name),
      status: enumValue(item.status, ['online', 'maintenance', 'offline'] as const, 'offline')
    }))
  }

  return {
    site,
    navigation,
    serviceStatus,
    maintenance: {
      title: stringValue(setting.maintenanceTitle || '社团服务维护中'),
      message: stringValue(setting.maintenanceMessage || '服务暂时不可用，请稍后再试。'),
      until: typeof setting.maintenanceUntil === 'string' ? setting.maintenanceUntil : undefined,
      maintenanceEnabled: Boolean(setting.maintenanceEnabled)
    }
  }
}

export async function fetchHomeData(): Promise<HomeData> {
  const [{ site, navigation, serviceStatus }, homePage, activities, announcements, posts, members, gallery] = await Promise.all([
    fetchSiteSettings(),
    strapiSingle<Record<string, any>>('/home-page', homePopulateQuery()),
    fetchActivities({ page: 1, pageSize: 4, featuredOnly: true }),
    fetchAnnouncements({ page: 1, pageSize: 3 }),
    fetchPosts({ page: 1, pageSize: 4, featuredOnly: true }),
    fetchMembers(),
    fetchGalleryItems({ pageSize: 8 })
  ])

  if (!homePage) {
    throw createError({ statusCode: 503, statusMessage: '首页配置不存在' })
  }

  return {
    site,
    navigation,
    serviceStatus,
    hero: {
      eyebrow: stringValue(homePage.heroEyebrow),
      titleLines: arrayValue<Record<string, string>>(homePage.heroTitleLines).map((item) => stringValue(item.value)),
      highlightText: stringValue(homePage.heroHighlightText),
      subtitle: stringValue(homePage.heroSubtitle),
      description: stringValue(homePage.heroDescription),
      slides: arrayValue<Record<string, any>>(homePage.heroSlides).map<HeroSlide>((slide) => ({
        background: slide.background ? mediaUrl(slide.background) : '',
        contentAlign: enumValue(slide.contentAlign, ['left', 'right', 'bottom'] as const, 'right'),
        contentPosition: enumValue(
          slide.contentPosition,
          ['left-top', 'right-top', 'left-center', 'right-center', 'left-bottom', 'right-bottom', 'bottom-bar'] as const,
          'right-top'
        ),
        contentStyle: enumValue(slide.contentStyle, ['full', 'minimal'] as const, 'minimal'),
        textStyle: enumValue(slide.textStyle, ['outlined', 'bottomBar', 'compactOverlay'] as const, 'outlined'),
        overlayStrength: enumValue(slide.overlayStrength, ['none', 'soft', 'medium', 'strong'] as const, 'medium'),
        textWidth: enumValue(slide.textWidth, ['small', 'medium', 'large'] as const, 'medium'),
        tone: enumValue(slide.tone, ['light', 'dark'] as const, 'light'),
        backgroundPosition: stringValue(slide.backgroundPosition || 'center center')
      })),
      carouselInterval: numberValue(homePage.carouselInterval, 6000)
    },
    intro: {
      title: stringValue(homePage.intro?.title),
      body: stringValue(homePage.intro?.body),
      image: mediaRef(homePage.intro?.image),
      linkLabel: stringValue(homePage.intro?.linkLabel),
      tags: arrayValue<string>(homePage.intro?.tags)
    },
    activities: activities.data,
    announcements: announcements.data,
    posts: posts.data,
    members,
    gallery,
    server: normalizeServer(homePage.server)
  }
}

export async function fetchAboutPage(): Promise<AboutPageData> {
  const page = await strapiSingle<Record<string, any>>('/about-page', {
    populate: '*'
  })

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: '社团介绍不存在' })
  }

  return {
    title: stringValue(page.title),
    summary: stringValue(page.summary),
    coverImage: mediaRef(page.coverImage),
    content: stringValue(page.content),
    groups: arrayValue<Record<string, string>>(page.groups).map((item) => ({
      name: stringValue(item.name),
      summary: stringValue(item.summary)
    })),
    serverSummary: stringValue(page.serverSummary),
    joinGuide: stringValue(page.joinGuide)
  }
}

export async function fetchJoinPage(): Promise<JoinPageData> {
  const page = await strapiSingle<Record<string, any>>('/join-page', {
    populate: '*'
  })

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: '加入我们页面不存在' })
  }

  return {
    title: stringValue(page.title),
    summary: stringValue(page.summary),
    coverImage: mediaRef(page.coverImage),
    introContent: stringValue(page.introContent),
    requirements: arrayValue<Record<string, string>>(page.requirements).map((item) => stringValue(item.value)),
    processSteps: arrayValue<Record<string, string>>(page.processSteps).map((item) => ({
      title: stringValue(item.title),
      summary: stringValue(item.summary)
    })),
    contactMethods: arrayValue<Record<string, string>>(page.contactMethods).map((item) => ({
      label: stringValue(item.label),
      value: stringValue(item.value)
    })),
    faqItems: arrayValue<Record<string, string>>(page.faqItems).map((item) => ({
      question: stringValue(item.question),
      answer: stringValue(item.answer)
    })),
    applicationUrl: page.applicationUrl || undefined,
    serverJoinGuide: stringValue(page.serverJoinGuide)
  }
}

export async function fetchActivities(options: {
  page?: number
  pageSize?: number
  status?: string
  featuredOnly?: boolean
} = {}): Promise<PaginatedData<ActivitySummary>> {
  const query: StrapiQuery = {
    ...paginationQuery(options.page, options.pageSize),
    ...activityPopulateQuery(),
    'sort[0]': 'startTime:desc'
  }

  if (options.status) {
    query['filters[status][$eq]'] = options.status
  }

  if (options.featuredOnly) {
    query['filters[isFeatured][$eq]'] = true
  }

  const response: StrapiListResponse<Record<string, any>> = await strapiList<Record<string, any>>('/activities', query)

  return {
    data: response.data.map(normalizeActivity),
    meta: response.meta?.pagination
  }
}

export async function fetchActivityBySlug(slug: string): Promise<ActivitySummary | null> {
  const response: StrapiListResponse<Record<string, any>> = await strapiList<Record<string, any>>('/activities', {
    ...activityPopulateQuery(),
    'filters[slug][$eq]': slug,
    'pagination[pageSize]': 1
  })

  return response.data[0] ? normalizeActivity(response.data[0]) : null
}

export async function fetchAnnouncements(options: { page?: number; pageSize?: number; category?: string } = {}): Promise<PaginatedData<AnnouncementSummary>> {
  const query: StrapiQuery = {
    ...paginationQuery(options.page, options.pageSize),
    populate: 'attachments',
    'sort[0]': 'isPinned:desc',
    'sort[1]': 'publishedAt:desc'
  }

  if (options.category) {
    query['filters[category][$eq]'] = options.category
  }

  const response: StrapiListResponse<Record<string, any>> = await strapiList<Record<string, any>>('/announcements', query)

  return {
    data: response.data.map(normalizeAnnouncement),
    meta: response.meta?.pagination
  }
}

export async function fetchAnnouncementBySlug(slug: string): Promise<AnnouncementSummary | null> {
  const response: StrapiListResponse<Record<string, any>> = await strapiList<Record<string, any>>('/announcements', {
    populate: 'attachments',
    'filters[slug][$eq]': slug,
    'pagination[pageSize]': 1
  })

  return response.data[0] ? normalizeAnnouncement(response.data[0]) : null
}

export async function fetchPosts(options: {
  page?: number
  pageSize?: number
  category?: string
  tag?: string
  featuredOnly?: boolean
} = {}): Promise<PaginatedData<PostSummary>> {
  const query: StrapiQuery = {
    ...paginationQuery(options.page, options.pageSize),
    ...postPopulateQuery(),
    'sort[0]': 'publishedAt:desc'
  }

  if (options.category) {
    query['filters[category][$eq]'] = options.category
  }

  if (options.tag) {
    query['filters[tags][name][$eq]'] = options.tag
  }

  if (options.featuredOnly) {
    query['filters[isFeatured][$eq]'] = true
  }

  const response: StrapiListResponse<Record<string, any>> = await strapiList<Record<string, any>>('/club-posts', query)

  return {
    data: response.data.map(normalizePost),
    meta: response.meta?.pagination
  }
}

export async function fetchPostBySlug(slug: string): Promise<PostSummary | null> {
  const response: StrapiListResponse<Record<string, any>> = await strapiList<Record<string, any>>('/club-posts', {
    ...postPopulateQuery(),
    'filters[slug][$eq]': slug,
    'pagination[pageSize]': 1
  })

  return response.data[0] ? normalizePost(response.data[0]) : null
}

export async function fetchMembers(): Promise<MemberProfile[]> {
  const response: StrapiListResponse<Record<string, any>> = await strapiList<Record<string, any>>('/member-profiles', {
    'populate[0]': 'avatar',
    'populate[1]': 'skinImage',
    'filters[isVisible][$eq]': true,
    'sort[0]': 'sortOrder:asc',
    'pagination[pageSize]': 100
  })

  return response.data.map(normalizeMember)
}

export async function fetchGalleryItems(options: { pageSize?: number } = {}): Promise<GalleryItem[]> {
  const response: StrapiListResponse<Record<string, any>> = await strapiList<Record<string, any>>('/gallery-items', {
    populate: 'image',
    'sort[0]': 'sortOrder:asc',
    'pagination[pageSize]': options.pageSize ?? 100
  })

  return response.data.map(normalizeGalleryItem)
}

async function strapiList<T>(path: string, query: StrapiQuery = {}): Promise<StrapiListResponse<T>> {
  return strapiFetch<StrapiListResponse<T>>(path, query)
}

async function strapiSingle<T>(path: string, query: StrapiQuery = {}): Promise<T | null> {
  const response: StrapiSingleResponse<T> = await strapiFetch<StrapiSingleResponse<T>>(path, query)
  return response.data
}

async function strapiFetch<T>(path: string, query: StrapiQuery = {}): Promise<T> {
  const config = useRuntimeConfig()
  const baseUrl = stripTrailingSlash(config.strapiUrl || 'http://localhost:1337')
  const token = config.strapiApiToken

  const response = await $fetch<T>(`${baseUrl}/api${path}`, {
    query,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  })

  return response as T
}

function normalizeActivity(item: Record<string, any>): ActivitySummary {
  return {
    title: stringValue(item.title),
    slug: stringValue(item.slug),
    summary: stringValue(item.summary),
    content: stringValue(item.content),
    coverImage: mediaRef(item.coverImage),
    gallery: arrayValue<StrapiMedia>(item.gallery).map(mediaRef),
    startTime: stringValue(item.startTime),
    endTime: item.endTime || undefined,
    location: item.location || undefined,
    status: enumValue(item.status, ['upcoming', 'ongoing', 'ended', 'cancelled'] as const, 'upcoming'),
    signupUrl: item.signupUrl || undefined,
    isFeatured: Boolean(item.isFeatured),
    publishedAt: stringValue(item.publishedAt || item.createdAt)
  }
}

function normalizeAnnouncement(item: Record<string, any>): AnnouncementSummary {
  return {
    title: stringValue(item.title),
    slug: stringValue(item.slug),
    category: stringValue(item.category),
    summary: stringValue(item.summary),
    content: stringValue(item.content),
    attachments: arrayValue<Record<string, any>>(item.attachments).map((attachment) => ({
      label: stringValue(attachment.label),
      url: stringValue(attachment.file?.url ? mediaUrl(attachment.file) : attachment.url)
    })),
    isPinned: Boolean(item.isPinned),
    publishedAt: stringValue(item.publishedAt || item.createdAt)
  }
}

function normalizePost(item: Record<string, any>): PostSummary {
  return {
    title: stringValue(item.title),
    slug: stringValue(item.slug),
    summary: stringValue(item.summary),
    content: stringValue(item.content),
    coverImage: item.coverImage ? mediaRef(item.coverImage) : undefined,
    gallery: arrayValue<StrapiMedia>(item.gallery).map(mediaRef),
    authorName: stringValue(item.authorName),
    category: stringValue(item.category),
    tags: arrayValue<Record<string, string>>(item.tags).map((tag) => stringValue(tag.name)),
    isFeatured: Boolean(item.isFeatured),
    publishedAt: stringValue(item.publishedAt || item.createdAt)
  }
}

function normalizeMember(item: Record<string, any>): MemberProfile {
  return {
    displayName: stringValue(item.displayName),
    slug: stringValue(item.slug),
    avatar: item.avatar ? mediaRef(item.avatar) : undefined,
    skinImage: item.skinImage ? mediaRef(item.skinImage) : undefined,
    group: stringValue(item.group),
    roleTitle: stringValue(item.roleTitle),
    bio: stringValue(item.bio),
    works: arrayValue<string>(item.works),
    sortOrder: numberValue(item.sortOrder),
    isVisible: Boolean(item.isVisible)
  }
}

function normalizeGalleryItem(item: Record<string, any>): GalleryItem {
  return {
    title: stringValue(item.title),
    tag: stringValue(item.tag),
    image: mediaRef(item.image)
  }
}

function normalizeServer(item: Record<string, any>): ServerInfo {
  return {
    title: stringValue(item?.title),
    name: stringValue(item?.name),
    status: stringValue(item?.status),
    ip: stringValue(item?.ip),
    version: stringValue(item?.version),
    mode: stringValue(item?.mode),
    online: numberValue(item?.online),
    capacity: numberValue(item?.capacity)
  }
}

function homePopulateQuery(): StrapiQuery {
  return {
    'populate[heroTitleLines]': true,
    'populate[heroSlides][populate]': 'background',
    'populate[intro][populate]': 'image',
    'populate[server]': true
  }
}

function activityPopulateQuery(): StrapiQuery {
  return {
    'populate[0]': 'coverImage',
    'populate[1]': 'gallery',
    'populate[2]': 'tags'
  }
}

function postPopulateQuery(): StrapiQuery {
  return {
    'populate[0]': 'coverImage',
    'populate[1]': 'gallery',
    'populate[2]': 'tags'
  }
}

function paginationQuery(page = 1, pageSize = 10): StrapiQuery {
  return {
    'pagination[page]': page,
    'pagination[pageSize]': pageSize
  }
}

function mediaRef(media?: StrapiMedia | null): ImageRef {
  return {
    src: mediaUrl(media),
    alt: stringValue(media?.alternativeText || media?.caption || media?.name)
  }
}

function mediaUrl(media?: StrapiMedia | string | null) {
  if (typeof media === 'string') {
    return absoluteUrl(media)
  }

  return absoluteUrl(media?.url || '')
}

function absoluteUrl(url: string) {
  if (!url) {
    return ''
  }

  if (/^https?:\/\//.test(url)) {
    return url
  }

  const config = useRuntimeConfig()
  return `${stripTrailingSlash(config.strapiUrl || 'http://localhost:1337')}${url}`
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, '')
}

function arrayValue<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : []
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && allowed.includes(value as T) ? value as T : fallback
}
