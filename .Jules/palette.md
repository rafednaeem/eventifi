## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-15 - [Semantic Buttons and Input Labels]
**Learning:** Using non-semantic elements like `div` for interactive controls (like mobile menus) breaks keyboard navigation and screen reader support. Missing `aria-label` on inputs makes them difficult to identify for assistive technologies.
**Action:** Always use semantic `<button>` for interactive controls and provide explicit `aria-label` for inputs that lack visible text labels.
