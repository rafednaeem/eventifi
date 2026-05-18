## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-05-18 - [Interactive Feedback & Semantic Navigation]
**Learning:** Landing page search interfaces benefit significantly from `focus-within` rings to provide cohesive feedback across multiple inputs, and mobile navigation triggers often miss semantic button roles.
**Action:** Use `focus-within` on form groups and ensure mobile menu triggers are `<button>` elements with clear `aria-label` attributes.
