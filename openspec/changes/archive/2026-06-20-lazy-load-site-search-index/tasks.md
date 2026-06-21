## 1. Context and Documentation

- [x] 1.1 Re-read `docs/详细设计文档.md` section 2.13 and current `AppHeader` / `SiteSearchOverlay` implementation before coding.
- [x] 1.2 Confirm the implementation will not add Redis, KV, persistent last-known-good cache, direct Strapi browser calls, or new search service dependencies.
- [x] 1.3 Update `docs/详细设计文档.md` to state that full content search index data loads when the search overlay is opened, not during ordinary page first render.

## 2. Header Mounting

- [x] 2.1 Update `frontend/components/AppHeader.vue` to track whether search has been opened at least once.
- [x] 2.2 Render `SiteSearchOverlay` only after the first search open while preserving close and focus-return behavior.
- [x] 2.3 Pass `navigation`, `externalServices`, and service status data from Header/Layout into `SiteSearchOverlay` instead of letting the overlay fetch settings.
- [x] 2.4 Ensure the Header search button remains visible and keyboard accessible before the overlay is mounted.

## 3. Lazy Search Index Loading

- [x] 3.1 Update `frontend/components/SiteSearchOverlay.vue` props to accept navigation, external services, and service status data.
- [x] 3.2 Remove top-level `await useSiteSettings`, `useActivities`, `useAnnouncements`, `usePosts`, and `useMembers` from `SiteSearchOverlay`.
- [x] 3.3 Add internal search index loading state for idle, loading, ready, and error.
- [x] 3.4 Trigger content index loading when the overlay first opens, using existing Nuxt BFF public endpoints for activities, announcements, posts, and members.
- [x] 3.5 Reuse loaded content index data across subsequent opens during the same page lifecycle.
- [x] 3.6 Keep navigation, external service, and service status shortcut results available while content index data is loading or has failed.
- [x] 3.7 Add loading and partial failure UI states without blocking typing, Escape close, Tab focus trapping, or Enter-to-first-result behavior.

## 4. Result Behavior

- [x] 4.1 Preserve searchable result coverage for navigation, skin service, document center, service status, activities, announcements, posts, and public members.
- [x] 4.2 Preserve disabled handling for external services with missing URLs, especially document center search results.
- [x] 4.3 Ensure search result transitions and empty states remain stable and readable on desktop and mobile.

## 5. Verification

- [x] 5.1 Run frontend type checking.
- [x] 5.2 Verify ordinary page first render no longer initializes search content index requests before opening search.
- [x] 5.3 Verify opening search loads content index and then allows searching activities, announcements, posts, and members.
- [x] 5.4 Verify search remains usable when content index loading fails, with shortcut entries still available.
- [x] 5.5 Verify closing search returns focus to the Header search button.
