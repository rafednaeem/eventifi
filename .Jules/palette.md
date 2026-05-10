## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-20 - [Semantic Triggers & Interaction Feedback]
**Learning:** In interactive layouts (like search bars), missing focus indicators and non-semantic triggers (divs for buttons) degrade both accessibility and keyboard UX. Explicit focus-within rings and semantic button tags provide immediate clarity for screen readers and power users.
**Action:** Always replace non-semantic div-triggers with `<button>` elements including `aria-label`. Use `focus-within` on parent containers for multi-input groups to create a cohesive focus state.
