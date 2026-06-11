import type {
  AboutPageData,
  ActivitySummary,
  AnnouncementSummary,
  GalleryItem,
  HomeData,
  JoinPageData,
  MemberAccount,
  MemberProfile,
  MemberService,
  NavLink,
  PostSummary,
  ServiceStatus,
  SiteInfo
} from '~/types/content'

const asset = (name: string) => `/example-assets/${name}`

export const site: SiteInfo = {
  name: '长春理工大学 Minecraft 社团',
  shortName: 'CUSTMC',
  englishName: 'CUST Minecraft Club',
  logoText: 'MC',
  copyright: '© 2024 长春理工大学 Minecraft 社团 | CUST Minecraft Club. All Rights Reserved.',
  credit: 'Design with heart by CUSTMC',
  socials: ['QQ', '群', '帖', '微'],
  skinConsoleUrl: 'https://skin.custmc.example',
  adminConsoleUrl: 'https://cms.custmc.example/admin'
}

export const navigation: NavLink[] = [
  { label: '首页', href: '/' },
  { label: '社团介绍', href: '/about' },
  { label: '社团活动', href: '/activities' },
  { label: '社团公告', href: '/announcements' },
  { label: '社团动态', href: '/posts' },
  { label: '社员介绍', href: '/members' },
  { label: '加入我们', href: '/join' }
]

export const serviceStatus: ServiceStatus = {
  label: '社团服务状态',
  href: '/maintenance',
  services: [
    { name: 'Minecraft 主服务器', status: 'online' },
    { name: '资源下载站', status: 'online' },
    { name: 'QQ 群机器人', status: 'online' },
    { name: '在线地图', status: 'maintenance' }
  ]
}

export const activities: ActivitySummary[] = [
  {
    title: '建筑大赛 · 校园主题',
    slug: 'campus-building-contest',
    summary: '用方块还原你心中的长理校园，优秀作品会进入社团长期展示地图。',
    content: '本次建筑大赛围绕校园主题展开，鼓励社员选择熟悉的教学楼、道路、湖畔、宿舍区或脑海中的未来校园进行创作。活动采用分组协作与个人参赛并行的方式，评审重点包含完成度、结构比例、创意表达和团队协作记录。',
    coverImage: { src: asset('section-events-pixel.png'), alt: '校园主题建筑活动封面' },
    gallery: [
      { src: asset('section-events-pixel.png'), alt: '建筑比赛作品一' },
      { src: asset('cust-campus-hero-wide.png'), alt: '建筑比赛作品二' }
    ],
    startTime: '2026-05-25T19:00:00+08:00',
    endTime: '2026-05-25T22:00:00+08:00',
    location: '社团服务器建筑区',
    status: 'ended',
    signupUrl: 'https://wj.qq.com/example',
    isFeatured: true,
    publishedAt: '2026-05-10T09:00:00+08:00'
  },
  {
    title: '生存挑战赛',
    slug: 'survival-challenge',
    summary: '团队合作，生存到最后，看看谁能在资源有限的世界里把基地撑起来。',
    content: '生存挑战赛将开放限时地图，参赛队伍需要完成资源收集、临时基地建设和阶段任务。活动不追求硬核淘汰，更重视沟通、分工和 Minecraft 机制理解。',
    coverImage: { src: asset('cust-campus-hero-wide.png'), alt: '生存挑战赛封面' },
    gallery: [],
    startTime: '2026-06-01T19:00:00+08:00',
    location: '社团服务器活动服',
    status: 'ended',
    isFeatured: true,
    publishedAt: '2026-05-20T12:00:00+08:00'
  },
  {
    title: '红石科技赛',
    slug: 'redstone-tech-jam',
    summary: '用红石创造无限可能，从自动门到小型机关都可以成为参赛作品。',
    content: '红石科技赛面向所有对自动化、机关和逻辑电路感兴趣的同学。作品可以是实用机器，也可以是好玩的互动装置。新手可以报名体验组，现场会安排社员讲解基础结构。',
    coverImage: { src: asset('cust-main-gate-hero.png'), alt: '红石科技赛封面' },
    gallery: [],
    startTime: '2026-06-18T19:00:00+08:00',
    location: '红石测试世界',
    status: 'upcoming',
    signupUrl: 'https://wj.qq.com/redstone-example',
    isFeatured: true,
    publishedAt: '2026-06-02T12:00:00+08:00'
  },
  {
    title: '暑期服务器共建周',
    slug: 'summer-server-build-week',
    summary: '一起整理道路、公共设施和新手区域，让服务器更像一个能长期生活的世界。',
    content: '暑期共建周会集中处理服务器公共区域更新、路线整理、新手指引与景观细化。无论你擅长建筑、规划、命名还是截图，都可以参与。',
    coverImage: { src: asset('section-gallery-pixel.png'), alt: '服务器共建周封面' },
    gallery: [],
    startTime: '2026-07-08T14:00:00+08:00',
    status: 'upcoming',
    isFeatured: false,
    publishedAt: '2026-06-08T12:00:00+08:00'
  }
]

export const announcements: AnnouncementSummary[] = [
  {
    title: '服务器维护通知',
    slug: 'server-maintenance-june',
    category: '服务器',
    summary: '主服务器将在晚间进行短时维护，期间可能无法进入游戏。',
    content: '为完成插件更新和地图备份，主服务器计划在 6 月 10 日 22:30 至 23:30 进行维护。维护期间官网可正常访问，游戏服务器可能短暂断开。请社员提前保存物品和位置，避免在维护前进行高风险操作。',
    attachments: [{ label: '维护说明 PDF', url: '#' }],
    isPinned: true,
    publishedAt: '2026-06-10T10:00:00+08:00'
  },
  {
    title: '建筑大赛结果公示',
    slug: 'building-contest-results',
    category: '活动',
    summary: '校园主题建筑赛获奖名单已公布，作品将进入精彩瞬间展示。',
    content: '校园主题建筑赛已完成评审。本次活动共收到多组作品，评委从主题表达、结构完成度、创意和协作记录四个维度进行评分。获奖作品后续会整理为图集展示。',
    attachments: [],
    isPinned: false,
    publishedAt: '2026-06-03T16:00:00+08:00'
  },
  {
    title: '社团例会安排',
    slug: 'weekly-meeting-plan',
    category: '社团',
    summary: '本周例会地点与时间确认，会同步讨论后续服务器活动安排。',
    content: '本周例会将讨论近期活动复盘、服务器公共区域建设和暑期招新准备。欢迎对建筑、红石、运维、活动策划感兴趣的同学参加。',
    attachments: [],
    isPinned: false,
    publishedAt: '2026-05-28T19:30:00+08:00'
  }
]

export const posts: PostSummary[] = [
  {
    title: '城市轨道交通建设记录',
    slug: 'city-rail-build-progress',
    summary: '建筑组正在整理城市道路、轨道交通和黄昏灯光，让服务器日常更有生活气息。',
    content: '这次更新聚焦城市交通区域：道路、车站、轨道和高楼灯光被重新梳理，希望玩家从主城出发时能感受到更完整的城市动线。黄昏光照会作为主要氛围参考，方便后续继续扩展街区、站台和活动路线。',
    coverImage: { src: asset('city-rail-dynamics-banner.png'), alt: 'Minecraft 方块风城市轨道交通夜景' },
    gallery: [{ src: asset('city-rail-dynamics-banner.png'), alt: '城市轨道交通建设截图' }],
    authorName: 'Builder',
    category: '服务器日常',
    tags: ['建筑', '交通建设'],
    isFeatured: true,
    publishedAt: '2026-06-06T18:00:00+08:00'
  },
  {
    title: '服务器日常：一次快乐的迷路',
    slug: 'server-daily-lost',
    summary: '从主城出发只想找一点木头，最后发现自己走到了还没命名的新区域。',
    content: 'Minecraft 的快乐经常来自计划之外。本来只是去主城外找点材料，结果一路看风景、修小路、插火把，最后大家决定把那片区域作为新的活动准备区。',
    coverImage: { src: asset('cust-main-gate-hero-atmospheric.png'), alt: '服务器日常截图' },
    gallery: [],
    authorName: 'Explorer',
    category: '服务器日常',
    tags: ['日常', '探索'],
    isFeatured: true,
    publishedAt: '2026-06-04T20:00:00+08:00'
  },
  {
    title: '红石门铃从入门到响起来',
    slug: 'redstone-doorbell-note',
    summary: '红石组整理了一份超短入门记录，适合第一次接触红石机关的同学。',
    content: '这篇记录用最简单的按钮、红石粉、音符盒和中继器做一个门铃。它不复杂，但能让新同学理解信号传递、延迟和可交互结构。',
    coverImage: { src: asset('section-events-pixel.png'), alt: '红石入门封面' },
    gallery: [],
    authorName: 'Redstone',
    category: '教程记录',
    tags: ['红石', '教程'],
    isFeatured: false,
    publishedAt: '2026-05-29T13:00:00+08:00'
  }
]

export const members: MemberProfile[] = [
  {
    displayName: 'Builder',
    slug: 'builder',
    avatar: { src: asset('section-members-pixel.png'), alt: 'Builder 头像' },
    group: '建筑组',
    roleTitle: '校园复刻负责人',
    bio: '喜欢把熟悉的校园空间拆成方块，再一点点拼回去。',
    works: ['主楼夜景', '湖畔复刻'],
    sortOrder: 1,
    isVisible: true
  },
  {
    displayName: 'Redstone',
    slug: 'redstone',
    group: '红石组',
    roleTitle: '机关设计',
    bio: '热衷把简单结构做得可靠，把复杂结构讲得明白。',
    works: ['红石门铃', '自动农场'],
    sortOrder: 2,
    isVisible: true
  },
  {
    displayName: 'Admin',
    slug: 'admin',
    group: '运维组',
    roleTitle: '服务器维护',
    bio: '负责把服务器维持在大家都能安心创造的状态。',
    works: ['服务器备份策略', '新手区整理'],
    sortOrder: 3,
    isVisible: true
  },
  {
    displayName: 'Explorer',
    slug: 'explorer',
    group: '活动组',
    roleTitle: '活动策划',
    bio: '负责把灵光一闪的玩法变成真的能一起玩的活动。',
    works: ['生存挑战赛', '服务器共建周'],
    sortOrder: 4,
    isVisible: true
  }
]

export const gallery: GalleryItem[] = [
  { title: '主楼夜景', tag: '建筑', image: { src: asset('section-gallery-pixel.png'), alt: '主楼夜景' } },
  { title: '烟花合影', tag: '活动', image: { src: asset('cust-main-gate-hero-atmospheric.png'), alt: '烟花合影' } },
  { title: '湖畔复刻', tag: '校园', image: { src: asset('cust-main-gate-hero.png'), alt: '湖畔复刻' } },
  { title: '空岛工程', tag: '作品', image: { src: asset('cust-campus-hero-wide.png'), alt: '空岛工程' } }
]

export const home: HomeData = {
  site,
  navigation,
  serviceStatus,
  hero: {
    eyebrow: 'CUST Minecraft Club',
    titleLines: ['长春理工大学', 'MINECRAFT 社团'],
    highlightText: 'MINECRAFT',
    subtitle: '创造 · 探索 · 联机 · 建筑',
    description: '用方块构建属于长理的世界',
    slides: [
      {
        background: asset('cust-campus-hero-wide.png'),
        contentAlign: 'right',
        contentPosition: 'right-top',
        contentStyle: 'minimal',
        textStyle: 'outlined',
        overlayStrength: 'medium',
        textWidth: 'medium',
        tone: 'light',
        backgroundPosition: 'center 46%'
      },
      {
        background: asset('cust-main-gate-hero-atmospheric.png'),
        contentAlign: 'right',
        contentPosition: 'right-bottom',
        contentStyle: 'minimal',
        textStyle: 'compactOverlay',
        overlayStrength: 'soft',
        textWidth: 'medium',
        tone: 'light',
        backgroundPosition: 'center 50%'
      }
    ],
    carouselInterval: 6000
  },
  intro: {
    title: '社团简介',
    body: '长春理工大学 Minecraft 社团成立于 2014 年，致力于打造一个充满创造力与凝聚力的方块世界。',
    image: { src: asset('section-intro-pixel.png'), alt: '社团简介像素风背景' },
    linkLabel: '查看更多',
    tags: ['校园复刻', '建筑共创', '社团服务器']
  },
  activities,
  announcements,
  posts,
  members,
  gallery,
  server: {
    title: '服务器状态',
    name: 'CUSTMC 服务器',
    status: '在线',
    ip: 'custmc.cn:25565',
    version: '1.20.1 Java / 基岩版',
    mode: '生存 / 建筑 / 创造',
    online: 128,
    capacity: 500
  }
}

export const aboutPage: AboutPageData = {
  title: '社团介绍',
  summary: '一个用方块连接校园、创作和朋友的 Minecraft 社团。',
  coverImage: { src: asset('section-intro-pixel.png'), alt: '社团介绍头图' },
  content: '长春理工大学 Minecraft 社团面向热爱创造、探索、联机和服务器共建的同学。我们一起复刻校园、组织活动、维护服务器，也把成员的作品和故事沉淀成长期可展示的社团内容。',
  groups: [
    { name: '建筑组', summary: '负责校园复刻、主城规划和场景搭建。' },
    { name: '红石组', summary: '研究机关、自动化和有趣的互动结构。' },
    { name: '活动组', summary: '策划比赛、挑战赛、合影和节日活动。' },
    { name: '运维组', summary: '维护服务器、备份地图和整理新手体验。' }
  ],
  serverSummary: '社团服务器第一阶段以管理员手动维护状态为主，展示地址、版本、模式和加入方式。',
  joinGuide: '如果你想参与共建，可以先加入社团群，了解近期活动和服务器规则。'
}

export const joinPage: JoinPageData = {
  title: '加入我们',
  summary: '带上你的想法，进入这个属于长理的方块世界。',
  coverImage: { src: asset('cust-campus-hero-wide.png'), alt: '加入我们头图' },
  introContent: '无论你擅长建筑、红石、服务器管理、活动策划，还是只是想找一群人一起玩 Minecraft，都可以从这里开始。',
  requirements: ['热爱 Minecraft 或愿意了解方块创作', '遵守服务器规则和社团协作约定', '不在公开资料中提交真实姓名、学号、手机号等敏感信息'],
  processSteps: [
    { title: '联系社团', summary: '通过 QQ 群或社团联系人了解当前招新安排。' },
    { title: '阅读规则', summary: '确认服务器玩法、白名单和公共区域建设规范。' },
    { title: '进入服务器', summary: '完成基础确认后进入服务器，选择你想参与的方向。' }
  ],
  contactMethods: [
    { label: 'QQ 群', value: '123456789' },
    { label: '社团邮箱', value: 'custmc@example.com' }
  ],
  faqItems: [
    { question: '完全新手可以加入吗？', answer: '可以。社团会提供基础玩法、服务器规则和简单建筑协作说明。' },
    { question: '必须参加固定活动吗？', answer: '不强制，但欢迎参加例会、共建周和主题活动。' },
    { question: '官网里会展示真实身份吗？', answer: '第一阶段公开资料只展示昵称、分组、作品和简介。' }
  ],
  applicationUrl: 'https://wj.qq.com/join-example',
  serverJoinGuide: '服务器加入方式会在社团群内同步，第一阶段官网只展示说明和外部入口。'
}

export const currentMember: MemberAccount = {
  displayName: 'MockSteve',
  role: 'content-admin',
  email: 'mock.steve@custmc.example'
}

export const memberServices: MemberService[] = [
  {
    label: '皮肤站控制台',
    description: '管理自己的 Minecraft 皮肤和社团服务器外观资料。',
    href: '/member/skin',
    requiredRole: 'member'
  },
  {
    label: '内容后台',
    description: '维护活动、公告、动态、社员介绍和站点内容。',
    href: '/member/admin',
    requiredRole: 'content-admin'
  }
]

export const maintenance = {
  title: '社团服务维护中',
  message: '部分服务正在维护，公开页面仍可使用 mock 数据预览。',
  until: '2026-06-10T23:30:00+08:00'
}
