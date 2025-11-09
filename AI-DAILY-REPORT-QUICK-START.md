# 🧠 AI Daily Report - Quick Start

## ✅ What's Been Created

1. **API Route:** `app/api/report/route.ts`
   - Fetches revenue, pipeline, and HLA data
   - Calculates metrics
   - Calls Claude API to generate report

2. **Widget Component:** `components/widgets/DailyReportWidget.tsx`
   - Full-width widget on dashboard
   - "Generate Report" button
   - Displays metrics and AI report

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Go to **API Keys** → **Create Key**
4. Copy your API key

### Step 2: Add Environment Variable

Add to `.env.local`:

```bash
ANTHROPIC_API_KEY=your_claude_api_key_here
```

**Or use:**
```bash
CLAUDE_API_KEY=your_claude_api_key_here
```

### Step 3: Add to Vercel

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add: `ANTHROPIC_API_KEY` = `your_api_key_here`
3. Redeploy

---

## 🧪 Test

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/dashboard`
3. Click **"Generate Report"** button
4. Wait for report to generate
5. Verify metrics and AI report appear

---

## 📊 What It Shows

### Metrics Summary
- **Revenue (30d):** Total revenue from last 30 days
- **Daily Avg:** Average daily revenue
- **Active Pipeline:** Number of active deals
- **HLAs:** Completed vs total HLAs today

### AI Report
- Strategic operator briefing
- Data-driven insights
- Actionable recommendations
- Concise format (under 300 words)

---

## 🐛 Troubleshooting

### "Failed to generate report"
- Check `ANTHROPIC_API_KEY` is set
- Verify API key is valid
- Check Anthropic account has credits

### Report not showing
- Check browser console for errors
- Verify API route is accessible
- Ensure Supabase has data

### Metrics showing 0
- Verify Supabase has data
- Check revenue, pipeline, HLA tables have entries

---

## ✅ Checklist

- [ ] Claude API key obtained
- [ ] `ANTHROPIC_API_KEY` added to `.env.local`
- [ ] Environment variable added to Vercel
- [ ] Widget visible on dashboard
- [ ] "Generate Report" button works
- [ ] AI report generates successfully

---

## 🎯 That's It!

Your AI Daily Report is ready! Click "Generate Report" to get AI-powered strategic briefings.

**Note:** Works without API key (shows fallback report), but AI report requires Claude API key.

---

**Your AI Daily Report is ready!** 🧠✨

