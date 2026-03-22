## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-20 - [Search Bar Interaction & Type Safety]
**Learning:** For complex form groups (like the search bar), `focus-within` on the container provides a more cohesive visual feedback than individual input focus. Also, using `LucideIcon` instead of `any` for icon mappings is required by the project's strict linting rules.
**Action:** Apply `focus-within` to search containers for better group highlighting. Always use `LucideIcon` type for dynamic icon objects to maintain type safety.
