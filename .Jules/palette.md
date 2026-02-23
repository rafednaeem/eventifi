## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-23 - [Password Visibility Toggle]
**Learning:** Adding a password visibility toggle is a high-impact micro-UX win. When implementing it as a reusable component, wrapping it in a 'relative w-full' container ensures it fits into existing flex/grid layouts.
**Action:** Use the `PasswordInput` component for all password fields to ensure consistency and accessibility (aria-label, focus states).
