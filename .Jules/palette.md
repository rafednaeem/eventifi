## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-22 - [Landing Page Interactive Polish]
**Learning:** The landing page used generic divs for critical mobile navigation and lacked visual focus/active states for search inputs and buttons, leading to a static feel and poor screen reader support.
**Action:** Always use semantic <button> for toggles, add active:scale-95 for tactile feedback on primary CTAs, and utilize focus-within for group highlighting in complex forms.
