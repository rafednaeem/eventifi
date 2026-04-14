## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-15 - [Landing Page Interactivity & A11y]
**Learning:** High-impact UX wins can be achieved by applying `focus-within` to multi-input search groups to provide visual context during input navigation, and adding tactile feedback (`active:scale`) to primary interaction points.
**Action:** Use `focus-within` on group containers to highlight the active field area and ensure all interactive elements use semantic tags (e.g., `<button>` instead of `div`) with appropriate ARIA labels.
