-- PEAK Dashboard - Verify and Fix HLA Schema
-- Run this in Supabase SQL Editor to check and fix the hla table

-- Step 1: Check current schema
SELECT 
  column_name, 
  data_type, 
  column_default, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'hla'
ORDER BY ordinal_position;

-- Step 2: Add missing columns if they don't exist
ALTER TABLE hla ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 10;
ALTER TABLE hla ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;

-- Step 3: Update existing rows (if any) to have defaults
UPDATE hla SET xp = 10 WHERE xp IS NULL;
UPDATE hla SET streak_count = 0 WHERE streak_count IS NULL;

-- Step 4: Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  column_default, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'hla'
ORDER BY ordinal_position;

-- Expected output should show:
-- id, date, title, description, completed, energy_level, xp, streak_count, created_at

