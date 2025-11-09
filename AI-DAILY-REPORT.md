# 🧠 AI Daily Ops Report - Setup Guide

## ✅ What's Been Created

### 1. API Route
- **GET** `/api/report` - Generates AI-powered daily briefing
  - Fetches revenue, pipeline, and HLA data from Supabase
  - Calculates key metrics
  - Calls Claude API to generate strategic briefing
  - Returns metrics and AI-generated report

### 2. DailyReportWidget Component
- Full-width widget on dashboard
- "Generate Report" button
- Displays metrics summary (revenue, pipeline, HLAs)
- Shows AI-generated report
- Loading states and error handling

---

## 🚀 Setup Steps

### Step 1: Get Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy your API key

### Step 2: Add Environment Variable

Add to `.env.local`:

```bash
ANTHROPIC_API_KEY=your_claude_api_key_here
```

**Or use:**
```bash
CLAUDE_API_KEY=your_claude_api_key_here
```

Both work - the code checks for either.

### Step 3: Add to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `ANTHROPIC_API_KEY` = `your_api_key_here`
3. Redeploy

### Step 4: Test Locally

```bash
npm run dev
```

Visit: `http://localhost:3000/dashboard`

**Test:**
1. Click **"Generate Report"** button
2. Wait for report to generate
3. Verify metrics and AI report appear

---

## 📊 How It Works

1. **User clicks "Generate Report"** → Widget calls `/api/report`
2. **API fetches data** → Revenue (last 30 days), Pipeline, HLA (today)
3. **Calculates metrics** → Total revenue, daily average, active pipeline, HLA completion
4. **Calls Claude API** → Sends metrics with prompt for strategic briefing
5. **Returns report** → AI-generated briefing with recommendations
6. **Displays in widget** → Shows metrics summary and full report

---

## 🎯 Features

### Metrics Displayed
- **Revenue (30d):** Total revenue from last 30 days
- **Daily Average:** Average daily revenue
- **Active Pipeline:** Number of deals not closed/lost
- **HLAs:** Completed vs total HLAs today

### AI Report Includes
- Strategic operator briefing
- Data-driven insights
- Actionable recommendations (1-2 priorities)
- Concise format (under 300 words)

---

## 🔧 Configuration

### Claude Model

Currently using: `claude-3-5-sonnet-20241022`

To change model, edit `app/api/report/route.ts`:

```typescript
model: 'claude-3-5-sonnet-20241022', // Change this
```

Available models:
- `claude-3-5-sonnet-20241022` (recommended)
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307` (faster, cheaper)

### Report Prompt

Customize the prompt in `app/api/report/route.ts`:

```typescript
const prompt = `Your custom prompt here...`;
```

### Fallback Mode

If Claude API key is not configured:
- Widget still works
- Shows basic metrics summary
- Displays fallback report (no AI)
- Shows note about configuring API key

---

## 🧪 Testing

### Test Without API Key

1. Don't add `ANTHROPIC_API_KEY` to `.env.local`
2. Click "Generate Report"
3. Should see fallback report with metrics

### Test With API Key

1. Add `ANTHROPIC_API_KEY` to `.env.local`
2. Restart dev server
3. Click "Generate Report"
4. Should see AI-generated report

### Test API Directly

```bash
curl http://localhost:3000/api/report
```

**Expected Response:**
```json
{
  "metrics": {
    "totalRevenue": 1000,
    "avgDaily": 33.33,
    "activePipeline": 5,
    "completedHLA": 2,
    "totalHLA": 3
  },
  "report": "AI-generated report text..."
}
```

---

## 🐛 Troubleshooting

### "Failed to generate report"
- Check `ANTHROPIC_API_KEY` is set in `.env.local`
- Verify API key is valid
- Check Vercel function logs for errors
- Ensure API key has credits/quota

### "Claude API error"
- Check API key is correct
- Verify Anthropic account has credits
- Check rate limits
- Review API response in logs

### Report not showing
- Check browser console for errors
- Verify API route is accessible
- Check network tab for failed requests
- Ensure Supabase data exists

### Metrics showing 0
- Verify Supabase has data
- Check revenue, pipeline, HLA tables have entries
- Ensure data is recent (within 30 days for revenue)

---

## 💡 Customization

### Add More Metrics

Edit `app/api/report/route.ts`:

```typescript
// Add more data fetching
const { data: outreach } = await supabase
  .from('outreach')
  .select('*')
  .limit(30);

// Add to metrics
const totalOutreach = outreach?.reduce(...) || 0;

// Add to prompt
const prompt = `... Outreach Messages: ${totalOutreach} ...`;
```

### Change Report Style

Modify the prompt in `app/api/report/route.ts`:

```typescript
const prompt = `You are a [role]. Generate a [style] briefing...`;
```

### Add More Context

Include additional data in the prompt:

```typescript
const prompt = `... 
Recent deals: ${pipeline?.slice(0, 5).map(d => d.client_name).join(', ')}
Top revenue sources: ${revenueBySource}
...`;
```

---

## ✅ Verification Checklist

- [ ] Claude API key obtained from Anthropic Console
- [ ] `ANTHROPIC_API_KEY` added to `.env.local`
- [ ] Environment variable added to Vercel
- [ ] Local dev server running
- [ ] Widget visible on dashboard
- [ ] "Generate Report" button works
- [ ] Metrics display correctly
- [ ] AI report generates successfully
- [ ] Report displays in widget
- [ ] Deployed to Vercel

---

## 🎉 You're Ready!

Your AI Daily Ops Report is complete! Click "Generate Report" to get AI-powered strategic briefings based on your dashboard data.

**Next Steps:**
- Customize the prompt for your needs
- Add more metrics to the report
- Set up automated daily reports (cron job)
- Integrate with email notifications

---

**Your AI Daily Report is ready!** 🧠✨

