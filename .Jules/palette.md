## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-05-29 - [Landing Page A11y & Visual Feedback]
**Learning:** Mobile navigation triggers implemented as `div` elements are invisible to screen readers and lack keyboard focusability. Search inputs often rely on placeholders alone, which disappear on focus, harming cognitive accessibility.
**Action:** Use semantic `<button type="button">` with `aria-label` for navigation triggers. Provide `sr-only` labels linked to inputs via `id`/`htmlFor`. Apply `active:scale-95` to buttons and `focus-within:ring-2` to form containers to provide cohesive tactile and visual feedback.
