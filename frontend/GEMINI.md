# Frontend Implementation Rules & Styling Guidelines

Follow these rules strictly when building or editing the frontend.

## 1. Spacing
- Do not use `mt-*` or `mb-*` for spacing unless there is no better option.
- Use parent-level spacing instead:
  - `gap-*`
  - `space-y-*`
  - `space-x-*`
  - Grid/flex layout spacing
- Prefer clean layout structure over manually pushing elements around.
- Avoid random spacing values. Keep spacing consistent across sections and components.

## 2. Typography and Text Casing
- Do not use Tailwind's `uppercase` class unless specifically requested or the design clearly requires it.
- Do not force all text to lowercase.
- Write normal content using proper sentence case and natural capitalization (e.g., `Can I help you?`).
- Capitalize words where normal grammar, labels, names, headings, buttons, and UI copy require it.
- **Do not use `tracking-tight`, `tracking-wide`, `tracking-wider`, `tracking-widest`, or any `tracking-*` class.**
- Minimum text size should be `text-xs`. Avoid text that is too tiny or hard to read.
- Keep typography clean, readable, and natural.
- Use font weight intentionally: `font-medium`, `font-semibold`, or `font-bold` only where needed.

## 3. Colors
- Do not use `zinc-*`.
- Use `gray-*` as the default neutral color scale unless another neutral color is explicitly requested.
- Keep colors consistent with the brand/theme and avoid using too many colors in one interface.

## 4. Links & Navigation
- **NEVER use raw HTML `<a>` tags anywhere in this Next.js project.**
- Always use Next.js `<Link>` component (`import Link from 'next/link'`).
- Internal Navigation: `<Link href='/path'>`.
- External Links: `<Link href='https://...' target='_blank' rel='noopener noreferrer'>`.
- Phone & WhatsApp: `<Link href='tel:...'>` and `<Link href='https://wa.me/...'>`.
- Email: `<Link href='mailto:...'>`.
- UI Components with `asChild` (e.g. Shadcn `<Button asChild>`): The child element must ALWAYS be `<Link>`, never `<a>`.

## 5. React Hook Imports
- Always import named hooks directly from `'react'`:
  ```tsx
  import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
  ```
- Never use `React.useState`, `React.useEffect`, etc.

## 6. Official Next.js Standards
- **Images**: Always use `next/image` (`import Image from 'next/image'`) with explicit `width`/`height` or `fill` with `className="object-cover"`, and meaningful `alt` text.
- **Client Components**: Only add `'use client'` at the top of files that require client-side React hooks or event listeners.
- **Contrast**: Maintain strong contrast on dark backgrounds (`text-white`, `text-gray-200`, `text-gray-300`). Avoid low-contrast text colors like `text-gray-400` on dark sections.

## 7. Component Selection (Shadcn UI First)
- **Always prioritize and use shadcn UI components** from `@/components/ui/*` rather than raw HTML elements across all components and pages.
- Specifically:
  - Use `<Button>` from `@/components/ui/button` instead of raw `<button>`. If a button links to a route, use `<Button asChild><Link href="...">...</Link></Button>`.
  - Use `<Input>` from `@/components/ui/input` instead of raw `<input>`.
  - Use `<Label>` from `@/components/ui/label` instead of raw `<label>`.
  - Use `<Checkbox>` from `@/components/ui/checkbox` instead of raw `<input type="checkbox">`.
  - Use shadcn Form/Field primitives or dialog/sheet/dropdown components whenever available.
- All shadcn components must be configured to work smoothly with Tailwind CSS v4 and the project's design tokens.

