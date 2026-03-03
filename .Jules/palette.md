## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-23 - [Interactive Form & Menu Accessibility]
**Learning:** Generic 'div' based toggles and search containers lack keyboard navigation and tactile feedback. Semantic forms and buttons with 'focus-within' and 'active' states significantly improve UX.
**Action:** Always use semantic buttons for toggles and wrap search groups in <form> with focus-within visual cues. Avoid non-UX refactors in Palette PRs to keep scope focused.
