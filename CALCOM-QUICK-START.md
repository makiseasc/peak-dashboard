# 📅 Cal.com Webhook - Quick Start

## ✅ What's Been Set Up

1. **API Route Created:** `app/api/calcom/route.ts`
   - Handles POST requests from Cal.com
   - Extracts booking details (name, email, startTime)
   - Inserts into Supabase `pipeline` table with `stage: "discovery"`

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Deploy to Vercel

```bash
# Deploy your latest code
vercel --prod
```

Or push to GitHub and let Vercel auto-deploy.

---

### Step 2: Get Your Webhook URL

**Option A: Direct Vercel URL**
```
https://your-vercel-domain.vercel.app/api/calcom
```

**Option B: Via n8n (as you mentioned)**
```
https://makiseops.app.n8n.cloud/webhook/calcom-booking
```

---

### Step 3: Configure in Cal.com

1. Go to [Cal.com Settings → Developer → Webhooks](https://cal.com/settings/developer/webhooks)
2. Click **Add Webhook**
3. Paste your webhook URL
4. Select event: **Booking Created** or **Booking Confirmed**
5. Save

---

## 🧪 Test Locally

```bash
# Test with curl
curl -X POST http://localhost:3000/api/calcom \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "startTime": "2024-01-20T14:00:00Z",
    "eventType": {
      "title": "Discovery Call"
    },
    "bookingId": "test123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Booking added to pipeline successfully"
}
```

**Verify:**
- Check Supabase Table Editor → `pipeline` table
- Should see entry with `stage: "discovery"` and `client_name: "John Doe"`

---

## ✅ Verification Checklist

- [ ] Code deployed to Vercel
- [ ] Webhook URL added in Cal.com
- [ ] Test booking created (or test webhook sent)
- [ ] Entry appears in Supabase `pipeline` table
- [ ] Entry appears in Pipeline Widget on dashboard
- [ ] Vercel function logs show success

---

## 🐛 Troubleshooting

### "Supabase credentials not configured"
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- In Vercel, add these as environment variables

### "Missing required fields"
- Check Cal.com webhook payload format
- Verify `startTime` is in the payload
- Check Vercel function logs for actual payload

### Webhook not receiving data
- Verify webhook URL in Cal.com settings
- Check Cal.com webhook is enabled
- Check Vercel function logs for incoming requests

### Client name not showing
- Cal.com payload structure may vary
- Check Vercel logs for actual payload structure
- Adjust extraction logic if needed

---

## 📊 How It Works

1. **Cal.com sends webhook** → Your API route (`/api/calcom`)
2. **API route processes** → Extracts `name`, `startTime`, `email`, `eventType`
3. **Inserts to Supabase** → `pipeline` table with:
   - `stage`: "discovery"
   - `client_name`: Booking attendee name/email
   - `deal_value`: 0
   - `date`: Booking date
   - `notes`: "Auto-added from Cal.com"
4. **Dashboard auto-refreshes** → New booking appears in Pipeline Widget (every 30 seconds)

---

## 🎯 Next Steps

Once verified:
- ✅ All Cal.com bookings will auto-sync to your pipeline
- ✅ Pipeline Widget will show real-time bookings
- ✅ No manual entry needed for Cal.com bookings

**Optional Enhancements:**
- Customize pipeline stage based on event type
- Extract deal value from booking
- Add webhook signature verification
- Handle booking cancellations

---

**Your Cal.com integration is ready!** 🎉

