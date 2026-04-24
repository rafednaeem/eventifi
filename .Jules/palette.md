## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-15 - [Cohesive Focus Feedback]
**Learning:** For multi-input form groups like search bars, applying `focus-within` styles (including `ring` and `border`) to the shared parent container provides a more cohesive and delightful visual focus state than highlighting individual inputs.
**Action:** Use `focus-within` on parent containers of input groups to provide cohesive feedback, and ensure all interactive elements use semantic HTML tags.
