## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-24 - [Tactile Feedback & Container Focus]
**Learning:** For multi-input search groups where individual inputs are transparent/borderless, applying `focus-within` rings to the parent container provides much clearer visual feedback for keyboard users than individual input focus. Additionally, mobile menu triggers implemented as `div` containers are a recurring accessibility anti-pattern in this codebase.
**Action:** Always replace non-semantic navigation `div`s with `<button type="button">` and use `focus-within` on grouped input containers to maintain design aesthetics while ensuring accessibility.
