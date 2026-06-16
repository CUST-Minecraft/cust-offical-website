import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::maintenance-page.maintenance-page', {
  config: {
    find: { auth: false },
    findOne: { auth: false }
  }
})
