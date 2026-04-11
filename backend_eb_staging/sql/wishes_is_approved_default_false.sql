-- Ensure new INSERTs that omit is_approved get FALSE (PostgreSQL).
-- Does not change existing row values.
--
-- Run after production_wishes_schema_fix.sql if the column default was ever TRUE.
-- psql "$DATABASE_URL" -f sql/wishes_is_approved_default_false.sql

ALTER TABLE public.wishes
  ALTER COLUMN is_approved SET DEFAULT false;
