import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::activity.activity', {
  config: {
    find: { auth: false },
    findOne: { auth: false }
  }
})
