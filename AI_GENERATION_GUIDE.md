# AI Generation Guide for NexusOS

## Overview

NexusOS now includes powerful AI-powered content generation for products, categories, and collections using OpenAI's GPT-4 and DALL-E 3 APIs.

## Features

### 1. **AI Text Generation**
- **Product Descriptions**: Generate compelling, SEO-friendly product descriptions
- **Category Descriptions**: Create engaging category descriptions that entice customers
- **Collection Descriptions**: Craft curated collection descriptions with product context
- **SEO Metadata**: Auto-generate page titles, meta descriptions, and URL slugs

### 2. **AI Image Generation**
- **Product Images**: Generate high-quality product images using DALL-E 3
- **Context-Aware**: Uses product name and description as context for better results
- **Multiple Styles**: Choose from photorealistic, minimalist, artistic, or product-shot styles
- **Automatic Upload**: Generated images are automatically uploaded to Supabase storage

## Setup

### 1. Get an OpenAI API Key

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-...`)

### 2. Configure Environment Variables

Add to your `.env` file:

```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Restart Development Server

```bash
npm run dev
```

## Usage

### Product Editor

#### Generate Product Description

1. Open Product Editor (click "Add Product" or edit existing product)
2. Enter a product name
3. Navigate to the **General** tab
4. Click **Options** button next to description field
5. Select tone (professional, casual, luxury, technical)
6. Select length (short, medium, long)
7. Click **Generate with AI**

**Tone Options:**
- **Professional**: Informative and trustworthy
- **Casual**: Friendly and conversational
- **Luxury**: Premium and aspirational
- **Technical**: Detailed and specification-focused

**Length Options:**
- **Short**: 2-3 sentences
- **Medium**: 2-3 paragraphs
- **Long**: 4-5 paragraphs with bullet points

#### Generate Product Image

1. Open Product Editor
2. Navigate to the **Media** tab
3. Enter product name and description first
4. Click **AI Generate** button
5. Wait 10-30 seconds for image generation
6. Generated image will be automatically uploaded and set as primary

**Image Generation Notes:**
- Requires product name at minimum
- Better results with detailed descriptions
- Uses photorealistic product-shot style by default
- Images are 1024x1024 pixels
- Automatically uploaded to Supabase storage

#### Generate SEO Metadata

1. Open Product Editor
2. Navigate to the **SEO** tab
3. Ensure product name and description are filled
4. Click **Generate with AI**
5. Review and edit the generated:
   - Page Title (optimized for search engines, max 60 chars)
   - Meta Description (compelling CTA, max 160 chars)
   - URL Slug (SEO-friendly, lowercase with hyphens)

### Category Manager

#### Generate Category Description

1. Open Category Manager (Admin Panel → Categories)
2. Click "Add Category" or edit existing category
3. Enter category name
4. Click **Sparkle** icon (✨) next to description field
5. AI will generate a 2-3 sentence category description

### Collection Manager

#### Generate Collection Description

1. Open Collection Manager (Admin Panel → Collections)
2. Click "Add Collection" or edit existing collection
3. Enter collection name
4. Add products to collection (for better context)
5. Click **Sparkle** icon (✨) next to description field
6. AI will generate description using product context

## API Reference

### AIService Class

Located in `/services/aiService.ts`

#### `generateProductDescription(options)`

Generate product description using AI.

**Parameters:**
```typescript
{
  productName?: string;
  category?: string;
  existingDescription?: string;
  tone?: 'professional' | 'casual' | 'luxury' | 'technical';
  length?: 'short' | 'medium' | 'long';
  context?: string;
}
```

**Returns:** `Promise<string>` - HTML formatted description

**Example:**
```typescript
const description = await AIService.generateProductDescription({
  productName: 'Cyber Shell Jacket',
  category: 'Outerwear',
  tone: 'luxury',
  length: 'medium'
});
```

#### `generateProductImage(options)`

Generate product image using DALL-E 3.

**Parameters:**
```typescript
{
  productName: string;
  description: string;
  style?: 'photorealistic' | 'minimalist' | 'artistic' | 'product-shot';
  aspectRatio?: '1:1' | '16:9' | '4:3';
}
```

**Returns:** `Promise<string>` - URL of generated image

**Example:**
```typescript
const imageUrl = await AIService.generateProductImage({
  productName: 'Cyber Shell Jacket',
  description: 'A futuristic waterproof jacket with LED accents',
  style: 'photorealistic'
});
```

#### `generateSEO(productName, description, category)`

Generate SEO metadata.

**Parameters:**
- `productName: string`
- `description: string`
- `category: string`

**Returns:** `Promise<{ title: string; description: string; slug: string }>`

**Example:**
```typescript
const seo = await AIService.generateSEO(
  'Cyber Shell Jacket',
  '<p>A futuristic waterproof jacket...</p>',
  'Outerwear'
);
// Returns:
// {
//   title: "Cyber Shell Jacket | Nexus",
//   description: "Experience the future of outerwear with our Cyber Shell Jacket...",
//   slug: "cyber-shell-jacket"
// }
```

#### `generateCategoryDescription(categoryName, existingDescription?)`

Generate category description.

**Returns:** `Promise<string>` - HTML formatted description

#### `generateCollectionDescription(collectionName, existingDescription?, productContext?)`

Generate collection description with product context.

**Returns:** `Promise<string>` - HTML formatted description

#### `isConfigured()`

Check if AI services are configured.

**Returns:** `boolean` - True if OpenAI API key is set

#### `getConfigMessage()`

Get configuration status message.

**Returns:** `string` - Configuration status or setup instructions

## Cost Estimation

### OpenAI Pricing (as of 2025)

**GPT-4o-mini (Text Generation):**
- Input: $0.00015 / 1K tokens
- Output: $0.00060 / 1K tokens
- **Typical product description**: ~$0.0003 per generation

**DALL-E 3 (Image Generation):**
- Standard quality 1024x1024: $0.040 per image
- **Typical product image**: $0.04 per generation

**Estimated costs for 100 products:**
- Descriptions: ~$0.03
- Images: ~$4.00
- SEO metadata: ~$0.02
- **Total: ~$4.05**

## Best Practices

### 1. **Provide Context**
- Enter product name before generating
- Add category for better context
- Existing descriptions will be improved, not replaced

### 2. **Review AI Output**
- Always review and edit AI-generated content
- Ensure accuracy of technical specifications
- Verify brand voice consistency

### 3. **Optimize Prompts**
- Be specific with product names
- Choose appropriate tone for your brand
- Use longer descriptions for complex products

### 4. **Image Generation Tips**
- Describe products clearly in description field
- Simple products work better than complex scenes
- Review and regenerate if needed
- Consider uploading real photos for critical products

### 5. **SEO Optimization**
- Generate SEO after finalizing description
- Check character counts (60 for title, 160 for description)
- Edit slugs for brand consistency

## Troubleshooting

### "Failed to generate description"

**Causes:**
- Missing OpenAI API key
- Invalid API key
- Network connectivity issues
- OpenAI API rate limit exceeded

**Solutions:**
1. Check `.env` file for `VITE_OPENAI_API_KEY`
2. Verify API key is valid at [platform.openai.com](https://platform.openai.com)
3. Check network connection
4. Wait a moment if rate limited

### "No AI service configured"

**Solution:**
Add `VITE_OPENAI_API_KEY` to your `.env` file and restart the dev server.

### Image generation takes too long

**Expected behavior:**
- Image generation typically takes 10-30 seconds
- DALL-E 3 is slower but produces higher quality
- Be patient, don't click multiple times

### Generated content is low quality

**Solutions:**
- Provide more context in product name and category
- Try different tone/length options
- Edit the generated content to improve it
- Regenerate if not satisfied

## Fallback Options

NexusOS also supports **Google AI (Gemini)** as a fallback for text generation:

```env
VITE_GOOGLE_AI_API_KEY=your-google-ai-key
```

Priority order:
1. OpenAI (if configured) - supports both text and images
2. Google AI (if configured) - text only
3. Manual entry

## Security Notes

⚠️ **API Key Security:**
- Never commit `.env` file to version control
- Keep API keys secure
- Rotate keys periodically
- Monitor API usage on OpenAI dashboard
- Set spending limits on OpenAI account

## Future Enhancements

Planned features:
- [ ] Bulk generation for multiple products
- [ ] AI variant title generation
- [ ] Multi-language description generation
- [ ] Image style presets
- [ ] Batch image generation
- [ ] AI-powered product tagging
- [ ] Review/rating summary generation
- [ ] A/B testing for descriptions

## Support

For issues or questions:
- Check console for error messages
- Verify API key configuration
- Review OpenAI API status: [status.openai.com](https://status.openai.com)
- Check NexusOS documentation

---

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Author:** NexusOS Team
