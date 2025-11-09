-- PEAK Dashboard - HLA Gamification Update
-- Run this in Supabase SQL Editor to add XP and streak tracking

-- Add XP column (if not exists)
ALTER TABLE hla ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 10;

-- Add streak_count column (if not exists)
ALTER TABLE hla ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;

-- Update existing rows to have default XP
UPDATE hla SET xp = 10 WHERE xp IS NULL;

-- Update existing rows to have default streak_count
UPDATE hla SET streak_count = 0 WHERE streak_count IS NULL;

