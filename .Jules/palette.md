## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-24 - [Landing Page UX and Accessibility]
**Learning:** The mobile menu was a static icon in a div, and search inputs lacked ARIA labels. Users navigating by keyboard would have no way to access the menu or understand the search fields.
**Action:** Wrap interactive icons in semantic `<button>` elements with `aria-label` and `focus-visible` styles. Use `focus-within` on complex form groups to provide cohesive visual feedback.
