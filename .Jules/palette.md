## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-14 - [Cohesive Search Feedback & Semantic Toggles]
**Learning:** Using `focus-within` on multi-input form groups (like landing page search bars) provides superior visual feedback compared to individual input focus. Additionally, ensure all interactive triggers use semantic `<button>` elements with `type="button"` to avoid accidental form submissions and ensure screen reader compatibility.
**Action:** Apply `focus-within` for group feedback and use semantic buttons for all UI toggles and icon-only interactions.
