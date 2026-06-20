import type {
  AboutPageData,
  ActivitySummary,
  AnnouncementSummary,
  ExternalService,
  GalleryItem,
  HomeData,
  JoinPageData,
  MaintenancePageData,
  MemberProfile,
  NavLink,
  PostSummary,
  SiteInfo
} from '~/types/content'

const asset = (name: string) => `/example-assets/${name}`

export const site: SiteInfo = {
  name: '长春理工大学 Minecraft 社团',
  shortName: 'CUSTMC',
  englishName: 'CUST Minecraft Club',
  logoText: 'MC',
  logoImage: asset('custmc-logo-header.png'),
  copyright: '© 2024 长春理工大学 Minecraft 社团 | CUST Minecraft Club. All Rights Reserved.',
  credit: 'Design with heart by CUSTMC',
  footerAboutLinks: [
    { label: '社团介绍', href: '/about', icon: 'about' },
    { label: '社团活动', href: '/activities', icon: 'activity' },
    { label: '加入我们', href: '/join', icon: 'join' }
  ]
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

export const externalServices: ExternalService[] = [
  {
    name: '皮肤站',
    key: 'skin',
    summary: '进入独立皮肤站，管理 Minecraft 皮肤和个人形象。',
    url: 'https://skin.custmc.example',
    icon: 'skin',
    category: 'official',
    enabled: true,
    external: true,
    openInNewTab: true,
    showInHeader: true,
    showInWorkbench: false,
    showInFooter: false,
    showInSearch: true,
    sortOrder: 10
  },
  {
    name: '文档中心',
    key: 'docs',
    summary: '查看社团规约、服务器说明和协作资料。',
    url: 'https://docs.custmc.example',
    icon: 'docs',
    category: 'official',
    enabled: true,
    external: true,
    openInNewTab: true,
    showInHeader: false,
    showInWorkbench: true,
    showInFooter: false,
    showInSearch: true,
    sortOrder: 20
  },
  {
    name: 'MUA 官网',
    key: 'mua',
    summary: '访问 Minecraft University Alliance 官网。',
    url: 'https://www.mualliance.cn/',
    icon: 'mua',
    category: 'partner',
    enabled: true,
    external: true,
    openInNewTab: true,
    showInHeader: false,
    showInWorkbench: false,
    showInFooter: true,
    showInSearch: false,
    sortOrder: 30
  },
  {
    name: '悦灵助手',
    key: 'agent',
    summary: '社团服务工作台中的轻量问答入口。',
    icon: 'agent',
    category: 'tool',
    enabled: true,
    external: false,
    openInNewTab: false,
    showInHeader: false,
    showInWorkbench: true,
    showInFooter: false,
    showInSearch: true,
    sortOrder: 40
  }
]

export const maintenancePage: MaintenancePageData = {
  title: '社团服务维护中',
  message: '部分服务正在维护，公开页面仍可使用开发 mock 数据预览。',
  until: '2026-06-10T23:30:00+08:00',
  maintenanceEnabled: false,
  serviceStatus: {
    label: '社团服务状态',
    href: '/maintenance',
    services: [
      { name: 'Minecraft 主服务器', status: 'online' },
      { name: 'QQ 群机器人', status: 'online' },
      { name: '在线地图', status: 'maintenance' }
    ]
  }
}

export const serviceStatus = maintenancePage.serviceStatus

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
  externalServices,
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
        overlayMode: 'side',
        textWidth: 'medium',
        tone: 'light',
        backgroundPosition: 'center 46%',
        photoLocation: '长春理工大学校园',
        photoAuthor: 'CUSTMC 摄影组',
        photoCaptionPosition: 'auto'
      },
      {
        background: asset('cust-main-gate-hero-atmospheric.png'),
        contentAlign: 'right',
        contentPosition: 'right-bottom',
        contentStyle: 'minimal',
        textStyle: 'compactOverlay',
        overlayStrength: 'soft',
        overlayMode: 'edge',
        textWidth: 'medium',
        tone: 'light',
        backgroundPosition: 'center 50%',
        photoLocation: '长春理工大学正门',
        photoAuthor: 'CUSTMC 摄影组',
        photoCaptionPosition: 'auto'
      },
      {
        background: asset('cust-campus-overview-hero.png'),
        contentAlign: 'right',
        contentPosition: 'right-top',
        contentStyle: 'minimal',
        textStyle: 'outlined',
        overlayStrength: 'soft',
        overlayMode: 'corner',
        overlayAnchor: 'right-top',
        textWidth: 'medium',
        tone: 'light',
        backgroundPosition: 'center 50%',
        photoLocation: '',
        photoAuthor: '',
        photoCaptionPosition: 'auto'
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
  sections: [
    {
      sectionType: 'hero',
      eyebrow: '认识我们',
      title: '长春理工大学 Minecraft 社团',
      summary: '一个用方块连接校园、创作和朋友的 Minecraft 社团。',
      image: { src: asset('section-intro-pixel.png'), alt: '社团介绍头图' },
      items: [],
      links: [],
      sortOrder: 10,
      enabled: true
    },
    {
      sectionType: 'origin',
      eyebrow: '我们的起点',
      title: '从喜欢 Minecraft，到一起创造校园记忆',
      content: '长春理工大学 Minecraft 社团面向热爱创造、探索、联机和服务器共建的同学。我们一起复刻校园、组织活动、维护服务器，也把成员的作品和故事沉淀成长期可展示的社团内容。',
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
      items: [
        { code: '01', title: '建筑组', summary: '负责校园复刻、主城规划和场景搭建。', sortOrder: 10, enabled: true },
        { code: '02', title: '红石组', summary: '研究机关、自动化和有趣的互动结构。', sortOrder: 20, enabled: true },
        { code: '03', title: '活动组', summary: '策划比赛、挑战赛、合影和节日活动。', sortOrder: 30, enabled: true },
        { code: '04', title: '运维组', summary: '维护服务器、备份地图和整理新手体验。', sortOrder: 40, enabled: true }
      ],
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
  ],
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
  summary: '社团长期开放加入，从一个方向开始，慢慢进入属于长理的方块世界。',
  coverImage: { src: asset('cust-campus-hero-wide.png'), alt: '加入我们头图' },
  introContent: '不需要等招新季。无论你擅长建筑、红石、服务器协作、活动策划，还是只是想找一群人一起玩 Minecraft，都可以从这里开始。',
  requirements: ['热爱 Minecraft 或愿意了解方块创作', '遵守服务器规则和社团协作约定', '不在公开资料中提交真实姓名、学号、手机号等敏感信息'],
  processSteps: [
    {
      title: '选择你想以什么身份加入',
      summary: '不需要一开始就很强。先从感兴趣的方向出发，后续也可以慢慢切换。',
      items: ['建筑共创：校园复刻、主城建设、公共设施', '红石机制：机关、自动化、小游戏和互动装置', '活动策划：建筑赛、生存挑战、合影和节日活动', '服务器协作：地图整理、新手区和规则维护', '内容记录或轻松游玩：截图、动态、参观和一起玩'],
      image: { src: asset('section-members-pixel.png'), alt: '社团成员参与方向示意' },
      imageCaption: '先选择一个舒服的起点，不用把自己固定在一个分组里。',
      primaryActionLabel: '了解社团',
      primaryActionUrl: '/about'
    },
    {
      title: '选择加入方式',
      summary: '可以直接联系社团，也可以先看看近期活动和动态，确认这里是不是你想加入的地方。',
      items: ['QQ群：适合直接进入社群了解当前安排', '外部申请表：适合留下加入意向和感兴趣方向', '社团联系人：适合线下或熟人引导', '先看看活动：适合还在观望的新同学'],
      image: { src: asset('cust-campus-hero-wide.png'), alt: '长理校园方块风入口' },
      imageCaption: '长期开放加入，不需要等某个固定招新窗口。',
      primaryActionLabel: '看看活动',
      primaryActionUrl: '/activities'
    },
    {
      title: '了解基本规则',
      summary: '进入社团和服务器前，需要先理解公共空间、白名单和公开资料隐私边界。',
      items: ['尊重其他成员的作品和公共区域', '遵守服务器规则、活动规则和协作约定', '服务器地址、版本和白名单方式以社团群内同步为准', '公开资料不展示真实姓名、学号、手机号等敏感信息'],
      image: { src: asset('section-intro-pixel.png'), alt: '服务器规则说明区域示意' },
      imageCaption: '规则不是门槛，是大家一起维护舒服空间的基础。'
    },
    {
      title: '联系社团并完成确认',
      summary: '说明你的加入意向和感兴趣方向，管理员或社团成员会同步当前加入安排。',
      items: ['确认你的 Minecraft 版本和昵称信息', '了解白名单、群内规则和近期活动安排', '遇到进服问题时通过社团群或联系人继续沟通'],
      image: { src: asset('cust-main-gate-hero.png'), alt: '社团服务器入口示意' },
      imageCaption: '完成基础确认后，再进入服务器会轻松很多。',
      primaryActionLabel: '填写加入意向',
      primaryActionUrl: 'https://wj.qq.com/join-example'
    },
    {
      title: '进入社团，开始参与',
      summary: '加入后可以先参观服务器、参加一次活动，或者从一个小型共建任务开始。',
      items: ['先逛一圈服务器和新手区', '参加一次活动或合影', '认领一个小建筑、小记录或小整理任务', '熟悉后再选择更长期的参与方向'],
      image: { src: asset('section-gallery-pixel.png'), alt: '社团作品和活动瞬间' },
      imageCaption: '从一块小方块开始，也算正式进入这个世界。',
      primaryActionLabel: '查看社团动态',
      primaryActionUrl: '/posts'
    }
  ],
  contactMethods: [
    { label: 'QQ 群', value: '以社团公告和群内同步为准' },
    { label: '外部申请表', value: 'https://wj.qq.com/join-example' }
  ],
  faqItems: [
    { question: '现在不是招新季，也可以加入吗？', answer: '可以。社团长期开放加入，你可以随时通过页面中的加入方式了解当前安排。' },
    { question: '完全新手可以加入吗？', answer: '可以。社团会提供基础玩法、服务器规则和简单建筑协作说明。' },
    { question: '不会建筑或红石可以吗？', answer: '可以。你可以从参观、轻松游玩、内容记录、活动参与或小型共建开始。' },
    { question: '加入后必须经常在线吗？', answer: '不强制。你可以按照自己的时间参与活动、共建或服务器日常。' },
    { question: '服务器需要白名单吗？', answer: '需要。服务器地址、版本和白名单方式会在社团群内同步。' },
    { question: '官网里会展示真实身份吗？', answer: '不会。第一阶段公开资料只展示昵称、分组、作品和自愿提供的简介。' },
    { question: '遇到进服问题怎么办？', answer: '可以在社团群内说明遇到的问题，管理员或熟悉服务器的成员会协助排查。' }
  ],
  applicationUrl: 'https://wj.qq.com/join-example',
  serverJoinGuide: '服务器加入方式会在社团群内同步，第一阶段官网只展示说明和外部入口。'
}
