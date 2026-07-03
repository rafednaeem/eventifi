## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-07-03 - [Landing Page Hero Accessibility & Feedback]
**Learning:** For multi-input search components, applying `focus-within` rings to the shared container provides a more cohesive focus state than individual input borders. Additionally, converting `div` icons to semantic `button` elements with `aria-label` is crucial for mobile navigation accessibility.
**Action:** Use `focus-within:ring` on search bar containers and ensure all icon-only triggers are semantic `button` elements with explicit labels.
