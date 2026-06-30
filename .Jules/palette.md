## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-23 - [Interactive Feedback & Semantic Navigation]
**Learning:** The landing page search form lacked visual focus coherence and the mobile menu used non-semantic divs. Using `focus-within` on multi-input containers provides a superior cohesive focus state compared to individual input rings.
**Action:** Prefer `focus-within:ring` on parent containers for grouped inputs and ensure all navigation triggers are semantic `<button>` elements with clear `aria-label` attributes.
