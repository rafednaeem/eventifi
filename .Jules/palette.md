## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Next.js 16 searchParams & Git Hygiene]
**Learning:** In Next.js 16, `searchParams` passed to pages are Promises and must be unwrapped (using `await` in RSC or `use()` in Client Components). Also, always ensure temporary logs or debug files are deleted before submission to maintain git hygiene.
**Action:** Always unwrap `searchParams` and `params` in Next.js 16 pages, and double-check for stray files like `*.log` or `*.html` before committing.
