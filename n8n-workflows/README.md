# n8n Workflows - Import Guide

## 📋 Available Workflows

### 1. `smartlead-sync.json`
- **Purpose:** Daily Smartlead campaign sync
- **Schedule:** 8 AM daily
- **Action:** Syncs Smartlead campaigns to Outreach Widget
- **Includes:** Success/failure monitoring

### 2. `daily-report.json` (AI Daily Brief Sender)
- **Purpose:** Daily AI report email
- **Schedule:** 9 AM daily
- **Action:** Generates daily report and emails it
- **Includes:** Email formatting and monitoring

### 3. `gumroad-sync.json`
- **Purpose:** Gumroad webhook handler via n8n
- **Trigger:** Webhook from Gumroad
- **Action:** Forwards sales to dashboard API
- **Includes:** Response handling and monitoring

### 4. `hla-reset.json` (Already exists)
- **Purpose:** Daily HLA reset
- **Schedule:** Midnight UTC daily
- **Action:** Resets all today's HLAs to incomplete

---

## 🚀 How to Import

### Step 1: Open n8n
1. Go to your n8n instance
2. Click **"Workflows"** in sidebar
3. Click **"Add Workflow"**

### Step 2: Import JSON
1. Click **"Import from File"** or **"Import from URL"**
2. Select the JSON file from this directory
3. Click **"Import"**

### Step 3: Configure
1. Update environment variables:
   - `VERCEL_URL` - Your Vercel domain
   - `EMAIL_FROM` - Your email address
   - `EMAIL_TO` - Recipient email
   - `SLACK_WEBHOOK_URL` - Slack webhook (if using)

2. Test workflow:
   - Click **"Execute Workflow"**
   - Verify it runs successfully

### Step 4: Activate
1. Toggle **"Active"** switch
2. Workflow will run on schedule

---

## 🔧 Customization

### Change Schedule
Edit the cron expression in the Cron node:
- `0 9 * * *` = 9 AM daily
- `0 8 * * 1` = 8 AM Mondays
- `0 17 * * 5` = 5 PM Fridays

### Add Notifications
Add Slack/Email nodes after HTTP Request nodes to get notified of results.

### Error Handling
Add error handling nodes to catch and log failures.

---

## ✅ Verification

After importing:
- [ ] Workflow imported successfully
- [ ] Environment variables configured
- [ ] Test execution successful
- [ ] Workflow activated
- [ ] First scheduled run completed

---

**Your n8n workflows are ready!** 🚀

