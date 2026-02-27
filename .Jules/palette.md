## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-27 - [Password Input Component]
**Learning:** When creating wrapper components like `PasswordInput` that toggle the `type` attribute, it is crucial to spread `props` before setting the dynamic `type` to prevent external overrides from breaking functionality.
**Action:** Always spread `props` before explicit attribute overrides in UI wrapper components.
