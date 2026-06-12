## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Cohesive Grouped Input Focus]
**Learning:** For multi-input search bars that share a common background (e.g., location + query), applying `focus-within` styles (ring/shadow) to the parent container provides a more cohesive visual indicator than individual input focus rings, which can feel fragmented in compact designs.
**Action:** Use `focus-within:ring-4 focus-within:ring-orange-500/20 transition-all` on shared parent containers for search groups.
