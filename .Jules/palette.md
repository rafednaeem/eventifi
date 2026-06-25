## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-23 - [Landing Page Interactivity and Semantic Layout]
**Learning:** The landing page used generic `div` elements for mobile menu triggers and lacked tactile feedback on primary actions, reducing accessibility and perceived responsiveness. Search inputs also lacked screen-reader-accessible labels.
**Action:** Replace `div` triggers with semantic `<button>` elements including `aria-label`. Use `active:scale-95` for tactile feedback on buttons and `focus-within:ring` on multi-input containers to provide cohesive focus states. Always include `sr-only` labels for hero search inputs.
