## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-05-04 - [Semantic Mobile Navigation]
**Learning:** Found that mobile navigation triggers were implemented using generic <div> elements, making them inaccessible to keyboard and screen reader users.
**Action:** Replace non-semantic interactive <div> containers with semantic <button type="button"> elements and provide descriptive aria-label attributes to ensure proper accessibility and keyboard focus support.
