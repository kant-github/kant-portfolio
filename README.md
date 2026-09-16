# Portfolio

Personal site for Rishi Kant Barnwal — built with Next.js 16, React 19, Tailwind CSS v4 and Framer Motion.

## Running it

```bash
bun install
bun run dev
```

Open http://localhost:3000.

## Editing the content

Everything on the page comes from [`lib/data.ts`](lib/data.ts) — profile details, social links, and the Experience, Projects, Skills and Extras sections. Change the data, not the components.

## Layout

```
app/          layout, page, global styles
components/   hero, sections, rows, dock, motion wrappers
lib/          content data, theme hook, clipboard helper
public/       avatar
```

## Scripts

| Command         | What it does     |
| --------------- | ---------------- |
| `bun run dev`   | Dev server       |
| `bun run build` | Production build |
| `bun run start` | Serve the build  |
| `bun run lint`  | ESLint           |
