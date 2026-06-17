## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-15 - [Mobile Menu and Search Accessibility]
**Learning:** Landing page interactive elements (mobile menu) were using non-semantic `div` tags, and search inputs lacked linked labels, making them inaccessible to screen readers.
**Action:** Convert `div` interaction triggers to `<button type="button">` with `aria-label`, and use `sr-only` labels linked via `id`/`htmlFor` for all search inputs.
