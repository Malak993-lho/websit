-- TamTam production: align `wishes` with app.models.Wish (Flask-SQLAlchemy)
-- Run once against production PostgreSQL if columns are missing.
-- Safe to re-run: each block checks information_schema.
--
-- Expected columns:
--   id, wish_text, is_approved (boolean NOT NULL DEFAULT false), created_at (timestamptz)
--
-- Legacy rows: when adding is_approved for the first time, existing rows are set TRUE
-- so previously public content stays visible; new rows use DEFAULT false after ALTER.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'wishes' AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE public.wishes ADD COLUMN is_approved boolean;
    UPDATE public.wishes SET is_approved = true WHERE is_approved IS NULL;
    ALTER TABLE public.wishes ALTER COLUMN is_approved SET DEFAULT false;
    ALTER TABLE public.wishes ALTER COLUMN is_approved SET NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'wishes' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.wishes ADD COLUMN created_at timestamptz;
    UPDATE public.wishes SET created_at = now() WHERE created_at IS NULL;
    ALTER TABLE public.wishes ALTER COLUMN created_at SET DEFAULT now();
    ALTER TABLE public.wishes ALTER COLUMN created_at SET NOT NULL;
  END IF;
END $$;
