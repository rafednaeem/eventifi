## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Semantic Search Forms & Focus UX]
**Learning:** Landing page search bars often use generic `div` containers, which breaks standard browser behaviors like "Enter" to submit and clear focus management.
**Action:** Always wrap multi-input search groups in a `<form>` and use `focus-within` on the container to provide a unified visual focus state for the entire search group.
