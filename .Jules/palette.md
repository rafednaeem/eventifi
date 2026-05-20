## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-14 - [Semantic Navigation Triggers]
**Learning:** The mobile navigation trigger was implemented using a generic `div` instead of a semantic `<button>`. This makes the interface inaccessible to screen readers and keyboard users as it lacks an implicit role and focusability.
**Action:** Always use `<button type="button">` for interactive triggers like mobile menus, ensuring they have descriptive `aria-label` attributes and visible focus states.
