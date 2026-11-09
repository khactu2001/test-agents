This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

Use `npm` for all commands.

| Command | What it does |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates Next.js route types, then `tsc --noEmit` |
| `npm test` | Unit/component tests with Vitest + React Testing Library (single run, no watch). Tests live in `__tests__/`. |
| `npm run test:e2e` | End-to-end tests with Playwright (Chromium only). Specs live in `e2e/`. |

`npm run test:e2e` builds and starts the app on port 3100 via Playwright's `webServer`. Outside CI an already running server on that port is reused. The first time, install the browser with `npx playwright install chromium`.

CI (`.github/workflows/ci.yml`) runs lint, typecheck, test and build in one job, and e2e in a separate job, on every pull request.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Chat database

Chat history is stored in SQLite (`better-sqlite3`). The file path comes from `CHAT_DB_PATH` (default `./data/chat.db`); the directory is git-ignored and the schema is migrated automatically on first use.
