import { navigation, serviceStatus, site } from '~/data/mock'

export default defineEventHandler(() => ok({ site, navigation, serviceStatus }))
