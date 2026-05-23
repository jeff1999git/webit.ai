# Brand Restore Log

Temporary dummy content applied for privacy. Replace dummy → real to restore.

## Find → Replace

| Dummy (current) | Real (restore to) |
|---|---|
| `WebApp` | `WebitAi` |
| `WebApp Inc` | `WebitAi Labs` |

## Files affected

| File | What changed |
|---|---|
| `components/layout/Navbar.tsx` | Logo wordmark |
| `components/sections/Footer.tsx` | Logo wordmark + copyright |
| `app/layout.tsx` | Page title + OG title |
| `app/about-us/page.tsx` | Page metadata title |
| `app/privacy-policy/page.tsx` | Page metadata title |
| `app/terms-conditions/page.tsx` | Page metadata title + 2 body references |
| `app/api/contact/route.ts` | Email subject line |
| `components/sections/Testimonials.tsx` | First testimonial quote |
| `package.json` | `name` field (`webappm` → `webitai`) |

## package.json note

`package.json` name field also needs restoring:
- Current: `"name": "webappm"`
- Restore to: `"name": "webitai"`

## Hero copy (components/sections/Hero.tsx)

| Dummy (current) | Real (restore to) |
|---|---|
| `Lorem ipsum dolor sit amet?` | `Can Ai make a WebApp?` |
| `Lorem ipsum<br />dolor sit amet.` | `Yes, this website<br />is proof of it.` |
| `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.` | `Built entirely with vibe coding in just 3 days — not a single line of code written by hand. Just AI, prompts, and a vision.` |

## How to restore

Tell Claude: **"restore brand content"** and all files above will be updated in one go.
