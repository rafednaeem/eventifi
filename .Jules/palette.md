## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-24 - [Semantic UI for Search Groups]
**Learning:** Using `focus-within` on a container element (like a search group) provides a much better visual indicator for keyboard users than individual input focus states, as it highlights the entire functional unit.
**Action:** When grouping multiple inputs in a search bar, wrap them in a semantic `<form>` and apply `focus-within` styles to the container to improve accessibility and visual clarity.
