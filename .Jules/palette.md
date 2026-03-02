## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Landing Page Accessibility & Interactivity]
**Learning:** The landing page uses a standalone navbar implementation where the mobile menu toggle was a `div` lacking keyboard accessibility and ARIA attributes.
**Action:** Always verify that interactive elements in standalone page components (like the landing page) use semantic HTML (e.g., `<button>`) and include proper `aria-label` and `focus-visible` states.
