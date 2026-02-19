## 2025-05-14 - [Property Search Accessibility & Functionality]
**Learning:** Search forms were static UI shells lacking accessibility (labels not linked to inputs) and keyboard support (couldn't submit with Enter).
**Action:** Always wrap search inputs in a `<form method="GET">` and use `Label` with `htmlFor` to ensure the form is both functional and accessible.
