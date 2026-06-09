## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-09 - [Semantic Triggers and Cohesive Search Feedback]
**Learning:** For multi-input form groups like search bars, applying `focus-within` styles to a shared parent container provides a cohesive visual cue for keyboard users. Additionally, using semantic `<button>` elements for mobile navigation triggers with explicit `aria-label` is crucial for screen reader discoverability.
**Action:** Always prioritize `focus-within:ring` on complex input groups and ensure all mobile interactive triggers are semantic buttons.
