## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2024-05-14 - [Tactile Feedback & Semantic Navigation]
**Learning:** Adding subtle `active:scale` transformations (95% for small buttons, 98% for large components) provides immediate tactile feedback that enhances the "premium" feel of the interface. Converting interactive `div` elements to semantic `<button>` elements is critical for screen reader accessibility and consistent keyboard focus behavior.
**Action:** Always use `<button type="button">` for non-submitting interactive elements and apply standardized `active:scale` feedback across the application.
