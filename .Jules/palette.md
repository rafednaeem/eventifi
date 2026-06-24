## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-23 - [Interactive Polish & Semantic Triggers]
**Learning:** Mobile navigation triggers implemented as `div` elements lack keyboard accessibility and screen reader context. Standard tactile feedback for landing page buttons in this design system uses `active:scale-95` to provide immediate response.
**Action:** Always use semantic `<button>` for triggers and apply `active:scale-95` for interactive polish on primary calls-to-action.
