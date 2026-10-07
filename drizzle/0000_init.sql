-- Alternative to `npm run db:push`: paste this into your database's SQL editor once.
CREATE TYPE "public"."person" AS ENUM ('NEEL', 'NISHIL');

CREATE TABLE IF NOT EXISTS "counts" (
  "id" serial PRIMARY KEY NOT NULL,
  "person" "person" NOT NULL,
  "amount" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "counts_amount_positive" CHECK ("counts"."amount" > 0)
);

CREATE INDEX IF NOT EXISTS "counts_created_at_idx" ON "counts" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "counts_person_idx" ON "counts" USING btree ("person");
