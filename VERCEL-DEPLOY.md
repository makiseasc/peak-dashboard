# 🚀 Vercel Deployment Guide

## Quick Deploy (2 Options)

### Option 1: Vercel CLI (Recommended)

```bash
# Make script executable
chmod +x vercel-deploy.sh

# Run deployment script
./vercel-deploy.sh
```

Or manually:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel --prod
```

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (see below)
5. Deploy!

---

## 🔑 Environment Variables Setup

**CRITICAL:** Add these in Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add these two variables:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://ppfzxbznymxawaifbnwp.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZnp4YnpueW14YXdhaWZibndwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODk1OTQsImV4cCI6MjA3Nzg2NTU5NH0.NenmS8SE0pzYq6dy1MDbPsOw3tUW7_UKxTtSWB5CFfY
```

3. Make sure they're set for **Production**, **Preview**, and **Development**
4. Click **Save**
5. **Redeploy** your project (or it will auto-redeploy on next push)

---

## ✅ Post-Deployment Checklist

- [ ] Environment variables added in Vercel
- [ ] Supabase schema run in SQL Editor
- [ ] Test dashboard at your Vercel URL
- [ ] Try adding a revenue entry
- [ ] Try adding a pipeline deal
- [ ] Try adding an HLA
- [ ] Verify data appears in Supabase Table Editor

---

## 🐛 Troubleshooting

### "Supabase credentials not found" in production
- Check environment variables are set in Vercel
- Make sure they're set for **Production** environment
- Redeploy after adding variables

### Data not persisting
- Verify Supabase schema was run
- Check Supabase Table Editor to see if tables exist
- Check browser console for errors
- Verify RLS policies allow access

### Build fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally first to catch errors

---

## 🎯 Next Steps After Deployment

Once your dashboard is live:

1. **Test all widgets** - Add entries, verify they save
2. **Check Supabase** - Verify data appears in Table Editor
3. **Monitor performance** - Check Vercel analytics
4. **Add integrations** - Gumroad, Cal.com, Smartlead (optional)

---

**Your dashboard will be live at:** `https://your-project.vercel.app/dashboard`

🎉 **You're ready to launch!**

