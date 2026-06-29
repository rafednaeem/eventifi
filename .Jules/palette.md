## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-23 - [Landing Page A11y & Feedback Patterns]
**Learning:** The project's custom landing page navbar and hero search form lacked semantic markers (using `div` for buttons) and accessible labels. Additionally, the Tailwind v4 configuration in this repo was missing standard utility classes like `sr-only`.
**Action:** Always verify the presence of screen-reader utilities in the global CSS when adding hidden labels. Prefer semantic `<button>` over `div` for navigation triggers to ensure keyboard operability.
