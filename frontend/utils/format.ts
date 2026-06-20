const zhCnDateFormatters = {
  monthDay: new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }),
  mediumDate: new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' }),
  mediumDateTime: new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })
}

export function formatMonthDay(value: string) {
  return zhCnDateFormatters.monthDay.format(new Date(value))
}

export function formatDottedMonthDay(value: string) {
  return formatMonthDay(value).replace('/', '.')
}

export function formatMediumDate(value: string) {
  return zhCnDateFormatters.mediumDate.format(new Date(value))
}

export function formatMediumDateTime(value: string) {
  return zhCnDateFormatters.mediumDateTime.format(new Date(value))
}
