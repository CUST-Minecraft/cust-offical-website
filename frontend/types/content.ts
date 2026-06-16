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
  footerAboutLinks: FooterLink[]
}

export type FooterLinkIcon = 'skin' | 'docs' | 'mua' | 'about' | 'join' | 'activity' | 'member' | 'agent' | 'external'

export interface FooterLink {
  label: string
  href: string
  icon?: FooterLinkIcon
  external?: boolean
  disabled?: boolean
}

export interface NavLink {
  label: string
  href: string
}

export type ExternalServiceIcon = 'skin' | 'docs' | 'mua' | 'agent' | 'external'
export type ExternalServiceCategory = 'official' | 'partner' | 'tool'

export interface ExternalService {
  name: string
  key: string
  summary: string
  url?: string
  icon: ExternalServiceIcon
  category: ExternalServiceCategory
  enabled: boolean
  disabledReason?: string
  external: boolean
  openInNewTab: boolean
  showInHeader: boolean
  showInWorkbench: boolean
  showInFooter: boolean
  showInSearch: boolean
  sortOrder: number
}

export interface HeroSlide {
  background: string
  contentAlign: 'left' | 'right' | 'bottom'
  contentPosition?: 'left-top' | 'right-top' | 'left-center' | 'right-center' | 'left-bottom' | 'right-bottom' | 'bottom-bar'
  contentStyle?: 'full' | 'minimal'
  textStyle: 'outlined' | 'bottomBar' | 'compactOverlay'
  overlayStrength: 'none' | 'soft' | 'medium' | 'strong'
  overlayMode: 'side' | 'local' | 'corner' | 'edge' | 'none'
  overlayAnchor?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'
  textWidth: 'small' | 'medium' | 'large'
  tone: 'light' | 'dark'
  backgroundPosition: string
  photoLocation: string
  photoAuthor: string
  photoCaptionPosition: 'auto' | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'
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

export interface MaintenancePageData {
  title: string
  message: string
  until?: string
  maintenanceEnabled: boolean
  serviceStatus: ServiceStatus
}

export interface HomeData {
  site: SiteInfo
  navigation: NavLink[]
  externalServices: ExternalService[]
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

export type AboutSectionType = 'hero' | 'origin' | 'actions' | 'directions' | 'next'

export interface AboutSectionItem {
  title: string
  summary: string
  code?: string
  icon?: string
  image?: ImageRef
  sortOrder: number
  enabled: boolean
}

export interface AboutSectionLink {
  label: string
  summary?: string
  href: string
  code?: string
  openInNewTab: boolean
  sortOrder: number
  enabled: boolean
}

export interface AboutSection {
  sectionType: AboutSectionType
  eyebrow?: string
  title: string
  summary?: string
  content?: string
  image?: ImageRef
  items: AboutSectionItem[]
  links: AboutSectionLink[]
  sortOrder: number
  enabled: boolean
}

export interface AboutPageData {
  title: string
  summary: string
  coverImage: ImageRef
  sections: AboutSection[]
  content: string
  groups: { name: string; summary: string }[]
  serverSummary: string
  joinGuide: string
}

export interface JoinProcessStep {
  title: string
  summary: string
  items: string[]
  image?: ImageRef
  imageCaption?: string
  primaryActionLabel?: string
  primaryActionUrl?: string
}

export interface JoinPageData {
  title: string
  summary: string
  coverImage: ImageRef
  introContent: string
  requirements: string[]
  processSteps: JoinProcessStep[]
  contactMethods: { label: string; value: string }[]
  faqItems: { question: string; answer: string }[]
  applicationUrl?: string
  serverJoinGuide: string
}
