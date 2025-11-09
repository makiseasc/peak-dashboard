# 📅 Cal.com Webhook Integration

## Setup Guide

### 1. Deploy Your API Route

The webhook endpoint is at:
```
POST /api/calcom
```

**Production URL:**
```
https://your-vercel-domain.vercel.app/api/calcom
```

**Or via n8n (as you mentioned):**
```
https://makiseops.app.n8n.cloud/webhook/calcom-booking
```

---

## 2. Configure Cal.com Webhook

1. Go to [Cal.com Settings](https://cal.com/settings/developer/webhooks)
2. Click **Add Webhook**
3. Enter your webhook URL:
   - Direct: `https://your-vercel-domain.vercel.app/api/calcom`
   - Via n8n: `https://makiseops.app.n8n.cloud/webhook/calcom-booking`
4. Select events: **Booking Created** (or **Booking Confirmed**)
5. Save

---

## 3. Webhook Payload Format

Cal.com sends webhooks with this structure:

```json
{
  "triggerEvent": "BOOKING_CREATED",
  "createdAt": "2024-01-15T10:30:00Z",
  "payload": {
    "id": 12345,
    "title": "Discovery Call",
    "startTime": "2024-01-20T14:00:00Z",
    "endTime": "2024-01-20T14:30:00Z",
    "attendees": [
      {
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "eventType": {
      "title": "30min Discovery Call"
    }
  }
}
```

**Note:** The code extracts:
- `name` or `email` from attendees for client_name
- `startTime` for booking date
- `eventType.title` as fallback for client_name

---

## 4. Testing the Webhook

### Option A: Test Locally with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose localhost
ngrok http 3000

# Use the ngrok URL in Cal.com webhook settings
# e.g., https://abc123.ngrok.io/api/calcom
```

### Option B: Test with curl

```bash
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

### Option C: Use Cal.com Test Mode

1. In Cal.com webhook settings, enable **Test Mode**
2. Create a test booking
3. Check your Supabase `pipeline` table for the entry

---

## 5. Verify It's Working

1. Create a test booking on Cal.com
2. Check Supabase **Table Editor** → `pipeline` table
3. You should see a new entry with:
   - `stage`: "discovery"
   - `client_name`: Booking attendee name/email
   - `deal_value`: 0
   - `date`: Booking date
   - `notes`: "Auto-added from Cal.com"

4. Check your Pipeline Widget on the dashboard
5. The new booking should appear automatically (refreshes every 30 seconds)

---

## 6. Troubleshooting

### Webhook not receiving data
- Check Cal.com webhook settings (URL is correct)
- Verify webhook is enabled
- Check Vercel logs: **Deployments** → **Functions** → `/api/calcom`
- Check Supabase logs: **Logs** → **API Logs**

### "Missing required fields" error
- Verify Cal.com webhook payload format
- Check Vercel function logs for actual payload
- Adjust code in `app/api/calcom/route.ts` if needed

### Data not appearing in dashboard
- Check Supabase Table Editor directly
- Verify RLS policies allow inserts
- Check browser console for errors
- Wait 30 seconds for auto-refresh, or manually refresh

### Client name not showing correctly
- Cal.com payload structure may vary
- Check Vercel logs for actual payload
- Adjust extraction logic in webhook handler

---

## 7. Webhook Security (Optional)

For production, consider adding webhook verification:

1. **Cal.com Webhook Secret:**
   - Get secret from Cal.com webhook settings
   - Add to `.env.local`: `CAL_COM_WEBHOOK_SECRET=your_secret`
   - Verify signature in webhook handler

2. **IP Whitelisting:**
   - Cal.com webhook IPs: Check Cal.com docs
   - Add IP check in webhook handler

3. **Rate Limiting:**
   - Add rate limiting to prevent abuse

---

## 8. Advanced: Customize Pipeline Stage

You can customize the pipeline stage based on event type:

```typescript
// In app/api/calcom/route.ts
const eventType = booking.eventType?.title || '';
let stage = 'discovery';

if (eventType.includes('Proposal')) {
  stage = 'proposal';
} else if (eventType.includes('Follow-up')) {
  stage = 'negotiation';
}

// Use stage variable in insert
```

---

## 9. Advanced: Extract Deal Value

If you want to extract deal value from booking:

```typescript
// In app/api/calcom/route.ts
const dealValue = booking.eventType?.price || 0;
// Or parse from custom fields
```

---

## ✅ Checklist

- [ ] API route deployed to Vercel
- [ ] Webhook URL configured in Cal.com
- [ ] Test booking created
- [ ] Entry appears in Supabase `pipeline` table
- [ ] Entry appears in Pipeline Widget
- [ ] Webhook logs show success in Vercel

---

## 📊 How It Works

1. **Cal.com sends webhook** → Your API route (`/api/calcom`)
2. **API extracts** → `name`, `startTime`, `email`, `eventType`
3. **Inserts to Supabase** → `pipeline` table with `stage: "discovery"`
4. **Dashboard auto-refreshes** → New booking appears in Pipeline Widget (every 30 seconds)

---

**Your Cal.com integration is ready!** 🎉

