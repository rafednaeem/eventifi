## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-04-25 - [Micro-UX: Focus-Within & Semantic Toggles]
**Learning:** For multi-input form groups like search bars, applying `focus-within` styles (including ring, border, and background changes) to the shared parent container provides a more cohesive and delightful visual focus state than highlighting individual inputs. Additionally, semantic `<button>` elements for mobile menus are critical for accessibility and easily support tactile feedback like `active:scale`.
**Action:** Use `focus-within` for grouped form inputs and ensure all interactive icons are wrapped in semantic buttons with ARIA labels and tactile scaling.
