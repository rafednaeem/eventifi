## 2026-02-21 - [Input Component Enhancement]
**Learning:** Adding interactive elements (like a password toggle) inside a shared `Input` component requires a `relative` wrapper to position the icon correctly without breaking the layout for other instances. Ensuring the wrapper has `w-full` maintains compatibility with existing flex/grid layouts.
**Action:** Always use a `w-full` relative wrapper when adding positioned icons to form primitives to ensure layout consistency.
