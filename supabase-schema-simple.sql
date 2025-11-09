-- PEAK Dashboard - Simple Schema (Quick Setup)
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Revenue Table
CREATE TABLE IF NOT EXISTS revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pipeline Table
CREATE TABLE IF NOT EXISTS pipeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  stage TEXT NOT NULL,
  client_name TEXT,
  deal_value DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HLA Table
CREATE TABLE IF NOT EXISTS hla (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  energy_level INTEGER,
  xp INTEGER DEFAULT 10,
  streak_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outreach Table
CREATE TABLE IF NOT EXISTS outreach (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  platform TEXT NOT NULL,
  messages_sent INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  positive_replies INTEGER DEFAULT 0,
  campaign_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue(date);
CREATE INDEX IF NOT EXISTS idx_pipeline_date ON pipeline(date);
CREATE INDEX IF NOT EXISTS idx_hla_date ON hla(date);
CREATE INDEX IF NOT EXISTS idx_hla_completed ON hla(completed);
CREATE INDEX IF NOT EXISTS idx_outreach_date ON outreach(date);
CREATE INDEX IF NOT EXISTS idx_outreach_platform ON outreach(platform);

-- Enable Row Level Security (RLS)
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE hla ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust later if you add auth)
CREATE POLICY "Allow all operations on revenue" ON revenue FOR ALL USING (true);
CREATE POLICY "Allow all operations on pipeline" ON pipeline FOR ALL USING (true);
CREATE POLICY "Allow all operations on hla" ON hla FOR ALL USING (true);
CREATE POLICY "Allow all operations on outreach" ON outreach FOR ALL USING (true);

