## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-14 - [Tactile Feedback & Search Accessibility]
**Learning:** For high-traffic landing pages, adding `focus-within` scaling and ring effects to search groups provides much clearer visual feedback than simple border changes. Additionally, icon-only mobile toggles are often missed by screen readers if implemented as `div`s.
**Action:** Standardize `active:scale-95` for buttons and `focus-within:ring-4` for multi-input groups to ensure a cohesive, accessible feel.
