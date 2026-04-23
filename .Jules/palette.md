## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-04-23 - [Interactive Feedback & Semantic Navigation]
**Learning:** The landing page search experience was improved by using `focus-within` on input containers to provide visual context during field navigation, and by ensuring the mobile menu is a semantic `button` with tactile feedback.
**Action:** Apply `focus-within:ring-2` to multi-input search groups and use `active:scale-95` for icon buttons to provide immediate physical feedback.
