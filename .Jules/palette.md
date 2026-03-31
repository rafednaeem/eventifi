## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Tactile Feedback & Landing Page Accessibility]
**Learning:** Adding `active:scale-95` and `transition-all` to interactive elements provides immediate, satisfying tactile feedback that improves the perceived responsiveness of the UI. Semantic `<button>` elements with `aria-label` are essential for accessibility when using icon-only triggers like mobile menus.
**Action:** Always implement `active:scale` on primary buttons and ensure all icon-only buttons have descriptive `aria-label` attributes and proper focus states.
