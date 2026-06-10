import { maintenance, serviceStatus } from '~/data/mock'

export default defineEventHandler(() => ok({ ...maintenance, serviceStatus }))
