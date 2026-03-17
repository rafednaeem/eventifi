## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-03-17 - [Tactile Interaction & Verification Constraints]
**Learning:** Adding scale transforms (e.g., active:scale-95) to elements with transition-colors prevents the scale from animating; transition-all is required. Also, frontend verification and builds fail when Supabase environment variables are missing due to server-side data fetching on the landing page.
**Action:** Use transition-all when adding interaction-based transforms. Ensure environment variables are documented or mocked for CI/build processes where possible.
