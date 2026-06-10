import { members } from '~/data/mock'

export default defineEventHandler(() => ok(members.filter((member) => member.isVisible)))
