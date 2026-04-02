## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-14 - [Tactile & Accessible Interactions]
**Learning:** Found that icon-only buttons and mobile toggles lacked tactile feedback and proper semantic structure. Adding `active:scale-95` and converting `div` to `button` significantly improves the perceived responsiveness and accessibility.
**Action:** Always use semantic `<button>` for interactive elements, provide descriptive `aria-label` for icon-only actions, and apply `active:scale-95` (or similar) to provide immediate tactile feedback.
