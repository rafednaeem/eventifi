## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-03-31 - [Tactile Feedback & Icon Accessibility]
**Learning:** Large interactive groups (like search forms) feel unstable with standard scaling; a subtler `active:scale-[0.98]` provides feedback without jarring the layout. Additionally, decorative icons in navbars/search bars should consistently use `aria-hidden="true"` to reduce screen reader noise.
**Action:** Apply graduated tactile scaling based on element size and ensure all non-interactive icons are hidden from the accessibility tree.
