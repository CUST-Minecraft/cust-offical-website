export type ApiResponse<T> =
  | { success: true; data: T; meta?: Record<string, unknown> | PaginationMeta }
  | { success: false; error: { code: string; message: string } }

export interface PaginationMeta {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface SiteInfo {
  name: string
  shortName: string
  englishName: string
  logoText: string
  logoImage?: string
  copyright: string
  credit: string
  socials: string[]
  skinConsoleUrl: string
  documentCenterUrl?: string
}

export interface NavLink {
  label: string
  href: string
}

export interface HeroSlide {
  background: string
  contentAlign: 'left' | 'right' | 'bottom'
  contentPosition?: 'left-top' | 'right-top' | 'left-center' | 'right-center' | 'left-bottom' | 'right-bottom' | 'bottom-bar'
  contentStyle?: 'full' | 'minimal'
  textStyle: 'outlined' | 'bottomBar' | 'compactOverlay'
  overlayStrength: 'none' | 'soft' | 'medium' | 'strong'
  textWidth: 'small' | 'medium' | 'large'
  tone: 'light' | 'dark'
  backgroundPosition: string
}

export interface HomeHero {
  eyebrow: string
  titleLines: string[]
  highlightText: string
  subtitle: string
  description: string
  slides: HeroSlide[]
  carouselInterval: number
}

export interface ImageRef {
  src: string
  alt: string
}

export interface ActivitySummary {
  title: string
  slug: string
  summary: string
  content: string
  coverImage: ImageRef
  gallery: ImageRef[]
  startTime: string
  endTime?: string
  location?: string
  status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled'
  signupUrl?: string
  isFeatured: boolean
  publishedAt: string
}

export interface AnnouncementSummary {
  title: string
  slug: string
  category: string
  summary: string
  content: string
  attachments: { label: string; url: string }[]
  isPinned: boolean
  publishedAt: string
}

export interface PostSummary {
  title: string
  slug: string
  summary: string
  content: string
  coverImage?: ImageRef
  gallery: ImageRef[]
  authorName: string
  category: string
  tags: string[]
  isFeatured: boolean
  publishedAt: string
}

export interface MemberProfile {
  displayName: string
  slug: string
  avatar?: ImageRef
  skinImage?: ImageRef
  group: string
  roleTitle: string
  bio: string
  works: string[]
  sortOrder: number
  isVisible: boolean
}

export interface GalleryItem {
  title: string
  tag: string
  image: ImageRef
}

export interface PromoSection {
  title: string
  body: string
  image: ImageRef
  linkLabel: string
  tags?: string[]
}

export interface ServerInfo {
  title: string
  name: string
  status: string
  ip: string
  version: string
  mode: string
  online: number
  capacity: number
}

export interface ServiceStatus {
  label: string
  href: string
  services: { name: string; status: 'online' | 'maintenance' | 'offline' }[]
}

export interface HomeData {
  site: SiteInfo
  navigation: NavLink[]
  hero: HomeHero
  intro: PromoSection
  activities: ActivitySummary[]
  announcements: AnnouncementSummary[]
  posts: PostSummary[]
  members: MemberProfile[]
  gallery: GalleryItem[]
  server: ServerInfo
  serviceStatus: ServiceStatus
}

export interface AboutPageData {
  title: string
  summary: string
  coverImage: ImageRef
  content: string
  groups: { name: string; summary: string }[]
  serverSummary: string
  joinGuide: string
}

export interface JoinPageData {
  title: string
  summary: string
  coverImage: ImageRef
  introContent: string
  requirements: string[]
  processSteps: { title: string; summary: string }[]
  contactMethods: { label: string; value: string }[]
  faqItems: { question: string; answer: string }[]
  applicationUrl?: string
  serverJoinGuide: string
}
