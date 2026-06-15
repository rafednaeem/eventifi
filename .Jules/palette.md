## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-06-15 - [Semantic Triggers & Tactile Feedback]
**Learning:** Converting non-semantic `div` triggers to `<button>` elements with `aria-label` and adding `active:scale-95` transitions significantly improves both accessibility and the perceived "quality" of interactions on landing pages. Using `focus-within` on multi-input containers provides a more cohesive visual focus state than individual input outlines.
**Action:** Always prefer semantic `<button>` for interactive triggers and apply subtle tactile scaling to primary CTAs. Use `focus-within` for grouped form inputs to create a unified focus indicator.
