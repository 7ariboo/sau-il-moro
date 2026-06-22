# Sau Il Moro - AI Guidelines (CLAUDE.md)

## Commands
- **Dev Server**: `npm run dev`
- **Production Build**: `npm run build`
- **Linting**: `npm run lint`
- **Run Tests**: `npx playwright test`

## Architecture & Project Structure
- **Framework**: Next.js 16.2.6 (App Router in `src/app`).
- **React version**: React 19.2.6.
- **Styling**: Tailwind CSS v4.0.0 (configured in `src/app/globals.css` with `@theme`).
- **Design Tokens**:
  - Font Display: `NATRON Rough Bold` (CSS Variable: `--font-display`)
  - Font Sans: `NATRON Rough Medium` (CSS Variable: `--font-sans`)
  - Accent Color: Brand Rust (`--color-brand-rust: #b34624`)
  - Background: Concrete texture (`bg-stone-texture` / `#f4f4f2`)
  - Text: Deep Black (`--color-deep-black: #0A0A0A`)
- **Key Directories**:
  - `src/app`: Page/route components and layout.
  - `src/components`: Reusable UI components.
  - `src/context`: State management (Cart, Wishlist, Auth).
  - `src/lib`: Common data schemas, type definitions, helper functions.
  - `public/fonts`: Custom OTF font files.
  - `public/images`: Image assets.

## Framework Constraints (Next.js 16 Caching & Instants)
- **Instant Navigations**: To ensure instant page loads/navs, export `export const unstable_instant = { prefetch: 'static' }` from routes.
- **Non-Instant Layouts**: Use `export const unstable_instant = false` to opt-out of validation.
- **Caching**: Use `'use cache'` inside functions to cache static/slow fetches.
- **Suspense**: Wrap dynamic, uncached, or promise-awaiting rendering in `<Suspense>` to avoid blocking sibling navigations.

## Token-Efficiency Directives
1. **No recursive directory listings**: Do not run `find .` or `ls -R` without depth restrictions.
2. **Minimal file reads**: Use `view_file` on target code segments/files rather than scanning entire folders.
3. **Contiguous small edits**: Use `replace_file_content` targeting small specific code chunks instead of replacing the entire file or using `multi_replace_file_content` unnecessarily.
4. **No placeholder code**: Always write full, production-ready logic. Avoid `// TODO` or leaving parts unimplemented, which wastes future tokens to fill.
5. **Hyper-concise responses**: Skip conversational pleasantries. Provide the solution and the files changed, with minimal explanation text.
