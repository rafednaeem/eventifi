## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Landing Page UX & A11y Polish]
**Learning:** The landing page search and navigation used non-semantic triggers (divs) and lacked explicit labels for visual-only fields, hindering screen readers.
**Action:** Replace generic containers with semantic buttons and add descriptive `aria-label` attributes to inputs and mobile menu triggers. Use `focus-within` on multi-input containers for cohesive focus feedback.
