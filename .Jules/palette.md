## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-05-03 - [Cohesive Focus States for Search Groups]
**Learning:** For multi-input form groups like search bars, applying `focus-within` styles (including border and ring highlighting) to the shared parent container provides a more cohesive and accessible visual focus state than highlighting individual inputs. Additionally, subtle tactile scaling (`active:scale-[0.98]`) on submit buttons enhances the "clicky" feel without causing layout shifts.
**Action:** Use `focus-within` on multi-input search groups to provide visual context during input navigation and ensure all interactive triggers have tactile feedback.
