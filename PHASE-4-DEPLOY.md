# 🚀 Phase 4 Automation - Deployment Guide

## ✅ What's Been Created

### 1. Smartlead Sync API
- **Route:** `/api/integrations/smartlead`
- **Method:** GET
- **Action:** Fetches Smartlead campaigns and syncs to Outreach Widget
- **Schedule:** Daily at 8 AM (via n8n cron)

### 2. Enhanced Cal.com Webhook
- **Route:** `/api/calcom` (updated)
- **Enhancement:** Deal value estimation based on event type
- **Logic:** Consulting = $250, Follow-up = $500, Discovery = $0

### 3. Monitor Endpoint
- **Route:** `/api/monitor`
- **Method:** POST
- **Purpose:** Log workflow status to Supabase
- **Usage:** n8n workflows call this to track success/failure

### 4. n8n Workflows (Ready to Import)
- `smartlead-sync.json` - Daily Smartlead sync
- `gumroad-sync.json` - Gumroad webhook handler
- `daily-report.json` - AI daily brief email
- All include monitoring integration

---

## 🚀 Deployment Steps

### Step 1: Add Environment Variables

**Vercel:**
```bash
vercel env add SMARTLEAD_API_KEY
# Enter your Smartlead API key when prompted
```

**Local (.env.local):**
```bash
SMARTLEAD_API_KEY=your_smartlead_api_key_here
```

### Step 2: Deploy to Vercel

```bash
git add .
git commit -m "Phase 4 automation pack"
vercel --prod
```

### Step 3: Import n8n Workflows

1. Go to your n8n instance
2. Click **"Workflows"** → **"Add Workflow"**
3. Click **"Import from File"**
4. Import each JSON file:
   - `n8n-workflows/smartlead-sync.json`
   - `n8n-workflows/gumroad-sync.json`
   - `n8n-workflows/daily-report.json`

### Step 4: Configure n8n Workflows

**For each workflow:**

1. **Set Environment Variables:**
   - `VERCEL_URL` = `https://ops.makiseasc.com` (or your domain)
   - `EMAIL_FROM` = `ops@makiseasc.com`
   - `EMAIL_TO` = `marcus@makiseasc.com`

2. **Test Workflow:**
   - Click **"Execute Workflow"**
   - Verify it runs successfully
   - Check Supabase tables for data

3. **Activate Workflow:**
   - Toggle **"Active"** switch
   - Workflow will run on schedule

---

## 🧪 Testing

### Test Smartlead Sync

```bash
# Test manually
curl https://ops.makiseasc.com/api/integrations/smartlead

# Expected response:
# {
#   "success": true,
#   "campaigns": 5,
#   "synced": 5,
#   "date": "2024-01-20"
# }
```

**Verify:**
- Check Supabase `outreach` table
- Should see entries with `platform: "smartlead"`
- Check Outreach Widget on dashboard

### Test Monitor Endpoint

```bash
# Test manually
curl -X POST https://ops.makiseasc.com/api/monitor \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Workflow","status":"success","details":"Test run"}'

# Expected response:
# {
#   "ok": true,
#   "logged": true,
#   "workflow": "Test Workflow",
#   "status": "success"
# }
```

**Verify:**
- Check Supabase `pipeline` table
- Should see entry with `stage: "automation_ok"`

### Test Cal.com Enhancement

1. Create test booking on Cal.com
2. Verify webhook fires
3. Check Pipeline Widget
4. Verify deal value is set (if consulting event)

---

## 📊 Workflow Schedules

| Workflow | Schedule | Purpose |
|----------|----------|---------|
| Smartlead Sync | 8 AM daily | Sync campaign metrics |
| Daily Brief | 9 AM daily | Email AI report |
| HLA Reset | Midnight UTC | Reset daily HLAs |
| Gumroad Sync | Webhook | Real-time sale sync |

---

## ✅ Verification Checklist

- [ ] Smartlead API key added to Vercel
- [ ] Code deployed to Vercel
- [ ] Smartlead sync route tested manually
- [ ] Monitor endpoint tested manually
- [ ] n8n workflows imported
- [ ] n8n environment variables configured
- [ ] All workflows tested (Execute Workflow)
- [ ] All workflows activated
- [ ] First scheduled run completed
- [ ] Data appears in Supabase
- [ ] Widgets update automatically

---

## 🐛 Troubleshooting

### Smartlead Sync Fails

**Check:**
- Smartlead API key is correct
- API key has proper permissions
- Network connectivity
- Vercel function logs

**Common Issues:**
- `401 Unauthorized` → API key invalid
- `403 Forbidden` → API key lacks permissions
- `500 Error` → Check Supabase connection

### Monitor Endpoint Fails

**Check:**
- Supabase connection
- Pipeline table exists
- RLS policies allow inserts
- Request format is correct

### n8n Workflows Not Running

**Check:**
- Workflow is activated
- Cron expression is correct
- Environment variables are set
- n8n instance is running
- Check n8n execution logs

---

## 🎯 Expected Outcomes

### After Phase 4 Deployment

**Daily Automation:**
- ✅ 8 AM: Smartlead campaigns sync automatically
- ✅ 9 AM: Daily AI brief emailed to you
- ✅ Midnight: HLAs reset automatically
- ✅ Real-time: Gumroad sales sync via webhook
- ✅ Real-time: Cal.com bookings sync via webhook

**Data Flow:**
- Smartlead → Outreach Widget (automatic)
- Gumroad → Revenue Widget (automatic)
- Cal.com → Pipeline Widget (automatic)
- All workflows → Monitor endpoint (tracking)

**Result:**
- Zero manual data entry needed
- Dashboard updates automatically
- Full visibility into automation health
- Living, breathing empire system

---

## 🚀 Next Steps

### Immediate
1. Deploy code to Vercel
2. Import n8n workflows
3. Test all workflows
4. Monitor first week

### When Claude API Returns
1. Add `ANTHROPIC_API_KEY` to Vercel
2. Redeploy
3. Daily briefs will be AI-generated
4. Proof posts will be AI-generated

### Phase 5 (Future)
- Supabase Auth
- Operator XP leaderboard
- Streak analytics charts
- PDF report exports
- Weekly/monthly summaries

---

**Your Phase 4 automation is ready!** 🚀

Deploy, import workflows, and watch your empire become self-feeding. 🔱

