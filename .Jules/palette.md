## 2026-02-20 - [Accessibility Enhancements]
**Learning:** Found several accessibility issues in the property search and detail pages: labels not connected to inputs, lack of form structure for search, and missing alt text on images.
**Action:** Implement proper form structure and accessible labels in the search interface, and add meaningful alt text to images to support keyboard navigation and screen readers.

## 2026-03-20 - [Tactile Feedback Consistency]
**Learning:** Adding consistent tactile feedback (e.g., `active:scale-95`) to both shared UI components and page-specific triggers (like mobile menus) creates a more cohesive and responsive feel throughout the application.
**Action:** Standardize scaling feedback across all interactive elements to ensure a uniform user experience.

## 2026-03-20 - [Lint-Driven Refactoring]
**Learning:** In projects with strict ESLint rules (like `@typescript-eslint/no-empty-object-type`), it's better to proactively use type aliases for props instead of empty interfaces to avoid blocking PRs with baseline errors.
**Action:** Use `type Props = ...` instead of `interface Props extends ... {}` when no additional members are defined.
