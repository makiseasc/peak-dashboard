# 🔐 Phase 5: Auth + Operator Stats - Setup Guide

## ✅ What's Been Created

### 1. Authentication System
- **Login Page:** `/login` - Magic link authentication
- **Auth Context:** `contexts/AuthContext.tsx` - Auth state management
- **Auth Guard:** `components/AuthGuard.tsx` - Protects dashboard routes
- **Supabase Browser Client:** `lib/supabase-browser.ts` - Client-side auth

### 2. Operator Stats
- **API Route:** `/api/operator-stats` - Fetches XP, streaks, completion rates
- **Widget:** `components/widgets/OperatorStatsWidget.tsx` - Analytics display
- **Features:** Total XP, current streak, best streak, completion rate, 14-day chart

### 3. Dashboard Enhancements
- **Sign Out:** Added to sidebar
- **User Menu:** Dropdown with email and sign out
- **Auth Guard:** Dashboard protected (requires login)

---

## 🚀 Setup Steps

### Step 1: Configure Supabase Auth

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add **Site URL:** `https://ops.makiseasc.com` (or your domain)
5. Add **Redirect URLs:**
   - `https://ops.makiseasc.com/dashboard`
   - `https://ops.makiseasc.com/auth/callback`
   - `http://localhost:3000/dashboard` (for local dev)

6. Go to **Authentication** → **Providers**
7. Enable **Email** provider
8. Configure email templates (optional)

---

### Step 2: Test Locally

```bash
npm run dev
```

Visit: `http://localhost:3000/login`

**Test:**
1. Enter your email
2. Click "Send Magic Link"
3. Check email for magic link
4. Click link → Should redirect to dashboard
5. Verify you're logged in
6. Test sign out

---

### Step 3: Deploy to Vercel

```bash
git add .
git commit -m "Phase 5: Auth + Operator Stats"
vercel --prod
```

---

### Step 4: Test Production

1. Visit: `https://ops.makiseasc.com/login`
2. Enter your email
3. Click "Send Magic Link"
4. Check email for magic link
5. Click link → Should redirect to dashboard
6. Verify you're logged in
7. Test sign out

---

## 📊 Operator Stats Features

### Metrics Displayed
- **Total XP:** Sum of XP from all completed HLAs
- **Current Streak:** Consecutive days with all HLAs completed
- **Best Streak:** Highest streak achieved
- **Completion Rate:** Percentage of HLAs completed

### Chart
- **14-Day Completion Trend:** Line chart showing daily completion rates
- **Visual:** Purple gradient line with interactive tooltips
- **Data:** Last 14 days of HLA completion data

---

## 🔧 Customization

### Change Chart Period

Edit `OperatorStatsWidget.tsx`:

```typescript
const [days, setDays] = useState(14); // Change this
```

### Add More Metrics

Edit `app/api/operator-stats/route.ts`:

```typescript
// Add revenue-based XP
const revenueXP = revenue?.reduce(...) || 0;
const totalXP = hlaXP + revenueXP;
```

### Customize Auth Flow

Edit `contexts/AuthContext.tsx`:

```typescript
// Change redirect URL
emailRedirectTo: `${window.location.origin}/dashboard`,
```

---

## ✅ Verification Checklist

- [ ] Supabase Auth configured
- [ ] Site URL set in Supabase
- [ ] Redirect URLs configured
- [ ] Email provider enabled
- [ ] Login page accessible
- [ ] Magic link login works
- [ ] Dashboard protected (redirects to login)
- [ ] Sign out works
- [ ] Operator Stats widget displays
- [ ] XP/streak calculations work
- [ ] Chart displays (if data exists)
- [ ] Deployed to Vercel

---

## 🐛 Troubleshooting

### "Supabase not configured"
- Check environment variables are set
- Verify Supabase project is active
- Restart dev server

### Magic link not sending
- Check Supabase Auth → Email settings
- Verify email provider is enabled
- Check Supabase logs

### Dashboard not redirecting
- Check AuthGuard is wrapping dashboard
- Verify auth context is working
- Check browser console for errors

### Operator Stats showing 0
- Verify you have HLA data
- Check `hla` table has entries
- Verify `xp` and `streak_count` columns exist

---

## 🎯 Next Steps

### Immediate
1. Configure Supabase Auth
2. Test login flow
3. Deploy to Vercel
4. Test production auth

### Future Enhancements
- Multi-user support (update RLS policies)
- User profiles
- Team dashboards
- Role-based access

---

**Your Phase 5 auth system is ready!** 🔐

