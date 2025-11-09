# 🛒 Gumroad Webhook Integration

## Setup Guide

### 1. Deploy Your API Route

The webhook endpoint is at:
```
POST /api/gumroad
```

**Production URL:**
```
https://your-vercel-domain.vercel.app/api/gumroad
```

**Or via n8n (as you mentioned):**
```
https://makiseops.app.n8n.cloud/webhook/gumroad-sale
```

---

## 2. Configure Gumroad Webhook

1. Go to [Gumroad Settings](https://gumroad.com/settings/advanced)
2. Scroll to **Webhooks** section
3. Click **Add Webhook**
4. Enter your webhook URL:
   - Direct: `https://your-vercel-domain.vercel.app/api/gumroad`
   - Via n8n: `https://makiseops.app.n8n.cloud/webhook/gumroad-sale`
5. Select events: **Sale** (or **Sale Refund** if needed)
6. Save

---

## 3. Webhook Payload Format

Gumroad sends webhooks with this structure:

```json
{
  "sale_id": "abc123",
  "product_name": "Your Product Name",
  "price": 2999,  // in cents
  "created_at": "2024-01-15T10:30:00Z",
  "email": "customer@example.com",
  "purchaser_email": "customer@example.com",
  // ... other fields
}
```

**Note:** The code converts `price` from cents to dollars automatically.

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

# Use the ngrok URL in Gumroad webhook settings
# e.g., https://abc123.ngrok.io/api/gumroad
```

### Option B: Test with curl

```bash
curl -X POST http://localhost:3000/api/gumroad \
  -H "Content-Type: application/json" \
  -d '{
    "sale_id": "test123",
    "product_name": "Test Product",
    "price": 2999,
    "created_at": "2024-01-15T10:30:00Z"
  }'
```

### Option C: Use Gumroad Test Mode

1. In Gumroad webhook settings, enable **Test Mode**
2. Make a test purchase
3. Check your Supabase `revenue` table for the entry

---

## 5. Verify It's Working

1. Make a test sale on Gumroad
2. Check Supabase **Table Editor** → `revenue` table
3. You should see a new entry with:
   - `source`: "gumroad"
   - `amount`: converted to dollars
   - `description`: product name
   - `date`: sale date

4. Check your Revenue Widget on the dashboard
5. The new sale should appear automatically (refreshes every 30 seconds)

---

## 6. Troubleshooting

### Webhook not receiving data
- Check Gumroad webhook settings (URL is correct)
- Verify webhook is enabled
- Check Vercel logs: **Deployments** → **Functions** → `/api/gumroad`
- Check Supabase logs: **Logs** → **API Logs**

### "Missing required fields" error
- Verify Gumroad webhook payload format
- Check Vercel function logs for actual payload
- Adjust code in `app/api/gumroad/route.ts` if needed

### Data not appearing in dashboard
- Check Supabase Table Editor directly
- Verify RLS policies allow inserts
- Check browser console for errors
- Wait 30 seconds for auto-refresh, or manually refresh

### Price conversion issues
- Gumroad sends price in cents (e.g., 2999 = $29.99)
- Code divides by 100 automatically
- If your Gumroad sends dollars, remove the `/100` division

---

## 7. Webhook Security (Optional)

For production, consider adding webhook verification:

1. **Gumroad Webhook Secret:**
   - Get secret from Gumroad webhook settings
   - Add to `.env.local`: `GUMROAD_WEBHOOK_SECRET=your_secret`
   - Verify signature in webhook handler

2. **IP Whitelisting:**
   - Gumroad webhook IPs: Check Gumroad docs
   - Add IP check in webhook handler

3. **Rate Limiting:**
   - Add rate limiting to prevent abuse

---

## 8. Advanced: Multiple Products

If you want to track different product types:

```typescript
// In app/api/gumroad/route.ts
const productType = body.product_permalink || 'unknown';
const description = `${product_name} (${productType})`;
```

---

## ✅ Checklist

- [ ] API route deployed to Vercel
- [ ] Webhook URL configured in Gumroad
- [ ] Test sale made
- [ ] Entry appears in Supabase `revenue` table
- [ ] Entry appears in Revenue Widget
- [ ] Webhook logs show success in Vercel

---

**Your webhook is ready!** 🎉

