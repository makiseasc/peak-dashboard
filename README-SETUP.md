# 🔱 PEAK Dashboard - Setup Guide

## Quick Start (5 Minutes)

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the contents of `supabase-schema.sql` into the SQL Editor
5. Click **Run** to create all tables

### 2. Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**
3. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Install Dependencies & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and you're ready to go! 🚀

---

## What's Included

### ✅ MVP Widgets (Option B)

1. **Revenue Widget**
   - Track revenue from Gumroad, Stripe, contracts, or manual entries
   - View daily/weekly/monthly totals
   - See breakdown by source

2. **Pipeline Widget**
   - Track deals through stages: Discovery → Proposal → Negotiation → Closed
   - View pipeline value and deal counts
   - Add new deals with client info and deal value

3. **HLA Widget** (High-Leverage Actions)
   - Daily checklist for your most important actions
   - Tracks completion and awards XP/GP (gamification)
   - Energy level tracking (1-10 scale)

### 🔧 Features

- **Real-time data** from Supabase
- **Manual data entry** via quick-add modals
- **Automatic refresh** every 30 seconds
- **Fallback to localStorage** if Supabase not configured
- **Gamification** integration (XP, GP, streaks) via DashboardContext

---

## Database Schema

The `supabase-schema.sql` file creates:

- `revenue` - Revenue entries with source, amount, date
- `pipeline` - Deal pipeline with stages and values
- `hla` - Daily high-leverage actions
- `outreach` - (Future) Outreach tracking
- `content` - (Future) Content tracking

All tables include:
- Row Level Security (RLS) enabled
- Automatic `updated_at` timestamps
- Indexes for performance

---

## API Routes

- `GET /api/revenue` - Fetch revenue data
- `POST /api/revenue` - Add revenue entry
- `GET /api/pipeline` - Fetch pipeline deals
- `POST /api/pipeline` - Add pipeline deal
- `GET /api/hla` - Fetch HLA data
- `POST /api/hla` - Create new HLA
- `PUT /api/hla` - Update HLA (toggle completion)

---

## Next Steps (Future Integrations)

### Gumroad Integration
1. Get your Gumroad API key from [Gumroad Settings](https://gumroad.com/settings/advanced)
2. Add to `.env.local`: `GUMROAD_API_KEY=your_key`
3. Create `/app/api/integrations/gumroad/route.ts` to sync sales

### Cal.com Integration
1. Get your Cal.com API token
2. Add to `.env.local`: `CAL_COM_API_KEY=your_token`
3. Create `/app/api/integrations/calcom/route.ts` to sync bookings

### Smartlead Integration
1. Get your Smartlead API key
2. Add to `.env.local`: `SMARTLEAD_API_KEY=your_key`
3. Create `/app/api/integrations/smartlead/route.ts` to sync campaigns

---

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy! 🚀

---

## Troubleshooting

### "Supabase credentials not found"
- Make sure `.env.local` exists with correct values
- Restart your dev server after adding env vars

### "Failed to fetch" errors
- Check Supabase dashboard → Table Editor to see if tables exist
- Verify RLS policies allow access (check `supabase-schema.sql`)
- Check browser console for specific error messages

### Data not persisting
- Verify Supabase connection in browser Network tab
- Check Supabase logs in dashboard
- Ensure RLS policies are set correctly

---

## Support

If you run into issues:
1. Check Supabase dashboard logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Make sure you ran the SQL schema in Supabase

---

**Built with:** Next.js 16, Supabase, Tailwind CSS, shadcn/ui, React Query

