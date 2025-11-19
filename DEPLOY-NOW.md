# 🚀 DEPLOY TO VERCEL + SUPABASE - QUICK GUIDE

## ✅ Pre-Deployment Checklist

- [x] Code is working locally (`npm run dev`)
- [x] Build succeeds (`npm run build`)
- [x] All widgets functional
- [x] Supabase connection working locally

---

## 📋 STEP 1: Push to GitHub (if not already)

```bash
# Check git status
git status

# Add all changes
git add .

# Commit
git commit -m "Complete hybrid dashboard with full CRUD and data flow fixes"

# Push to main
git push origin main
```

---

## 🔑 STEP 2: Set Environment Variables in Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Go to **Settings** → **Environment Variables**
5. Add these **TWO** variables:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://ppfzxbznymxawaifbnwp.supabase.co
Environment: Production, Preview, Development (select all)

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZnp4YnpueW14YXdhaWZibndwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODk1OTQsImV4cCI6MjA3Nzg2NTU5NH0.NenmS8SE0pzYq6dy1MDbPsOw3tUW7_UKxTtSWB5CFfY
Environment: Production, Preview, Development (select all)
```

6. Click **Save** for each variable
7. **IMPORTANT:** After adding variables, go to **Deployments** tab and click **"Redeploy"** on the latest deployment

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link project (first time only)
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste: https://ppfzxbznymxawaifbnwp.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZnp4YnpueW14YXdhaWZibndwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODk1OTQsImV4cCI6MjA3Nzg2NTU5NH0.NenmS8SE0pzYq6dy1MDbPsOw3tUW7_UKxTtSWB5CFfY

# Deploy to production
vercel --prod
```

---

## 🚀 STEP 3: Deploy to Vercel

### Option A: Automatic (via GitHub)

1. Push your code to GitHub (main branch)
2. Vercel will automatically detect the push
3. It will build and deploy automatically
4. Check the **Deployments** tab for status

### Option B: Manual Deploy via CLI

```bash
# Make sure you're in the project directory
cd /Users/marcusstellato/peak-dashboard-clean

# Deploy to production
vercel --prod
```

### Option C: Deploy via Dashboard

1. Go to Vercel Dashboard
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on latest deployment (after adding env vars)

---

## ✅ STEP 4: Verify Supabase Connection

### Check Supabase Tables Exist

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Table Editor** (left sidebar)
4. Verify these tables exist:
   - ✅ `hla`
   - ✅ `revenue`
   - ✅ `pipeline`
   - ✅ `outreach`

### If Tables Don't Exist

1. Go to **SQL Editor** in Supabase
2. Run the schema file (check `supabase-schema-simple.sql` or similar)
3. Verify tables are created

---

## 🧪 STEP 5: Test Live Deployment

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Go to `/dashboard`
3. Test each widget:
   - ✅ Add a revenue entry
   - ✅ Add a pipeline deal
   - ✅ Add an HLA
   - ✅ Add an outreach entry
   - ✅ Edit an entry
   - ✅ Delete an entry
4. Verify data appears in Supabase Table Editor

---

## 🐛 Troubleshooting

### Issue: "Supabase credentials not found"

**Fix:**
- Check environment variables are set in Vercel
- Make sure they're set for **Production** environment
- Redeploy after adding variables

### Issue: "Cannot read properties of null"

**Fix:**
- Verify Supabase URL and key are correct
- Check browser console for specific errors
- Ensure RLS policies allow access

### Issue: Data not saving

**Fix:**
- Check Supabase Table Editor to see if tables exist
- Verify RLS (Row Level Security) policies allow INSERT/UPDATE/DELETE
- Check browser console for API errors

### Issue: Build fails

**Fix:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally first to catch errors

---

## 📊 Post-Deployment Checklist

- [ ] Environment variables added in Vercel
- [ ] Deployment successful (green checkmark)
- [ ] Dashboard loads at Vercel URL
- [ ] Can add/edit/delete entries
- [ ] Data appears in Supabase
- [ ] Charts display data
- [ ] Metrics update correctly
- [ ] All pages accessible (analytics, automations, settings)

---

## 🎯 Next Steps

Once deployed:

1. **Custom Domain** (optional):
   - Go to Vercel → Settings → Domains
   - Add your custom domain (e.g., `ops.makiseasc.com`)

2. **Monitor Performance**:
   - Check Vercel Analytics
   - Monitor Supabase usage

3. **Set up Automations** (Phase 4):
   - Import n8n workflows
   - Configure webhooks
   - Add `SMARTLEAD_API_KEY` if using Smartlead sync

---

## 🎉 You're Live!

Your dashboard should now be accessible at:
- **Vercel URL:** `https://your-project.vercel.app/dashboard`
- **Custom Domain:** (if configured)

**Test it out and enjoy your Tesla-grade analytics command center!** 🔱⚡

