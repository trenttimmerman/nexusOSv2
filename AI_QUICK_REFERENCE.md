# AI Generation - Quick Reference

## Setup (One-time)

1. Get OpenAI API key: https://platform.openai.com
2. Add to `.env`:
   ```
   VITE_OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart: `npm run dev`

## Product Description

**Location:** Product Editor → General Tab

**Steps:**
1. Enter product name
2. Click "Options" → Select tone & length
3. Click "Generate with AI"

**Options:**
- **Tone:** Professional, Casual, Luxury, Technical
- **Length:** Short (2-3 sentences), Medium (2-3 paragraphs), Long (4-5 paragraphs)

## Product Image

**Location:** Product Editor → Media Tab

**Steps:**
1. Enter product name & description
2. Click "AI Generate"
3. Wait 15-30 seconds

**Note:** Uses product name + description as context

## SEO Metadata

**Location:** Product Editor → SEO Tab

**Steps:**
1. Fill product name & description
2. Click "Generate with AI"

**Generates:**
- Page Title (60 chars)
- Meta Description (160 chars)
- URL Slug

## Category Description

**Location:** Category Manager

**Steps:**
1. Enter category name
2. Click ✨ (sparkle icon)

## Collection Description

**Location:** Collection Manager

**Steps:**
1. Enter collection name
2. Add products (optional, for context)
3. Click ✨ (sparkle icon)

## Costs

- Description: ~$0.0003 each
- Image: ~$0.04 each
- SEO: ~$0.0002 each

**100 products with images: ~$4**

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No AI service configured" | Add `VITE_OPENAI_API_KEY` to `.env` |
| "Failed to generate" | Check API key validity |
| Slow image generation | Normal (15-30 seconds) |
| Low quality output | Add more context/details |

## API Limits

Set spending limits at: https://platform.openai.com/account/limits

**Recommended:**
- Start with $10/month
- Monitor daily usage
- Alert at 80% capacity

---

**Full docs:** `AI_GENERATION_GUIDE.md`
