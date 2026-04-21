## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Grouped Search Interaction Pattern]
**Learning:** For multi-input search bars, applying `focus-within` styles (ring/border) to the shared parent container provides a more cohesive visual experience than individual input highlighting. Combining this with `active:scale-95` on primary submission buttons creates a distinct tactile boundary between data entry and action.
**Action:** Use `focus-within` on input group containers for search forms to maintain a clean, integrated UI while preserving accessibility.
