## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2024-05-15 - [Cohesive Focus feedback]
**Learning:** For multi-input form groups like search bars, applying `focus-within` styles to the shared parent container provides much clearer visual feedback than styling individual inputs, especially when the inputs themselves have no visible borders.
**Action:** Use `focus-within:ring-4` (or similar design system tokens) on parent containers of complex input groups to provide a "unified focus" experience.
