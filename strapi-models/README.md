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

- `site-setting`: global site identity, SEO description, navigation, footer about links, copyright, and credit.
- `maintenance-page`: maintenance mode copy, expected recovery time, and manually maintained service status.
- `home-page`: homepage hero carousel, intro, server overview, and featured relations.
- `about-page`: club introduction content and groups.
- `join-page`: join guide, requirements, process, contacts, FAQ.

Collection types:

- `activity`: events and activities.
- `announcement`: formal notices.
- `club-post`: club posts and server updates.
- `member-profile`: public member profiles.
- `gallery-item`: featured screenshots or works.
- `external-service`: public external service entries such as skin site, document center, MUA website, and YueLing assistant entry metadata.
- `tag`: reusable tags for posts and activities.

## Notes for the Nuxt API adapter

- Do not add custom `publishedAt` or `updatedAt` fields. Strapi manages these fields automatically.
- `heroTitleLines`, `requirements`, and similar repeatable text components should be mapped to string arrays by reading each component's `value`.
- `heroSlides.overlayMode` controls homepage hero overlay behavior. Use `side` for brand slides, `edge` for light atmosphere framing, `corner` plus `overlayAnchor` for a light anchored corner shade, `local` for showcase images that only need text outline/shadow without a background panel, and `none` for unshaded display slides.
- `heroSlides.photoLocation` and `heroSlides.photoAuthor` provide the visible homepage hero photo caption. `heroSlides.photoCaptionPosition` controls its corner placement and should default to `auto`, so the frontend can avoid the hero title corner. Normalize missing caption text to empty strings and keep the caption out of Markdown, file names, and hero title copy.
- Media fields should be normalized to `{ src, alt }`, using the file URL and `alternativeText` or `caption`.
- `footerAboutLinks` should be normalized to structured internal/about footer link arrays. Footer external links should come from `external-service` entries with `showInFooter = true`.
- `skinConsoleUrl`, `documentCenterUrl`, `footerExternalLinks`, `serviceStatus*`, and `maintenance*` are legacy `site-setting` responsibilities and should be migrated to `external-service` or `maintenance-page`.
- `club-post.tags` is a relation. Normalize tags to the names or slugs expected by the frontend filter.
- `member-profile.works` and `promo-section.tags` are JSON arrays to match the current frontend types.
- Structured fields are used for titles, summaries, dates, statuses, tags, media, links, sorting, featured relations, navigation, service entries, and page component configuration. Markdown/rich text is reserved for body fields such as activity content, announcement content, club post content, about page content, and join page explanatory copy.
