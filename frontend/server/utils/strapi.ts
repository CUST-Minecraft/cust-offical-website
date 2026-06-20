import type {
  AboutPageData,
  AboutSection,
  AboutSectionItem,
  AboutSectionLink,
  AboutSectionType,
  ActivitySummary,
  AnnouncementSummary,
  ExternalService,
  GalleryItem,
  FooterLinkIcon,
  HeroSlide,
  HomeData,
  ImageRef,
  JoinPageData,
  JoinProcessStep,
  MaintenancePageData,
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
  externalServices: ExternalService[]
  serviceStatus: ServiceStatus
  maintenance: MaintenancePageData
}

interface PaginatedData<T> {
  data: T[]
  meta?: PaginationMeta
}

export async function fetchSiteSettings(): Promise<SiteSettingsBundle> {
  const [setting, externalServices, maintenance] = await Promise.all([
    strapiSingle<Record<string, any>>('/site-setting', {
      populate: '*'
    }),
    fetchExternalServices(),
    fetchMaintenancePage()
  ])

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
    footerAboutLinks: normalizeFooterLinks(setting.footerAboutLinks)
  }

  const navigation = arrayValue<Record<string, string>>(setting.navigation).map<NavLink>((item) => ({
    label: stringValue(item.label),
    href: stringValue(item.href)
  }))

  return {
    site,
    navigation,
    externalServices,
    serviceStatus: maintenance.serviceStatus,
    maintenance
  }
}

export async function fetchExternalServices(): Promise<ExternalService[]> {
  const response: StrapiListResponse<Record<string, any>> = await strapiList<Record<string, any>>('/external-services', {
    'sort[0]': 'sortOrder:asc',
    'pagination[pageSize]': 100
  })

  return response.data.map(normalizeExternalService).sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function fetchMaintenancePage(): Promise<MaintenancePageData> {
  const page = await strapiSingle<Record<string, any>>('/maintenance-page', {
    populate: '*'
  })

  if (!page) {
    return defaultMaintenancePage(false)
  }

  return normalizeMaintenancePage(page)
}

export async function fetchHomeData(): Promise<HomeData> {
  const [{ site, navigation, externalServices, serviceStatus }, homePage, activities, announcements, posts, members, gallery] = await Promise.all([
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

  const featuredActivities = normalizeFeaturedItems(homePage.featuredActivities, normalizeActivity)
  const featuredAnnouncements = normalizeFeaturedItems(homePage.featuredAnnouncements, normalizeAnnouncement)
  const featuredPosts = normalizeFeaturedItems(homePage.featuredPosts, normalizePost)
  const featuredMembers = normalizeFeaturedItems(homePage.featuredMembers, normalizeMember).filter((member) => member.isVisible)
  const featuredGallery = normalizeFeaturedItems(homePage.galleryItems, normalizeGalleryItem).filter((item) => item.image.src)

  return {
    site,
    navigation,
    externalServices,
    serviceStatus,
    hero: {
      eyebrow: stringValue(homePage.heroEyebrow),
      titleLines: arrayValue<Record<string, string>>(homePage.heroTitleLines).map((item) => stringValue(item.value)),
      highlightText: stringValue(homePage.heroHighlightText),
      subtitle: stringValue(homePage.heroSubtitle),
      description: stringValue(homePage.heroDescription),
      slides: normalizeHeroSlides(homePage.heroSlides),
      carouselInterval: numberValue(homePage.carouselInterval, 6000)
    },
    intro: {
      title: stringValue(homePage.intro?.title),
      body: stringValue(homePage.intro?.body),
      image: mediaRef(homePage.intro?.image),
      linkLabel: stringValue(homePage.intro?.linkLabel),
      tags: arrayValue<string>(homePage.intro?.tags)
    },
    activities: preferFeatured(featuredActivities, activities.data),
    announcements: preferFeatured(featuredAnnouncements, announcements.data),
    posts: preferFeatured(featuredPosts, posts.data),
    members: preferFeatured(featuredMembers, members),
    gallery: preferFeatured(featuredGallery, gallery),
    server: normalizeServer(homePage.server)
  }
}

export async function fetchAboutPage(): Promise<AboutPageData> {
  const page = await fetchAboutPageSource()

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: '社团介绍不存在' })
  }

  const title = stringValue(page.title)
  const summary = stringValue(page.summary)
  const coverImage = mediaRef(page.coverImage)
  const content = stringValue(page.content)
  const groups = arrayValue<Record<string, string>>(page.groups).map((item) => ({
    name: stringValue(item.name),
    summary: stringValue(item.summary)
  }))

  return {
    title,
    summary,
    coverImage,
    sections: normalizeAboutSections(page.sections, {
      title,
      summary,
      coverImage,
      content,
      groups
    }),
    content,
    groups,
    serverSummary: stringValue(page.serverSummary),
    joinGuide: stringValue(page.joinGuide)
  }
}

async function fetchAboutPageSource() {
  try {
    return await strapiSingle<Record<string, any>>('/about-page', aboutPopulateQuery())
  } catch (error) {
    if (!isAboutPopulateMigrationError(error)) {
      throw error
    }

    return strapiSingle<Record<string, any>>('/about-page', { populate: '*' })
  }
}

export async function fetchJoinPage(): Promise<JoinPageData> {
  const page = await fetchJoinPageSource()

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: '加入我们页面不存在' })
  }

  return {
    title: stringValue(page.title),
    summary: stringValue(page.summary),
    coverImage: mediaRef(page.coverImage),
    introContent: stringValue(page.introContent),
    requirements: arrayValue<Record<string, string>>(page.requirements).map((item) => stringValue(item.value)),
    processSteps: arrayValue<Record<string, any>>(page.processSteps).map(normalizeJoinProcessStep),
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

async function fetchJoinPageSource() {
  try {
    return await strapiSingle<Record<string, any>>('/join-page', joinPopulateQuery())
  } catch (error) {
    if (!isJoinPopulateMigrationError(error)) {
      throw error
    }

    return strapiSingle<Record<string, any>>('/join-page', { populate: '*' })
  }
}

function normalizeJoinProcessStep(item: Record<string, any>): JoinProcessStep {
  const image = item.image ? mediaRef({
    ...item.image,
    alternativeText: item.imageAlt || item.image.alternativeText
  }) : undefined
  const primaryActionUrl = stringValue(item.primaryActionUrl).trim()

  return {
    title: stringValue(item.title),
    summary: stringValue(item.summary),
    items: arrayValue<Record<string, string>>(item.items).map((entry) => stringValue(entry.value)).filter(Boolean),
    image,
    imageCaption: stringValue(item.imageCaption) || undefined,
    primaryActionLabel: stringValue(item.primaryActionLabel) || undefined,
    primaryActionUrl: primaryActionUrl || undefined
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
    endTime: stringValue(item.endTime) || undefined,
    location: stringValue(item.location) || undefined,
    status: enumValue(item.status, ['upcoming', 'ongoing', 'ended', 'cancelled'] as const, 'upcoming'),
    signupUrl: stringValue(item.signupUrl) || undefined,
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

function normalizeFeaturedItems<T>(value: unknown, normalize: (item: Record<string, any>) => T): T[] {
  return arrayValue<Record<string, any>>(value)
    .map(normalize)
    .filter(hasContentIdentity)
}

function hasContentIdentity<T>(item: T) {
  if (typeof item !== 'object' || !item) {
    return false
  }

  const record = item as Record<string, unknown>
  return Boolean(record.slug || record.title || record.displayName)
}

function normalizeHeroSlides(value: unknown): HeroSlide[] {
  const slides = arrayValue<Record<string, any>>(value)
    .map(normalizeHeroSlide)
    .filter((slide) => slide.background)

  return slides.length ? slides : [defaultHeroSlide()]
}

function normalizeHeroSlide(slide: Record<string, any>): HeroSlide {
  return {
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
    overlayMode: enumValue(slide.overlayMode, ['side', 'local', 'corner', 'edge', 'none'] as const, 'side'),
    overlayAnchor: enumValue(slide.overlayAnchor, ['left-top', 'right-top', 'left-bottom', 'right-bottom'] as const, 'right-top'),
    textWidth: enumValue(slide.textWidth, ['small', 'medium', 'large'] as const, 'medium'),
    tone: enumValue(slide.tone, ['light', 'dark'] as const, 'light'),
    backgroundPosition: stringValue(slide.backgroundPosition || 'center center'),
    photoLocation: stringValue(slide.photoLocation),
    photoAuthor: stringValue(slide.photoAuthor),
    photoCaptionPosition: enumValue(
      slide.photoCaptionPosition,
      ['auto', 'left-top', 'right-top', 'left-bottom', 'right-bottom'] as const,
      'auto'
    )
  }
}

function defaultHeroSlide(): HeroSlide {
  return {
    background: '/example-assets/hero-campus.png',
    contentAlign: 'right',
    contentPosition: 'right-top',
    contentStyle: 'minimal',
    textStyle: 'outlined',
    overlayStrength: 'medium',
    overlayMode: 'side',
    overlayAnchor: 'right-top',
    textWidth: 'medium',
    tone: 'light',
    backgroundPosition: 'center center',
    photoLocation: '',
    photoAuthor: '',
    photoCaptionPosition: 'auto'
  }
}

function normalizeAboutSections(value: unknown, fallback: {
  title: string
  summary: string
  coverImage: ImageRef
  content: string
  groups: { name: string; summary: string }[]
}): AboutSection[] {
  const sections = arrayValue<Record<string, any>>(value)
    .map(normalizeAboutSection)
    .filter((section) => section.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  if (sections.length > 0) {
    return dedupeAboutSections(sections)
  }

  return defaultAboutSections(fallback)
}

function normalizeAboutSection(item: Record<string, any>): AboutSection {
  return {
    sectionType: enumValue(item.sectionType, ['hero', 'origin', 'actions', 'directions', 'next'] as const, 'origin'),
    eyebrow: stringValue(item.eyebrow) || undefined,
    title: stringValue(item.title),
    summary: stringValue(item.summary) || undefined,
    content: stringValue(item.content) || undefined,
    image: item.image ? mediaRef({
      ...item.image,
      alternativeText: item.imageAlt || item.image.alternativeText
    }) : undefined,
    items: arrayValue<Record<string, any>>(item.items)
      .map(normalizeAboutSectionItem)
      .filter((entry) => entry.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    links: arrayValue<Record<string, any>>(item.links)
      .map(normalizeAboutSectionLink)
      .filter((entry) => entry.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    sortOrder: numberValue(item.sortOrder),
    enabled: item.enabled !== false
  }
}

function normalizeAboutSectionItem(item: Record<string, any>): AboutSectionItem {
  return {
    title: stringValue(item.title),
    summary: stringValue(item.summary),
    code: stringValue(item.code) || undefined,
    icon: stringValue(item.icon) || undefined,
    image: item.image ? mediaRef({
      ...item.image,
      alternativeText: item.imageAlt || item.image.alternativeText
    }) : undefined,
    sortOrder: numberValue(item.sortOrder),
    enabled: item.enabled !== false
  }
}

function normalizeAboutSectionLink(item: Record<string, any>): AboutSectionLink {
  return {
    label: stringValue(item.label),
    summary: stringValue(item.summary) || undefined,
    href: stringValue(item.href),
    code: stringValue(item.code) || undefined,
    openInNewTab: Boolean(item.openInNewTab),
    sortOrder: numberValue(item.sortOrder),
    enabled: item.enabled !== false
  }
}

function dedupeAboutSections(sections: AboutSection[]): AboutSection[] {
  const seen = new Set<AboutSectionType>()

  return sections.filter((section) => {
    if (seen.has(section.sectionType)) {
      return false
    }

    seen.add(section.sectionType)
    return true
  })
}

function defaultAboutSections(fallback: {
  title: string
  summary: string
  coverImage: ImageRef
  content: string
  groups: { name: string; summary: string }[]
}): AboutSection[] {
  const directions = fallback.groups.length > 0
    ? fallback.groups.map<AboutSectionItem>((group, index) => ({
        code: String(index + 1).padStart(2, '0'),
        title: group.name,
        summary: group.summary,
        sortOrder: (index + 1) * 10,
        enabled: true
      }))
    : [
        { code: '01', title: '建筑组', summary: '负责校园复刻、主城规划和场景搭建。', sortOrder: 10, enabled: true },
        { code: '02', title: '红石组', summary: '研究机关、自动化和有趣的互动结构。', sortOrder: 20, enabled: true },
        { code: '03', title: '活动组', summary: '策划比赛、挑战赛、合影和节日活动。', sortOrder: 30, enabled: true },
        { code: '04', title: '运维组', summary: '维护服务器、备份地图和整理新手体验。', sortOrder: 40, enabled: true }
      ]

  return [
    {
      sectionType: 'hero',
      eyebrow: '认识我们',
      title: fallback.title && fallback.title !== '社团介绍' ? fallback.title : '长春理工大学 Minecraft 社团',
      summary: fallback.summary,
      image: fallback.coverImage,
      items: [],
      links: [],
      sortOrder: 10,
      enabled: true
    },
    {
      sectionType: 'origin',
      eyebrow: '我们的起点',
      title: '从喜欢 Minecraft，到一起创造校园记忆',
      content: fallback.content,
      items: [
        { title: '校园', summary: '熟悉的地方', sortOrder: 10, enabled: true },
        { title: '创作', summary: '共同的作品', sortOrder: 20, enabled: true },
        { title: '朋友', summary: '一起的时光', sortOrder: 30, enabled: true }
      ],
      links: [],
      sortOrder: 20,
      enabled: true
    },
    {
      sectionType: 'actions',
      eyebrow: '我们的行动',
      title: '把想法变成可以走进去的作品',
      items: [
        {
          code: '01',
          title: '校园复刻',
          summary: '把熟悉的校门、道路、建筑和日常路线，用方块重新组织成可以参观和继续扩展的校园记忆。',
          sortOrder: 10,
          enabled: true
        },
        {
          code: '02',
          title: '服务器共建',
          summary: '一起整理公共区域、规划路线、维护地图体验，让服务器更像一个可以长期生活的共同空间。',
          sortOrder: 20,
          enabled: true
        },
        {
          code: '03',
          title: '活动与创作',
          summary: '围绕建筑赛、生存挑战、合影记录和成员作品，把一次次游玩沉淀成社团故事。',
          sortOrder: 30,
          enabled: true
        }
      ],
      links: [],
      sortOrder: 30,
      enabled: true
    },
    {
      sectionType: 'directions',
      eyebrow: '我们的方向',
      title: '从一个感兴趣的方向开始',
      items: directions,
      links: [],
      sortOrder: 40,
      enabled: true
    },
    {
      sectionType: 'next',
      eyebrow: '继续了解',
      title: '看看你想从哪里继续',
      summary: '如果这个方块世界让你有点好奇，可以继续了解加入方式、近期活动，或看看公开社员介绍。',
      items: [],
      links: [
        { code: '01', label: '加入我们', summary: '了解加入方式和参与起点', href: '/join', openInNewTab: false, sortOrder: 10, enabled: true },
        { code: '02', label: '社团活动', summary: '看看近期和历史活动', href: '/activities', openInNewTab: false, sortOrder: 20, enabled: true },
        { code: '03', label: '社员介绍', summary: '认识公开展示的社员与作品', href: '/members', openInNewTab: false, sortOrder: 30, enabled: true }
      ],
      sortOrder: 50,
      enabled: true
    }
  ]
}

function normalizeExternalService(item: Record<string, any>): ExternalService {
  const url = stringValue(item.url).trim()

  return {
    name: stringValue(item.name),
    key: stringValue(item.key),
    summary: stringValue(item.summary),
    url: url || undefined,
    icon: enumValue(item.icon, ['skin', 'docs', 'mua', 'agent', 'external'] as const, 'external'),
    category: enumValue(item.category, ['official', 'partner', 'tool'] as const, 'official'),
    enabled: Boolean(item.enabled),
    disabledReason: stringValue(item.disabledReason) || undefined,
    external: Boolean(item.external),
    openInNewTab: Boolean(item.openInNewTab),
    showInHeader: Boolean(item.showInHeader),
    showInWorkbench: Boolean(item.showInWorkbench),
    showInFooter: Boolean(item.showInFooter),
    showInSearch: Boolean(item.showInSearch),
    sortOrder: numberValue(item.sortOrder)
  }
}

function normalizeMaintenancePage(page: Record<string, any>): MaintenancePageData {
  return {
    title: stringValue(page.title || '社团官网维护中'),
    message: stringValue(page.message || '内容服务暂时不可用，请稍后再试。'),
    until: typeof page.until === 'string' ? page.until : undefined,
    maintenanceEnabled: Boolean(page.enabled),
    serviceStatus: {
      label: stringValue(page.serviceStatusLabel || '社团服务状态'),
      href: stringValue(page.serviceStatusHref || '/maintenance'),
      services: arrayValue<Record<string, any>>(page.serviceStatusServices).map((item) => ({
        name: stringValue(item.name),
        status: enumValue(item.status, ['online', 'maintenance', 'offline'] as const, 'offline')
      }))
    }
  }
}

export function defaultMaintenancePage(maintenanceEnabled = true): MaintenancePageData {
  return {
    title: '社团官网维护中',
    message: '内容服务暂时不可用，请稍后再试。',
    maintenanceEnabled,
    serviceStatus: {
      label: '社团服务状态',
      href: '/maintenance',
      services: []
    }
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

function normalizeFooterLinks(value: unknown): SiteInfo['footerAboutLinks'] {
  const allowedIcons = ['skin', 'docs', 'mua', 'about', 'join', 'activity', 'member', 'agent', 'external'] as const

  return arrayValue<Record<string, any>>(value)
    .map((item) => ({
      label: stringValue(item.label),
      href: stringValue(item.href),
      icon: isFooterLinkIcon(item.icon, allowedIcons) ? item.icon : undefined,
      external: Boolean(item.external),
      disabled: Boolean(item.disabled)
    }))
    .filter((item) => item.label && item.href)
}

function isFooterLinkIcon(value: unknown, allowedIcons: readonly FooterLinkIcon[]): value is FooterLinkIcon {
  return typeof value === 'string' && allowedIcons.includes(value as FooterLinkIcon)
}

function homePopulateQuery(): StrapiQuery {
  return {
    'populate[heroTitleLines]': true,
    'populate[heroSlides][populate]': 'background',
    'populate[intro][populate]': 'image',
    'populate[server]': true,
    'populate[featuredActivities][populate][0]': 'coverImage',
    'populate[featuredActivities][populate][1]': 'gallery',
    'populate[featuredActivities][populate][2]': 'tags',
    'populate[featuredAnnouncements][populate][attachments][populate]': 'file',
    'populate[featuredPosts][populate][0]': 'coverImage',
    'populate[featuredPosts][populate][1]': 'gallery',
    'populate[featuredPosts][populate][2]': 'tags',
    'populate[featuredMembers][populate][0]': 'avatar',
    'populate[featuredMembers][populate][1]': 'skinImage',
    'populate[galleryItems][populate]': 'image'
  }
}

function preferFeatured<T>(featured: T[], fallback: T[]) {
  return featured.length ? featured : fallback
}

function joinPopulateQuery(): StrapiQuery {
  return {
    'populate[coverImage]': true,
    'populate[requirements]': true,
    'populate[processSteps][populate][items]': true,
    'populate[processSteps][populate][image]': true,
    'populate[contactMethods]': true,
    'populate[faqItems]': true
  }
}

function aboutPopulateQuery(): StrapiQuery {
  return {
    'populate[coverImage]': true,
    'populate[groups]': true,
    'populate[sections][populate][image]': true,
    'populate[sections][populate][items][populate][image]': true,
    'populate[sections][populate][links]': true
  }
}

function isJoinPopulateMigrationError(error: unknown) {
  return isPopulateMigrationError(error, ['processSteps', 'processStep', 'items'])
}

function isAboutPopulateMigrationError(error: unknown) {
  return isPopulateMigrationError(error, ['sections'])
}

function isPopulateMigrationError(error: unknown, fieldNames: string[]) {
  const errorRecord = typeof error === 'object' && error ? error as Record<string, unknown> : {}
  const message = error instanceof Error ? error.message : String(error)
  const details = 'data' in errorRecord ? JSON.stringify(errorRecord.data) : ''
  const statusCode = Number(errorRecord.statusCode || errorRecord.status || errorRecord.statusMessage)
  const haystack = `${message} ${details}`

  return (
    (message.includes('400 Bad Request') || statusCode === 400) &&
    (haystack.includes('Invalid key') || haystack.includes('Invalid parameter')) &&
    fieldNames.some((fieldName) => haystack.includes(fieldName))
  )
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
