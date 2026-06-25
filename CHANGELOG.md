# [0.0.1]
## 2026-06-25
### Added
- Created the mockup Blog page ([Blog.tsx](/src/pages/Blog.tsx)) with custom SOP articles, search inputs, category tab filters, localStorage-backed article bookmarks, and mock reaction handlers.
- Configured routing for the `/blog` route in [App.tsx](/src/App.tsx) to point to the new `Blog` component.
- Exported the `Blog` component in [index.ts](/src/pages/index.ts).
- Added a stateful Weather Briefing dropdown widget in the header ([header.tsx](/src/components/gen/header.tsx)) to display raw METAR and TAF data, synchronized with the user's active homebase aerodrome setting, featuring an in-dropdown airport switcher that updates `localStorage` and triggers live weather API refetches, and polling for reports every 15 minutes to trigger a red notification dot on the weather icon if conditions change. Reads the `fltCat` property directly from the API response to render the flight category status badge, removed the manual METAR decoding section and unused icons, and enforces a minimum 600ms loading state on reload to ensure the refresh animation is clearly visible.

### Changed
- Adjusted the outer spacing container in [Blog.tsx](/src/pages/Blog.tsx) to align with standard page layouts (removing centering, max-width constraints, and custom padding).
- Updated [AGENTS.md](/AGENTS.md) to explicitly enforce the rule that no absolute filesystem paths (such as `C:\` or `file:///C:/`) should ever be referenced in documentation files.
- Removed transition delay/animations in [Blog.tsx](/src/pages/Blog.tsx) when selecting categories to enable instant, flicker-free post filtering.
