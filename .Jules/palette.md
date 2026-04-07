## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-03-05 - [Tactile & Visual Search Feedback]
**Learning:** Enhancing the landing page search bar with `focus-within` styles significantly improves the perception of the active field without breaking the custom design. Adding `active:scale-95` to primary actions provides the "physical" feel users expect from modern interactive elements.
**Action:** Apply `focus-within:ring-2` and `focus-within:border` to multi-input search containers and include subtle tactile scaling on all primary buttons and toggles.
