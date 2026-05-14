## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-02-21 - [Tactile Feedback & Mobile Semantics]
**Learning:** Adding `active:scale` classes to interactive elements provides essential tactile feedback that enhances perceived responsiveness, especially on mobile. Additionally, converting non-semantic `div` navigation triggers to `<button>` elements with `aria-label` is a high-impact, low-line-count accessibility win.
**Action:** Always verify that mobile navigation triggers are semantic buttons and interactive elements have visible active states during UX audits.
