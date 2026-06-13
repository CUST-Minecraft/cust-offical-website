# Strapi content models

This directory contains Strapi 5 content-type and component schemas for the CUST Minecraft website.

## Copy into your Strapi project

From the root of this repository:

```bash
cp -R strapi-models/src/* /path/to/your/strapi-project/src/
```

Then restart Strapi:

```bash
npm run develop
```

Strapi will load the schemas and create or migrate the corresponding tables in the configured database.

## Models

Single types:

- `site-setting`: global site info, navigation, service status, skin site URL, document center URL, maintenance copy.
- `home-page`: homepage hero carousel, intro, server overview, and featured relations.
- `about-page`: club introduction content and groups.
- `join-page`: join guide, requirements, process, contacts, FAQ.

Collection types:

- `activity`: events and activities.
- `announcement`: formal notices.
- `club-post`: club posts and server updates.
- `member-profile`: public member profiles.
- `gallery-item`: featured screenshots or works.
- `tag`: reusable tags for posts and activities.

## Notes for the Nuxt API adapter

- Do not add custom `publishedAt` or `updatedAt` fields. Strapi manages these fields automatically.
- `heroTitleLines`, `requirements`, and similar repeatable text components should be mapped to string arrays by reading each component's `value`.
- Media fields should be normalized to `{ src, alt }`, using the file URL and `alternativeText` or `caption`.
- `club-post.tags` is a relation. Normalize tags to the names or slugs expected by the frontend filter.
- `member-profile.works` and `promo-section.tags` are JSON arrays to match the current frontend types.
