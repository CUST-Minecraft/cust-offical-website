export interface ContentFieldHint {
  modelLabel: string
  model: string
  field: string
  usage: string
}

function createFieldHint(modelLabel: string, model: string, field: string, usage: string): ContentFieldHint {
  return {
    modelLabel,
    model,
    field,
    usage
  }
}

export function siteFieldHint(field: string, usage: string) {
  return createFieldHint('站点设置', 'site-setting', field, usage)
}

export function externalServiceFieldHint(field: string, usage: string) {
  return createFieldHint('外部服务', 'external-service', field, usage)
}

export function maintenanceFieldHint(field: string, usage: string) {
  return createFieldHint('维护页', 'maintenance-page', field, usage)
}

export function joinPageFieldHint(field: string, usage: string) {
  return createFieldHint('加入我们页', 'join-page', field, usage)
}

export function homePageFieldHint(field: string, usage: string) {
  return createFieldHint('首页配置', 'home-page', field, usage)
}

export function aboutPageFieldHint(field: string, usage: string) {
  return createFieldHint('社团介绍页', 'about-page', field, usage)
}

export function activityFieldHint(field: string, usage: string) {
  return createFieldHint('社团活动', 'activity', field, usage)
}

export function announcementFieldHint(field: string, usage: string) {
  return createFieldHint('社团公告', 'announcement', field, usage)
}

export function postFieldHint(field: string, usage: string) {
  return createFieldHint('社团动态', 'club-post', field, usage)
}

export function galleryFieldHint(field: string, usage: string) {
  return createFieldHint('作品图库', 'gallery-item', field, usage)
}

export function memberFieldHint(field: string, usage: string) {
  return createFieldHint('社员资料', 'member-profile', field, usage)
}
