## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Landing Page UX and Accessibility]
**Learning:** Found that the hero search bar lacked visible focus feedback for the entire group, and the mobile menu trigger was a non-semantic `div`. Additionally, icon mapping lacked proper typing, leading to `any` usage.
**Action:** Applied `focus-within:ring-4` to the search form for a cohesive focus state, converted the mobile menu to a semantic `<button>` with an `aria-label`, and used `sr-only` labels for search inputs to maintain the compact design while ensuring screen reader accessibility.
