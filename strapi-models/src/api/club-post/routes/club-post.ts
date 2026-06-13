import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::club-post.club-post', {
  config: {
    find: { auth: false },
    findOne: { auth: false }
  }
})
