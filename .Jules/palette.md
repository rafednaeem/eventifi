## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-15 - [Landing Page UX & Accessibility]
**Learning:** Found that the landing page used non-semantic divs for mobile navigation and lacked descriptive labels for its primary search inputs, hindering screen reader support. Adding focus-within rings to complex form containers also significantly improved keyboard navigation visibility.
**Action:** Always use semantic <button> elements for navigation triggers and ensure every form input has a linked label (visually hidden if necessary via sr-only). Use focus-within on shared parent containers for multi-input forms to provide cohesive visual feedback.
