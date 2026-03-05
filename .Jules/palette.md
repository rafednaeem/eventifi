## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-05-22 - [Landing Page Micro-UX]
**Learning:** The landing page search bar lacked explicit ARIA labels for inputs, and the mobile menu was a non-semantic div. Adding `focus-within` styles to the search form provides a cohesive visual feedback loop that matches the hover state.
**Action:** Always use semantic `<button>` for menus and ensure all inputs have `aria-label` or associated `<label>` even if placeholder is present.
