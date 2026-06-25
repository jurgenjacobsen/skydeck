---
name: mockup_blog_page
short_description: Detailed breakdown of the interactive mockup blog page including article rendering, filters, and reactions.
type: both
last_updated: 2026-06-25 18:16:00
last_updated_by: Antigravity
last_version: 0.0.1
---

# Mockup Blog Page (Blog.tsx)
The Blog page ([Blog.tsx](/src/pages/Blog.tsx)) is an interactive blogging and briefing dashboard component designed to let flight simulator captains read standard operating procedures (SOPs), weather briefings, checkride checklists, and theoretical preparation materials.

## Detailed Explanation
The page operates with three distinct sub-systems:
1. **Search & Filter Sub-system**: Filters the list of flight deck articles by textual match (against title, excerpt, and author) or by category (All, Briefing, Exam Prep, SOP, Weather).
2. **Immersive Reader Mode**: Activating a blog post swaps the grid with a long-form article view. It includes a custom typography system, standard radio telephony panels, and warning cards.
3. **Local Storage Bookmarking & Reaction States**:
   - **Bookmarks**: Synchronizes saved post IDs to browser `localStorage` under `skydeck_blog_bookmarks`.
   - **Likes & Comments**: Interactive counters and mock submission forms handle real-time UI reactions during the session.

## Usage Instructions
1. Navigate to `/blog` to see the article listings.
2. Type in the search box to find specific guidelines or select a category button to filter.
3. Click "Read Article" on any card to enter the full reader view.
4. Toggle the bookmark icon to save the post, or toggle the "Like" button to react.
5. Fill out the comment form under the article and press send to add mock comments.

## Examples
### Custom Checklist Box in SOP Post
```tsx
<div className="bg-amber-50 border border-amber-200 text-amber-900 rounded p-4 my-3 text-xs flex gap-3">
    <CheckSquare className="w-5 h-5 shrink-0 text-amber-700" />
    <div>
        <strong>SOP Checklist Discipline Rule:</strong>
        <p className="mt-1">
            Never initiate a flow while the aircraft is in motion...
        </p>
    </div>
</div>
```

## Additional Information
- The page utilizes standard `lucide-react` icons and inherits styling tokens (`text-theme-text-dark`, `bg-theme-card`, etc.) from [index.css](/src/assets/index.css).
- Future additions can connect this layout to a CMS or back-end API endpoint.
