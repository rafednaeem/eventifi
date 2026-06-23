## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-23 - [Search Bar Focus UX]
**Learning:** For multi-input form groups like search bars, applying `focus-within` styles (e.g., `focus-within:ring-4`) to the shared parent container provides more cohesive visual feedback than individual input focus rings, improving the perceived quality of the interaction.
**Action:** Prioritize `focus-within` on parent containers for grouped inputs to create a "unified" focus state.
