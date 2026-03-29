## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2025-05-15 - [Interactive Tactile Feedback & Icon Accessibility]
**Learning:** Standard icon-only buttons (like the mobile menu or heart/favorite button) lack clear accessibility labels and tactile feedback, making them less intuitive for screen readers and touch users.
**Action:** Always provide a descriptive `aria-label` to icon-only buttons and apply `active:scale-95` with `transition-all` for immediate, satisfying visual feedback on interaction.
