-- PEAK Dashboard Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Revenue Table
CREATE TABLE IF NOT EXISTS revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL CHECK (source IN ('gumroad', 'stripe', 'manual', 'contract')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pipeline Table
CREATE TABLE IF NOT EXISTS pipeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  stage TEXT NOT NULL CHECK (stage IN ('discovery', 'proposal', 'negotiation', 'closed', 'lost')),
  client_name TEXT,
  deal_value DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HLA (High-Leverage Actions) Table
CREATE TABLE IF NOT EXISTS hla (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outreach Table (for future use)
CREATE TABLE IF NOT EXISTS outreach (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  platform TEXT NOT NULL CHECK (platform IN ('smartlead', 'linkedin', 'email')),
  messages_sent INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  campaign_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Table (for future use)
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT CURRENT_DATE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'twitter', 'instagram')),
  posts INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue(date);
CREATE INDEX IF NOT EXISTS idx_revenue_source ON revenue(source);
CREATE INDEX IF NOT EXISTS idx_pipeline_date ON pipeline(date);
CREATE INDEX IF NOT EXISTS idx_pipeline_stage ON pipeline(stage);
CREATE INDEX IF NOT EXISTS idx_hla_date ON hla(date);
CREATE INDEX IF NOT EXISTS idx_hla_completed ON hla(completed);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_revenue_updated_at BEFORE UPDATE ON revenue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_updated_at BEFORE UPDATE ON pipeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hla_updated_at BEFORE UPDATE ON hla
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outreach_updated_at BEFORE UPDATE ON outreach
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - adjust policies based on your auth setup
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE hla ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (you can restrict this later with auth)
CREATE POLICY "Allow all operations on revenue" ON revenue FOR ALL USING (true);
CREATE POLICY "Allow all operations on pipeline" ON pipeline FOR ALL USING (true);
CREATE POLICY "Allow all operations on hla" ON hla FOR ALL USING (true);
CREATE POLICY "Allow all operations on outreach" ON outreach FOR ALL USING (true);
CREATE POLICY "Allow all operations on content" ON content FOR ALL USING (true);

