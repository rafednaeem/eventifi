## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-07-07 - [Landing Page Accessibility & Micro-Feedback]
**Learning:** The landing page's primary search and navigation lacked fundamental accessibility markers (missing labels for inputs and non-semantic triggers). Standardizing on semantic buttons and `sr-only` labels provides a reusable pattern for ensuring core layout accessibility across the app.
**Action:** Prioritize semantic `<button>` elements for mobile triggers and use `sr-only` labels for search inputs to maintain design while ensuring WCAG compliance. Add `active:scale-95` to all interactive elements for consistent tactile feedback.
