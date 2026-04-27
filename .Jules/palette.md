## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-04-27 - [Interactive Search and Semantic Navigation]
**Learning:** For multi-input form groups like search bars, applying `focus-within` styles to the shared parent container provides a more cohesive visual focus state than highlighting individual inputs. Also, converting icon-only layout elements (like mobile menus) to semantic `<button>` tags with `aria-label` is essential for screen reader support and proper keyboard focus.
**Action:** Always use `focus-within` for input group containers and ensure all interactive triggers are semantic `button` elements with descriptive labels.
