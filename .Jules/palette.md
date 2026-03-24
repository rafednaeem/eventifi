## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-03-24 - [Interactive Search Highlighting]
**Learning:** Using `focus-within` on search input containers provides a cohesive visual cue that the entire search group is active, which is more intuitive than only highlighting the individual text input.
**Action:** Apply `focus-within` styles to grouped form elements to synchronize container states with nested interactive children.
