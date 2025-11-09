# 📧 Smartlead Outreach Tracker - Setup Complete

## ✅ What's Been Built

### 1. Database Table
- **Table:** `outreach`
- **Fields:**
  - `id` (UUID)
  - `date` (DATE)
  - `platform` (TEXT) - smartlead, linkedin, email, etc.
  - `messages_sent` (INTEGER)
  - `replies` (INTEGER)
  - `positive_replies` (INTEGER)
  - `campaign_name` (TEXT, optional)
  - `created_at` (TIMESTAMP)

### 2. API Route
- **GET** `/api/outreach` - Fetch outreach data
  - Query params: `days` (default: 30), `platform` (optional)
  - Returns: outreach entries, totals, response rate, positive rate, by platform

- **POST** `/api/outreach` - Add outreach entry
  - Body: `date`, `platform`, `messages_sent`, `replies`, `positive_replies`, `campaign_name`

### 3. OutreachWidget Component
- Displays response rate, totals (sent/replies/positives)
- Shows positive reply rate
- Breakdown by platform
- Recent entries list
- Quick-add modal integration

### 4. QuickAddModal Updated
- Added "outreach" type support
- Fields: platform, campaign_name, messages_sent, replies, positive_replies

---

## 🚀 Next Steps

### Step 1: Update Supabase Schema

Run this in Supabase SQL Editor (or use the updated `supabase-schema-simple.sql`):

```sql
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

CREATE INDEX IF NOT EXISTS idx_outreach_date ON outreach(date);
CREATE INDEX IF NOT EXISTS idx_outreach_platform ON outreach(platform);

ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on outreach" ON outreach FOR ALL USING (true);
```

### Step 2: Test Locally

```bash
npm run dev
```

Visit: `http://localhost:3000/dashboard`

**Test:**
1. Click **"+ Add Entry"** on Outreach widget
2. Add a test entry:
   - Platform: Smartlead
   - Messages Sent: 100
   - Replies: 10
   - Positive Replies: 3
3. Verify entry appears in widget
4. Check Supabase Table Editor → `outreach` table

### Step 3: Deploy to Vercel

```bash
vercel --prod
```

---

## 📊 How It Works

1. **Manual Entry** → QuickAddModal → POST `/api/outreach` → Supabase
2. **Widget Display** → GET `/api/outreach` → Calculate totals & rates → Display
3. **Auto-Refresh** → Widget refreshes every 30 seconds

---

## 🔗 Future: Smartlead API Integration

To auto-sync Smartlead campaigns:

1. **Get Smartlead API Key**
   - From Smartlead dashboard → Settings → API

2. **Create API Route** (`app/api/integrations/smartlead/route.ts`)
   ```typescript
   // Fetch campaigns from Smartlead API
   // Parse stats (sent, replies, positive replies)
   // Insert into outreach table
   ```

3. **Set Up Cron Job** (Vercel Cron or external)
   - Run daily to sync Smartlead data

4. **Or Use Webhook** (if Smartlead supports)
   - Similar to Gumroad webhook setup

---

## 📈 Metrics Calculated

- **Response Rate** = (Replies / Messages Sent) × 100
- **Positive Reply Rate** = (Positive Replies / Replies) × 100
- **Totals** = Sum of all entries (sent, replies, positives)
- **By Platform** = Breakdown by platform (smartlead, linkedin, etc.)

---

## ✅ Verification Checklist

- [ ] Supabase schema updated (outreach table created)
- [ ] Local dev server running
- [ ] Outreach widget visible on dashboard
- [ ] Can add outreach entry via modal
- [ ] Entry appears in widget
- [ ] Entry appears in Supabase Table Editor
- [ ] Response rate calculates correctly
- [ ] Platform breakdown works
- [ ] Deployed to Vercel

---

## 🎯 Features

✅ **Manual Entry** - Add outreach stats manually
✅ **Response Rate** - Automatic calculation
✅ **Positive Reply Rate** - Track quality of replies
✅ **Platform Breakdown** - See stats by platform
✅ **Recent Entries** - View latest outreach data
✅ **Auto-Refresh** - Updates every 30 seconds
✅ **Quick-Add Modal** - Easy data entry

---

**Your Outreach Tracker is ready!** 🎉

