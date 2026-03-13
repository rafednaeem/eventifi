## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-14 - [Tactile Feedback & A11y Polish]
**Learning:** Adding `active:scale-95` to buttons and `active:scale-[0.99]` to larger cards provides immediate, satisfying tactile feedback that confirms user interaction before navigation begins. Combining this with semantic buttons and explicit `aria-label`s for icon-only elements creates a much more "premium" and accessible feel.
**Action:** Standardize `active:scale` feedback across all interactive elements and ensure all icon-only buttons have descriptive `aria-label`s.
