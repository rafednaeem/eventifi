## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-03-05 - [Landing Page Interactivity and A11y]
**Learning:** Micro-UX touches like `active:scale-95` and `focus-within` provide immediate sensory confirmation that significantly improves the perceived responsiveness of static-looking forms. Semantic buttons for icon-only toggles are essential for screen reader users who would otherwise miss critical navigation elements.
**Action:** Always apply tactile feedback to primary action buttons and ensure all icon-only interactions use semantic `<button>` elements with clear `aria-label` attributes.
