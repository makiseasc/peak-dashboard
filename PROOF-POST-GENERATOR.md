# 🎯 Proof Post Generator - Setup Guide

## ✅ What's Been Created

### 1. API Route
- **POST** `/api/proof` - Generates AI-powered proof posts
  - Accepts `type`: `'twitter'` or `'linkedin'`
  - Fetches latest revenue and monthly revenue from Supabase
  - Calls Claude API to generate platform-specific posts
  - Returns generated post content and metrics

### 2. RevenueWidget Integration
- **Proof Post Generator Section** - Added to Revenue Widget
  - Only shows when revenue > 0
  - Two buttons: "🐦 Twitter Proof" and "💼 LinkedIn Proof"
  - Loading states while generating
  - Displays generated post
  - Copy to clipboard button

---

## 🚀 How It Works

### Twitter Posts
- **Format:** Confident, calm founder tweet (max 280 chars)
- **Content:** Monthly revenue, Tesla-trained methodology, next milestone
- **Tone:** No hype, just facts
- **Includes:** 🔱 emoji

### LinkedIn Posts
- **Format:** 2-3 sentence professional post
- **Content:** Monthly revenue, constraint elimination methodology, Tesla background
- **Tone:** Professional
- **Includes:** Proof point about client results (15-25 hrs/week saved)

---

## 📊 Features

### AI-Powered Generation
- Uses Claude API to generate platform-specific posts
- Customized prompts for Twitter vs LinkedIn
- Includes revenue metrics automatically
- Mentions Tesla methodology and results

### User Experience
- One-click generation
- Loading states
- Copy to clipboard
- Toast notifications
- Only shows when revenue exists

### Fallback Mode
- Works without Claude API key
- Shows basic proof post template
- Includes revenue metrics
- Note about configuring API key

---

## 🔧 Configuration

### Claude API Key

The Proof Post Generator uses the same Claude API key as the Daily Report:

**Environment Variable:**
```bash
ANTHROPIC_API_KEY=your_claude_api_key_here
```

**Or:**
```bash
CLAUDE_API_KEY=your_claude_api_key_here
```

### Customize Prompts

Edit `app/api/proof/route.ts`:

```typescript
const prompt = type === 'twitter'
  ? `Your custom Twitter prompt...`
  : `Your custom LinkedIn prompt...`;
```

### Change Model

Edit `app/api/proof/route.ts`:

```typescript
model: 'claude-3-5-sonnet-20241022', // Change this
```

Available models:
- `claude-3-5-sonnet-20241022` (recommended)
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307` (faster, cheaper)

---

## 🧪 Testing

### Test Without API Key

1. Don't add `ANTHROPIC_API_KEY` to `.env.local`
2. Click "🐦 Twitter Proof" or "💼 LinkedIn Proof"
3. Should see fallback post with revenue metrics

### Test With API Key

1. Add `ANTHROPIC_API_KEY` to `.env.local`
2. Restart dev server
3. Click "🐦 Twitter Proof" or "💼 LinkedIn Proof"
4. Should see AI-generated post

### Test API Directly

```bash
# Test Twitter post
curl -X POST http://localhost:3000/api/proof \
  -H "Content-Type: application/json" \
  -d '{"type": "twitter"}'

# Test LinkedIn post
curl -X POST http://localhost:3000/api/proof \
  -H "Content-Type: application/json" \
  -d '{"type": "linkedin"}'
```

**Expected Response:**
```json
{
  "content": "Generated post text...",
  "metrics": {
    "latestRevenue": 1000,
    "monthlyRevenue": 5000
  }
}
```

---

## 🐛 Troubleshooting

### "Failed to generate proof post"
- Check `ANTHROPIC_API_KEY` is set in `.env.local`
- Verify API key is valid
- Check Vercel function logs for errors
- Ensure API key has credits/quota

### "Claude API error"
- Check API key is correct
- Verify Anthropic account has credits
- Check rate limits
- Review API response in logs

### Post not showing
- Check browser console for errors
- Verify API route is accessible
- Check network tab for failed requests
- Ensure Supabase has revenue data

### Buttons not showing
- Verify revenue total > 0
- Check Revenue Widget has data
- Ensure revenue entries exist in Supabase

### Copy to clipboard not working
- Check browser permissions
- Verify HTTPS (required for clipboard API)
- Try manual copy if needed

---

## 💡 Customization

### Add More Platforms

Edit `app/api/proof/route.ts`:

```typescript
if (!type || !['twitter', 'linkedin', 'instagram'].includes(type)) {
  // Add new platform
}

// Add new prompt
const prompt = type === 'instagram'
  ? `Your Instagram prompt...`
  : // existing prompts
```

### Customize Post Content

Modify prompts in `app/api/proof/route.ts`:

```typescript
const prompt = type === 'twitter'
  ? `Write a [style] tweet about [metrics]. [requirements].`
  : `Write a [format] LinkedIn post about [metrics]. [tone].`;
```

### Add More Metrics

Include additional data in prompts:

```typescript
const prompt = `... 
Revenue: $${monthlyRevenue}
Pipeline: ${activePipeline} deals
HLAs: ${completedHLA}/${totalHLA} completed
...`;
```

---

## ✅ Verification Checklist

- [ ] Claude API key obtained (or using fallback mode)
- [ ] `ANTHROPIC_API_KEY` added to `.env.local` (optional)
- [ ] Environment variable added to Vercel (optional)
- [ ] Local dev server running
- [ ] Revenue Widget visible on dashboard
- [ ] Revenue data exists (total > 0)
- [ ] "Generate Proof Post" section visible
- [ ] Twitter button works
- [ ] LinkedIn button works
- [ ] Post generates successfully
- [ ] Copy to clipboard works
- [ ] Deployed to Vercel

---

## 🎯 Usage Tips

### Best Practices
1. **Generate after adding revenue** - Best results with recent data
2. **Review before posting** - AI-generated content should be reviewed
3. **Customize if needed** - Edit generated posts before posting
4. **Use appropriate platform** - Twitter vs LinkedIn have different tones

### When to Use
- After hitting revenue milestones
- Monthly revenue updates
- Quarterly reports
- Client success stories

### Post Ideas
- Monthly revenue milestones
- Client results and testimonials
- Methodology insights
- Growth updates

---

## 🎉 You're Ready!

Your Proof Post Generator is complete! Click "🐦 Twitter Proof" or "💼 LinkedIn Proof" to generate AI-powered proof posts based on your revenue data.

**Next Steps:**
- Customize prompts for your brand voice
- Add more platforms (Instagram, etc.)
- Integrate with social media scheduling tools
- Add post history/saving feature

---

**Your Proof Post Generator is ready!** 🎯✨

