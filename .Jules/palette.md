## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-04-19 - [Landing Page Accessibility and Interaction Polish]
**Learning:** The landing page used a non-semantic `div` for the mobile menu toggle and lacked `aria-label` attributes on search inputs. Additionally, the lack of tactile feedback (scale transitions) and focus-visible rings made the interface feel static and less accessible for keyboard users.
**Action:** Always use semantic `<button>` elements for interactive toggles, provide descriptive ARIA labels for all icon-only or non-labeled inputs, and implement cohesive `active:scale` feedback and `focus-visible` rings to enhance the "feel" and accessibility of interactive components.
