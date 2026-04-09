## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Tactile Feedback and Form Accessibility]
**Learning:** Interactive elements like the search bar and mobile menu benefit significantly from tactile feedback (`active:scale`) and proper semantic grouping. Using `focus-within` on input group containers provides a more cohesive visual state than focusing individual inputs.
**Action:** Apply `active:scale-95` to buttons and `active:scale-[0.98]` to larger containers. Use `focus-within` for multi-part forms and ensure all icon-only buttons are semantic `<button>` elements with `aria-label`.
