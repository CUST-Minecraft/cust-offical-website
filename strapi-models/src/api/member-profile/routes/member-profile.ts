import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::member-profile.member-profile', {
  config: {
    find: { auth: false },
    findOne: { auth: false }
  }
})
