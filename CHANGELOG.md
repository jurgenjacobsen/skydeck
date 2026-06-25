# [0.0.1]
## 2026-06-25
### Added
- Created the mockup Blog page ([Blog.tsx](/Blog.tsx)) with custom SOP articles, search inputs, category tab filters, localStorage-backed article bookmarks, and mock reaction handlers.
- Configured routing for the `/blog` route in [App.tsx](/App.tsx) to point to the new `Blog` component.
- Exported the `Blog` component in [index.ts](/src/pages/index.ts).
- Added a stateful Weather Briefing dropdown widget in the header ([header.tsx](/src/components/gen/header.tsx)) to display raw/decoded METAR and TAF data, synchronized with the user's active homebase aerodrome setting, featuring an in-dropdown airport switcher that updates `localStorage` and triggers live weather API refetches, and polling for reports every 15 minutes to trigger a red notification dot on the weather icon if conditions change.

### Changed
- Adjusted the outer spacing container in [Blog.tsx](/src/pages/Blog.tsx) to align with standard page layouts (removing centering, max-width constraints, and custom padding).
