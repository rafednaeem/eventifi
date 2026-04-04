## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Tactile Feedback & Semantic Nav]
**Learning:** Standardizing tactile feedback (`active:scale-95`) on buttons and ensuring semantic correctness (converting interactive divs to buttons) provides immediate visual delight and improves keyboard accessibility for core navigation elements.
**Action:** Apply subtle scale transitions and proper ARIA labels to all custom interactive elements that don't use the shared Button component.
