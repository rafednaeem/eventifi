## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-20 - [Semantic Interactive Elements and Visual Feedback]
**Learning:** The landing page used generic 'div' containers for interactive elements like the mobile menu toggle, which are invisible to screen readers and keyboard users. Additionally, multi-input search forms benefit significantly from 'focus-within' styling on their parent containers to provide a cohesive visual focus state.
**Action:** Always use semantic 'button' elements with descriptive 'aria-label' for icon-only triggers. Apply tactile feedback using 'active:scale' and cohesive focus states via 'focus-within:ring' on grouped form inputs.
