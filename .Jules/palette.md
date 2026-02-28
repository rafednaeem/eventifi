## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Landing Page Forms and Navigation]
**Learning:** The landing page search bar lacked semantic structure and visual feedback on focus, and the mobile menu toggle was a non-semantic `div`.
**Action:** Wrap search inputs in a semantic `<form>`, use `focus-within` for container-level focus feedback, and convert non-semantic toggles to `<button>` elements with `aria-label` and interactive states.
