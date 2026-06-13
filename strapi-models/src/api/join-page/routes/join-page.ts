import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::join-page.join-page', {
  config: {
    find: { auth: false },
    findOne: { auth: false }
  }
})
