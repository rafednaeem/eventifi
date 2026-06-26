## 2026-06-23 - [Landing Page Semantic Navigation & Search Accessibility]
**Learning:** The landing page used non-semantic `div` elements for critical mobile navigation triggers and lacked hidden labels for search inputs, hindering screen reader usability. Standard tactile feedback (`active:scale-95`) was also missing from these custom components.
**Action:** Always use `<button type="button">` for navigation triggers with `aria-label`, and ensure all search inputs have semantic `<label className="sr-only">` elements associated via `id`.

## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.
