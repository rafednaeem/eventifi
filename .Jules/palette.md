## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-14 - [Tactile Button Feedback]
**Learning:** The global `Button` component used `transition-colors`, which prevented smooth animations for scaling effects like `active:scale-95`.
**Action:** Use `transition-all` when adding transform-based feedback to shared components to ensure all properties animate correctly.
