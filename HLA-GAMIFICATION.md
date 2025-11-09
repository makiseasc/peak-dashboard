# 🎮 HLA Gamification - XP & Streak Tracking

## ✅ What's Been Added

### 1. Database Schema Updates
- **XP Column:** `xp INTEGER DEFAULT 10` - Tracks XP earned per HLA completion
- **Streak Column:** `streak_count INTEGER DEFAULT 0` - Tracks consecutive days with all HLAs completed

### 2. API Updates
- **GET `/api/hla`** - Now returns `totalXP` and `streakCount`
- **POST `/api/hla`** - Sets default XP (10) and streak_count (0) for new HLAs
- **PUT `/api/hla`** - Awards XP (10) when completing an HLA
- **POST `/api/hla/reset`** - Daily reset endpoint for n8n cron job

### 3. Widget Updates
- **XP Display:** Shows total XP earned today from completed HLAs
- **Streak Display:** Shows consecutive days with all HLAs completed
- **Visual:** Purple gradient card with XP and streak counters

---

## 🚀 Setup Steps

### Step 1: Update Supabase Schema

Run this in Supabase SQL Editor:

```sql
-- Add XP column (if not exists)
ALTER TABLE hla ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 10;

-- Add streak_count column (if not exists)
ALTER TABLE hla ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;

-- Update existing rows to have default XP
UPDATE hla SET xp = 10 WHERE xp IS NULL;

-- Update existing rows to have default streak_count
UPDATE hla SET streak_count = 0 WHERE streak_count IS NULL;
```

**Or use the provided file:**
- Run `supabase-schema-update-hla.sql` in Supabase SQL Editor

---

### Step 2: Deploy to Vercel

```bash
vercel --prod
```

---

### Step 3: Set Up n8n Cron Job (Daily Reset)

#### Option A: n8n Cron Job

1. Go to your n8n workflow
2. Add a **Cron** node
3. Set schedule: `0 0 * * *` (midnight UTC daily)
4. Add an **HTTP Request** node
5. Configure:
   - **Method:** POST
   - **URL:** `https://your-vercel-domain.vercel.app/api/hla/reset`
   - **Headers:** `Content-Type: application/json`
6. Save and activate workflow

#### Option B: Vercel Cron (Alternative)

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/hla/reset",
      "schedule": "0 0 * * *"
    }
  ]
}
```

#### Option C: External Cron Service

Use a service like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [Cronitor](https://cronitor.io)

Set up daily POST request to:
```
https://your-vercel-domain.vercel.app/api/hla/reset
```

---

## 📊 How It Works

### XP System
- **Default XP:** 10 XP per HLA completion
- **Total XP:** Sum of XP from all completed HLAs today
- **Display:** Shows in widget header as "XP: {totalXP}"

### Streak System
- **Calculation:** Counts consecutive days with all HLAs completed
- **Reset:** Streak breaks if any day has incomplete HLAs
- **Display:** Shows in widget header as "🔥 Streak: {streakCount} days"

### Daily Reset
- **Time:** Midnight UTC (00:00)
- **Action:** Sets all today's HLAs to `completed: false`
- **Purpose:** Fresh start each day for new HLAs

---

## 🧪 Testing

### Test XP Calculation

1. Add an HLA
2. Complete it
3. Check widget - should show "XP: 10"
4. Complete another HLA
5. Check widget - should show "XP: 20"

### Test Streak Calculation

1. Complete all HLAs for today
2. Check widget - should show "🔥 Streak: 1 days"
3. Complete all HLAs tomorrow
4. Check widget - should show "🔥 Streak: 2 days"
5. Miss one HLA the next day
6. Check widget - should show "🔥 Streak: 0 days"

### Test Daily Reset

```bash
# Test reset endpoint manually
curl -X POST http://localhost:3000/api/hla/reset \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "HLA reset completed for 2024-01-20",
  "resetCount": 3
}
```

---

## 🎯 Customization

### Change Default XP

In `app/api/hla/route.ts`, update:

```typescript
// When creating new HLA
xp: 10, // Change this value

// When completing HLA
updateData.xp = 10; // Change this value
```

### Customize XP Per HLA

Add `xp` field to QuickAddModal for HLA type, then pass it when creating/updating.

### Change Streak Calculation

In `app/api/hla/route.ts`, modify the streak calculation logic in the GET endpoint.

---

## ✅ Verification Checklist

- [ ] Supabase schema updated (xp and streak_count columns added)
- [ ] Local dev server running
- [ ] XP displays correctly in widget
- [ ] Streak displays correctly in widget
- [ ] Completing HLA awards XP
- [ ] Completing all HLAs increases streak
- [ ] Daily reset endpoint works
- [ ] n8n cron job configured (or alternative)
- [ ] Deployed to Vercel

---

## 🐛 Troubleshooting

### XP not showing
- Check Supabase schema has `xp` column
- Verify API returns `totalXP` in response
- Check browser console for errors

### Streak not calculating
- Check Supabase schema has `streak_count` column
- Verify API returns `streakCount` in response
- Ensure you have completed HLAs for consecutive days

### Daily reset not working
- Check n8n cron job is active
- Verify webhook URL is correct
- Check Vercel function logs
- Test reset endpoint manually

### "Column does not exist" error
- Run the schema update SQL in Supabase
- Verify columns exist in Table Editor
- Restart dev server

---

## 📈 Future Enhancements

### Potential Additions:
- **XP Multipliers:** Bonus XP for completing all HLAs
- **Streak Rewards:** GP bonuses for milestone streaks (7, 30, 100 days)
- **XP History:** Track XP earned over time
- **Leaderboards:** Compare streaks with others (if multi-user)
- **Custom XP:** Allow setting different XP per HLA type

---

**Your HLA Gamification is ready!** 🎉

