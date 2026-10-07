# COUNTS

Neel and Nishil's counts. Next.js (App Router) + Postgres (Neon) + Drizzle ORM, deployed on Vercel.

## Pages

| Route          | What it shows                                                                    |
| -------------- | -------------------------------------------------------------------------------- |
| `/`            | "Who are you?" Remembers the choice for the browser session, then redirects.     |
| `/neel`        | Neel's total and history                                                         |
| `/nishil`      | Nishil's total and history                                                       |
| `/neel-nishil` | Combined total, both individual totals, full history                             |
| `/admin`       | Manage Counts: add, edit, delete entries (no login, by design)                   |

## How the data works

- Each count is one row in the `counts` table: `id`, `person` (`NEEL` | `NISHIL`), `amount`, `created_at`, `updated_at`.
- Totals are **never stored**. Every page sums the rows with one `SUM ... GROUP BY person` query; the combined total is Neel + Nishil from that same result.
- `amount` is validated on the server (whole number, 1 to 1,000,000) and the database also has a `CHECK (amount > 0)` constraint.
- `created_at` is set by the database on insert. Editing an entry changes person/amount and `updated_at` only; the original date and time are kept.
- Times are stored as UTC timestamps and displayed in `Asia/Kolkata` (e.g. `7 Oct 2026`, `8:42 PM`).

## Deploy to Vercel (about 10 minutes)

1. **Push this folder to a GitHub repo.**
2. **Import it in Vercel** (vercel.com → Add New → Project). Framework is detected as Next.js; no settings to change.
3. **Add a database:** in the Vercel project go to **Storage → Create Database → Neon (Postgres)** and connect it to the project. This sets `DATABASE_URL` automatically.
   - Make sure `DATABASE_URL` is the **pooled** connection string (its host contains `-pooler`). If Vercel added several variables, set `DATABASE_URL` to the pooled one.
4. **Create the table (once).** Either:
   - Locally: copy `.env.example` to `.env`, paste the same `DATABASE_URL`, then run `npm install && npm run db:push`; **or**
   - Open the Neon SQL editor and run `drizzle/0000_init.sql`.
5. **Redeploy** in Vercel (Deployments → ⋯ → Redeploy). Done.

## Run locally

```bash
npm install
cp .env.example .env      # set DATABASE_URL (Neon or any Postgres 13+)
npm run db:push           # creates the table
npm run dev               # http://localhost:3000
```

Other scripts: `npm run build`, `npm run typecheck`, `npm run db:studio` (browse the table).

## Project structure

```
src/
  app/
    page.tsx                 "Who are you?" screen
    actions.ts               saves the session choice
    (site)/                  pages that share the header/footer
      layout.tsx
      neel/  nishil/  neel-nishil/
      admin/page.tsx         Manage Counts
      admin/actions.ts       add / update / delete (server-side validation)
      loading.tsx  error.tsx
    globals.css              all styling (navy + white)
  components/                Header, nav, tables, scoreboards, admin form + rows
  db/schema.ts               counts table + constraints
  db/index.ts                database connection
  lib/queries.ts             totals + history queries
  lib/validation.ts          shared input rules (browser + server)
  lib/format.ts              Asia/Kolkata date/time formatting
drizzle/0000_init.sql        plain SQL to create the table
```

## Note on access

There is intentionally no login. Anyone with the link can open `/admin` and change counts.
