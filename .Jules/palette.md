## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-15 - [Interactive Search & Mobile Accessibility]
**Learning:** For multi-input search groups without visual labels, using `aria-label` on inputs and `focus-within` on the container provides a cohesive interactive experience that is both accessible and visually responsive.
**Action:** Apply `focus-within:ring-2` to search form containers and ensure all icon-only toggles are semantic `<button>` elements with clear `aria-label` attributes.
