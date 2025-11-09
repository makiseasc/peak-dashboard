# 🎮 HLA Gamification - Quick Start

## ✅ What's Been Added

1. **XP Tracking** - Earn 10 XP per completed HLA
2. **Streak Tracking** - Track consecutive days with all HLAs completed
3. **Daily Reset** - API endpoint for n8n cron job

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Update Supabase Schema

Run this in Supabase SQL Editor:

```sql
ALTER TABLE hla ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 10;
ALTER TABLE hla ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
UPDATE hla SET xp = 10 WHERE xp IS NULL;
UPDATE hla SET streak_count = 0 WHERE streak_count IS NULL;
```

**Or use:** `supabase-schema-update-hla.sql`

---

### Step 2: Deploy to Vercel

```bash
vercel --prod
```

---

### Step 3: Set Up n8n Cron Job

1. Go to n8n workflow
2. Add **Cron** node → Schedule: `0 0 * * *` (midnight UTC)
3. Add **HTTP Request** node:
   - Method: POST
   - URL: `https://your-vercel-domain.vercel.app/api/hla/reset`
4. Activate workflow

**Or use alternative:** Vercel Cron, cron-job.org, etc.

---

## 📊 How It Works

- **XP:** Shows total XP from completed HLAs today
- **Streak:** Shows consecutive days with all HLAs completed
- **Reset:** Daily at midnight UTC, resets all today's HLAs to incomplete

---

## ✅ Test

1. Complete an HLA → See "XP: 10"
2. Complete all HLAs → See "🔥 Streak: 1 days"
3. Complete all tomorrow → See "🔥 Streak: 2 days"

---

## 🎯 That's It!

Your HLA widget now shows:
- **XP: {totalXP}** (purple)
- **🔥 Streak: {streakCount} days** (green)

**Your gamification is live!** 🎉

