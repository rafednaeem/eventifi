## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Semantic Search & Tactile Feedback]
**Learning:** For multi-input search groups (e.g., Location + Query), applying 'focus-within' styles to the shared parent container provides a more cohesive visual signal than individual input focus. Additionally, mobile navigation triggers often lack semantic roles; converting 'div' triggers to 'button' with 'active:scale' feedback significantly improves both accessibility and touch-target delight.
**Action:** Always wrap multi-input search blocks in a container with 'focus-within:ring' and ensure all interactive icons are wrapped in semantic '<button>' elements with ARIA labels.
