## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-03-01 - [Interactive Search Patterns]
**Learning:** For multi-input search bars (e.g., Location + Query), using `focus-within` on the parent container alongside `scale-[1.01]` provides a cohesive and delightful focus state that highlights the entire interaction area rather than just a single field.
**Action:** Apply `focus-within:ring-2` and slight scale-up effects to search groups to improve visual hierarchy during input.
