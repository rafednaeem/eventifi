## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-05-07 - [Search Bar Focus States]
**Learning:** For composite search bars (multiple inputs in one container), applying `focus-within:ring-2` to the parent container provides a cohesive visual indication of focus that feels more modern and less cluttered than individual input rings.
**Action:** Use `focus-within` on parent containers for grouped inputs to maintain a clean UI while ensuring accessibility.
