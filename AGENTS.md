<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sau Il Moro - Project & Token-Saving Context for AI Agents

## Core Tech Stack
- **Framework**: Next.js 16.2.6 (App Router in `src/app`).
- **Styling**: Tailwind CSS v4 (configured in `src/app/globals.css` with `@theme`).
- **Typography**: Custom `NATRON Rough` font (Display: `--font-display`, Sans: `--font-sans`).
- **Colors**: Rust (`--color-brand-rust` / `#b34624`), Deep Black (`#0A0A0A`), Background texture (`bg-stone-texture` / concrete pattern over `#f4f4f2`).

## Framework Rules (Next.js 16)
- **Instant Navigation**: If rendering dynamic data, export `export const unstable_instant = { prefetch: 'static' }` on the route, and wrap the dynamic fetches/segments inside `<Suspense>` boundaries. If a route cannot support it, use `export const unstable_instant = false`.
- **Component Caching**: Apply `'use cache'` inside async functions fetching static data.

## Critical Token-Saving Directives
1. **Be Precise**: Avoid recursive directory listings or broad text greps.
2. **Minimal Reads**: Do not read full files unless absolutely necessary.
3. **Small Edits**: Use targeted `replace_file_content` chunks instead of rewriting full pages or files.
4. **Brevity**: Write ultra-short explanations. Skip pleasantries.
5. **No Placeholders**: Never write incomplete code, as it causes extra loops.
