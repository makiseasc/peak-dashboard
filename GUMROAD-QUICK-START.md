# 🛒 Gumroad Webhook - Quick Start

## ✅ What's Been Set Up

1. **API Route Created:** `app/api/gumroad/route.ts`
   - Handles POST requests from Gumroad
   - Converts price from cents to dollars
   - Inserts into Supabase `revenue` table

2. **Supabase Client Updated:** `lib/supabase.ts`
   - Added `createClient()` function for server-side use
   - Works in API routes

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
https://your-vercel-domain.vercel.app/api/gumroad
```

**Option B: Via n8n (as you mentioned)**
```
https://makiseops.app.n8n.cloud/webhook/gumroad-sale
```

---

### Step 3: Configure in Gumroad

1. Go to [Gumroad Settings → Advanced](https://gumroad.com/settings/advanced)
2. Scroll to **Webhooks**
3. Click **Add Webhook**
4. Paste your webhook URL
5. Select event: **Sale**
6. Save

---

## 🧪 Test Locally

```bash
# Make script executable (if needed)
chmod +x test-gumroad-webhook.sh

# Run test
./test-gumroad-webhook.sh
```

Or manually:

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

**Expected Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Revenue entry created successfully"
}
```

**Verify:**
- Check Supabase Table Editor → `revenue` table
- Should see entry with `source: "gumroad"` and `amount: 29.99`

---

## ✅ Verification Checklist

- [ ] Code deployed to Vercel
- [ ] Webhook URL added in Gumroad
- [ ] Test sale made (or test webhook sent)
- [ ] Entry appears in Supabase `revenue` table
- [ ] Entry appears in Revenue Widget on dashboard
- [ ] Vercel function logs show success

---

## 🐛 Troubleshooting

### "Supabase credentials not configured"
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- In Vercel, add these as environment variables

### "Missing required fields"
- Check Gumroad webhook payload format
- Verify `price` and `created_at` are in the payload
- Check Vercel function logs for actual payload

### Webhook not receiving data
- Verify webhook URL in Gumroad settings
- Check Gumroad webhook is enabled
- Check Vercel function logs for incoming requests

---

## 📊 How It Works

1. **Gumroad sends webhook** → Your API route (`/api/gumroad`)
2. **API route processes** → Extracts `price`, `product_name`, `created_at`
3. **Converts price** → Divides by 100 (cents → dollars)
4. **Inserts to Supabase** → `revenue` table with `source: "gumroad"`
5. **Dashboard auto-refreshes** → New sale appears in Revenue Widget (every 30 seconds)

---

## 🎯 Next Steps

Once verified:
- ✅ All Gumroad sales will auto-sync to your dashboard
- ✅ Revenue Widget will show real-time sales
- ✅ No manual entry needed for Gumroad sales

**Optional Enhancements:**
- Add webhook signature verification
- Handle refunds (if needed)
- Track product-specific metrics
- Add email notifications for sales

---

**Your Gumroad integration is ready!** 🎉

