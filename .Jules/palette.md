## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-23 - [Search and Navigation Accessibility Patterns]
**Learning:** The landing page search inputs lacked semantic labels, and the mobile menu was a non-interactive div. Using standard HTML <label className="sr-only"> linked to input IDs is preferred over aria-label for better form accessibility. For mobile triggers, converting divs to buttons with p-2 -mr-2 improves touch targets without breaking visual alignment.
**Action:** Always check search bars for hidden labels and ensure mobile navigation triggers are semantic buttons with increased hit areas.
