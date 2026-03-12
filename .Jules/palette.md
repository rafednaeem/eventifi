## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Interactive Feedback & Semantic Navigation]
**Learning:** Landing page mobile menus and search bars often use non-semantic elements and lack visual focus indicators. Using `focus-within` on input containers and semantic `button` tags for toggles significantly improves keyboard navigation and tactile feel.
**Action:** Standardize `focus-within` patterns for custom-styled form groups and ensure all interactive triggers are semantic buttons with appropriate ARIA labels.
