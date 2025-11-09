# 🚀 Phase 4: Data Automation - Setup Guide

## 🎯 Goal: Make It Self-Feeding

Automate data collection from external sources so your dashboard updates automatically.

---

## 📋 Automation Checklist

### ✅ Already Automated
- **Gumroad** → Webhook → `/api/gumroad` → Revenue Widget
- **Cal.com** → Webhook → `/api/calcom` → Pipeline Widget
- **HLA Reset** → n8n Cron → `/api/hla/reset` → Daily reset

### 🔄 To Automate (Phase 4)
- **Smartlead API** → Daily sync → Outreach Widget
- **Daily Report** → n8n Cron → `/api/report` → Email/Slack
- **Proof Posts** → Scheduled generation → Social media

---

## 1️⃣ Smartlead API Automation

### Step 1: Get Smartlead API Key

1. Go to [Smartlead Dashboard](https://app.smartlead.ai/)
2. Navigate to **Settings** → **API**
3. Copy your API key

### Step 2: Create Smartlead Sync Route

**File:** `app/api/integrations/smartlead/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const smartleadApiKey = process.env.SMARTLEAD_API_KEY;
    
    if (!smartleadApiKey) {
      return NextResponse.json(
        { error: 'Smartlead API key not configured' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    // Fetch campaigns from Smartlead
    const response = await fetch('https://server.smartlead.ai/api/v1/campaigns', {
      headers: {
        'Authorization': `Bearer ${smartleadApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Smartlead API error: ${response.status}`);
    }

    const campaigns = await response.json();

    // Process each campaign
    for (const campaign of campaigns.data || []) {
      const { data: existing } = await supabase
        .from('outreach')
        .select('id')
        .eq('date', today)
        .eq('campaign_name', campaign.name)
        .single();

      if (!existing) {
        // Insert new entry
        await supabase.from('outreach').insert({
          date: today,
          platform: 'smartlead',
          messages_sent: campaign.sent || 0,
          replies: campaign.replies || 0,
          positive_replies: campaign.positive_replies || 0,
          campaign_name: campaign.name,
        });
      } else {
        // Update existing entry
        await supabase
          .from('outreach')
          .update({
            messages_sent: campaign.sent || 0,
            replies: campaign.replies || 0,
            positive_replies: campaign.positive_replies || 0,
          })
          .eq('id', existing.id);
      }
    }

    return NextResponse.json({
      success: true,
      campaigns_synced: campaigns.data?.length || 0,
    });
  } catch (error: any) {
    console.error('Smartlead sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync Smartlead' },
      { status: 500 }
    );
  }
}
```

### Step 3: Set Up n8n Cron Job

**Schedule:** Daily at 9 AM UTC

**Workflow:**
1. **Cron** node → `0 9 * * *` (9 AM daily)
2. **HTTP Request** node:
   - Method: POST
   - URL: `https://your-vercel-domain.vercel.app/api/integrations/smartlead`
   - Headers: None (uses env var)

### Step 4: Add Environment Variable

**Vercel:**
```bash
SMARTLEAD_API_KEY=your_smartlead_api_key
```

**Local (.env.local):**
```bash
SMARTLEAD_API_KEY=your_smartlead_api_key
```

---

## 2️⃣ Daily Report Automation

### Step 1: Create Email/Slack Webhook

**Option A: Email via n8n**
1. Add **Email** node after HTTP Request
2. Configure SMTP settings
3. Send report to your email

**Option B: Slack via Webhook**
1. Create Slack Incoming Webhook
2. Add **HTTP Request** node
3. POST report to Slack webhook URL

### Step 2: Set Up n8n Cron

**Schedule:** Daily at 8 AM UTC

**Workflow:**
1. **Cron** node → `0 8 * * *` (8 AM daily)
2. **HTTP Request** node:
   - Method: GET
   - URL: `https://your-vercel-domain.vercel.app/api/report`
3. **Email/Slack** node → Send report

---

## 3️⃣ Proof Post Automation

### Step 1: Create Scheduled Post Route

**File:** `app/api/proof/schedule/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { platform } = await req.json(); // 'twitter' or 'linkedin'
    
    // Generate proof post
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: platform }),
    });

    const data = await res.json();

    // Store in database for later use
    const supabase = createClient();
    await supabase.from('content').insert({
      date: new Date().toISOString().split('T')[0],
      platform: platform,
      posts: 1,
      engagement: 0,
      notes: data.content,
    });

    return NextResponse.json({
      success: true,
      content: data.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to schedule post' },
      { status: 500 }
    );
  }
}
```

### Step 2: Set Up n8n Cron

**Schedule:** Weekly (e.g., Fridays at 5 PM UTC)

**Workflow:**
1. **Cron** node → `0 17 * * 5` (Friday 5 PM)
2. **HTTP Request** node:
   - Method: POST
   - URL: `https://your-vercel-domain.vercel.app/api/proof/schedule`
   - Body: `{ "platform": "linkedin" }`
3. **Slack/Email** node → Send generated post

---

## 📊 n8n Workflow JSONs

See `n8n-workflows/` directory for ready-to-import JSON files:
- `smartlead-sync.json` - Daily Smartlead sync
- `daily-report.json` - Daily report email/Slack
- `proof-post-schedule.json` - Weekly proof post generation

---

## ✅ Verification Checklist

- [ ] Smartlead API key obtained
- [ ] Smartlead sync route created
- [ ] n8n cron job configured
- [ ] Daily report automation set up
- [ ] Proof post automation configured
- [ ] Environment variables added to Vercel
- [ ] All workflows tested
- [ ] Email/Slack notifications working

---

## 🎯 Next Steps

1. **Test Smartlead Sync** - Run manually first
2. **Set Up n8n Workflows** - Import JSON files
3. **Configure Notifications** - Email or Slack
4. **Monitor First Week** - Verify automation works
5. **Iterate** - Adjust schedules as needed

---

**Your automation layer is ready!** 🚀

