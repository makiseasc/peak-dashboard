# 🔱 PEAK Dashboard - Quick Start (5 Minutes)

## ✅ Step 1: Environment Variables (DONE)

Your `.env.local` file has been created with your Supabase credentials!

---

## ✅ Step 2: Run Supabase Schema

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Open `supabase-schema-simple.sql` from this project
5. Copy and paste the entire contents
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see: "Success. No rows returned"

**Verify:** Go to **Table Editor** → You should see 3 tables: `revenue`, `pipeline`, `hla`

---

## ✅ Step 3: Test Locally

```bash
npm run dev
```

Visit: **http://localhost:3000/dashboard**

**Test:**
1. Click **"+ Add Entry"** on Revenue widget
2. Add a test entry (e.g., $100 from "manual")
3. Click **"+ Add Deal"** on Pipeline widget
4. Add a test deal
5. Click **"+ Add"** on HLA widget
6. Add a test HLA

**Verify in Supabase:**
- Go to **Table Editor** → `revenue` → See your entry
- Go to **Table Editor** → `pipeline` → See your deal
- Go to **Table Editor** → `hla` → See your HLA

---

## ✅ Step 4: Deploy to Vercel

### Option A: Use Deployment Script

```bash
chmod +x vercel-deploy.sh
./vercel-deploy.sh
```

### Option B: Manual Deploy

```bash
# Install Vercel CLI (if needed)
npm install -g vercel

# Deploy
vercel --prod
```

### Option C: Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. **Add Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://ppfzxbznymxawaifbnwp.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZnp4YnpueW14YXdhaWZibndwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODk1OTQsImV4cCI6MjA3Nzg2NTU5NH0.NenmS8SE0pzYq6dy1MDbPsOw3tUW7_UKxTtSWB5CFfY`
5. Deploy!

**IMPORTANT:** After adding env vars, **redeploy** from Vercel dashboard.

---

## 🎯 Verification Checklist

- [ ] `.env.local` exists with Supabase credentials
- [ ] Supabase schema run successfully
- [ ] 3 tables visible in Supabase Table Editor
- [ ] Local dev server running (`npm run dev`)
- [ ] Dashboard loads at `http://localhost:3000/dashboard`
- [ ] Can add revenue entry → appears in Supabase
- [ ] Can add pipeline deal → appears in Supabase
- [ ] Can add HLA → appears in Supabase
- [ ] Environment variables added in Vercel
- [ ] Vercel deployment successful
- [ ] Live dashboard works with real data

---

## 🐛 Troubleshooting

### "Supabase credentials not found"
- Check `.env.local` exists in project root
- Restart dev server: `npm run dev`

### "Failed to fetch" errors
- Verify Supabase schema was run
- Check Supabase Table Editor for tables
- Check browser console for specific errors

### Data not appearing
- Check Supabase Table Editor directly
- Verify RLS policies allow access
- Check browser Network tab for API errors

---

## 🚀 You're Live!

Once verified, your dashboard is fully operational with:
- ✅ Real data persistence
- ✅ Manual data entry
- ✅ Auto-refresh every 30 seconds
- ✅ Gamification (XP/GP for HLAs)

**Next:** Add Gumroad/Cal.com/Smartlead integrations (optional)

---

**Questions?** Check `README-SETUP.md` or `VERCEL-DEPLOY.md` for more details.

