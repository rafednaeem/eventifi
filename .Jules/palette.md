## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text on images to support keyboard navigation and screen readers.

## 2026-02-20 - [Tactile Feedback Pattern]
**Learning:** Adding a subtle scale effect (`active:scale-95`) to the global Button component provides immediate, satisfying tactile feedback that confirms user interaction across the entire application.
**Action:** Standardize scaling feedback by using consistent values across related interactive elements and ensure `transition-all` is used to animate the transform property.
