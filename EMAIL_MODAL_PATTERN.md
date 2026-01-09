# Email Signup Modal - Editing Tools Pattern Implementation

## Overview
This document demonstrates the complete pattern for adding editing tools to section modals in the Design Studio. The Email Signup modal serves as the reference implementation for all other section modals.

## Pattern Components

### 1. Field Mapping
Define which fields are available for each variant:
```typescript
const EMAIL_FIELDS: Record<string, string[]> = {
  'email-minimal': ['heading', 'subheading', 'buttonText', 'placeholderText'],
  'email-split': ['heading', 'subheading', 'buttonText', 'placeholderText', 'image'],
  'email-card': ['heading', 'subheading', 'buttonText', 'placeholderText', 'disclaimer'],
};

const availableFields = EMAIL_FIELDS[currentVariant] || [];
```

### 2. Update Function
Create a helper function to update block data:
```typescript
const updateEmailData = (updates: Partial<typeof emailData>) => {
  updateActiveBlockData(selectedBlockId, { ...emailData, ...updates });
};
```

### 3. AI Generation Function
Implement AI-powered content generation:
```typescript
const generateEmailCopy = async (field: string) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKeys.gemini || '');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompts: Record<string, string> = {
      heading: `Generate a catchy, short email signup heading...`,
      subheading: `Generate a compelling email signup subheading...`,
      buttonText: `Generate short CTA button text...`,
      disclaimer: `Generate a short privacy/spam disclaimer...`,
    };

    const result = await model.generateContent(prompts[field]);
    const text = result.response.text().trim();
    updateEmailData({ [field]: text });
  } catch (error) {
    console.error('AI generation failed:', error);
  }
};
```

### 4. Modal Structure
The modal follows the 30/70 split pattern:

**Left Panel (30% width):**
- Variant selector (existing)
- Divider
- "Customize Content" section header
- Dynamic editing fields based on `availableFields`

**Right Panel (70% width):**
- Live preview of selected variant

### 5. Editing Fields

Each field type follows a consistent pattern:

**Text Input with AI:**
```tsx
{availableFields.includes('heading') && (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <label className="text-xs text-neutral-400">Heading</label>
      <button 
        onClick={() => generateEmailCopy('heading')}
        className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
        title="Generate with AI"
      >
        <Wand2 size={12} />
      </button>
    </div>
    <input
      type="text"
      value={emailData.heading || ''}
      onChange={(e) => updateEmailData({ heading: e.target.value })}
      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
      placeholder="Join the Newsletter"
    />
  </div>
)}
```

**Textarea with AI:**
```tsx
{availableFields.includes('subheading') && (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <label className="text-xs text-neutral-400">Subheading</label>
      <button 
        onClick={() => generateEmailCopy('subheading')}
        className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
        title="Generate with AI"
      >
        <Wand2 size={12} />
      </button>
    </div>
    <textarea
      value={emailData.subheading || ''}
      onChange={(e) => updateEmailData({ subheading: e.target.value })}
      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none resize-none"
      rows={3}
      placeholder="Subscribe to get special offers..."
    />
  </div>
)}
```

**Simple Text Input (no AI):**
```tsx
{availableFields.includes('placeholderText') && (
  <div className="space-y-1.5">
    <label className="text-xs text-neutral-400">Email Placeholder</label>
    <input
      type="text"
      value={emailData.placeholderText || ''}
      onChange={(e) => updateEmailData({ placeholderText: e.target.value })}
      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
      placeholder="Enter your email"
    />
  </div>
)}
```

**Image URL Input with Library Button:**
```tsx
{availableFields.includes('image') && (
  <div className="space-y-1.5">
    <label className="text-xs text-neutral-400">Background Image</label>
    <input
      type="text"
      value={emailData.image || ''}
      onChange={(e) => updateEmailData({ image: e.target.value })}
      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
      placeholder="https://..."
    />
    <button
      onClick={() => {
        // Open media library in future
        console.log('Media library integration coming soon');
      }}
      className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-400 transition-colors flex items-center justify-center gap-2"
    >
      <ImageIcon size={14} />
      Choose from Library
    </button>
  </div>
)}
```

## Component Updates

Update the corresponding Library component to use the data fields:

**Before:**
```tsx
<input type="email" placeholder="Enter your email" className="..." />
<button className="...">Subscribe</button>
```

**After:**
```tsx
<input 
  type="email" 
  placeholder={data?.placeholderText || 'Enter your email'} 
  className="..." 
/>
<button className="...">
  {data?.buttonText || 'Subscribe'}
</button>
```

## Color Coding

Each modal uses theme-specific colors for focus states:
- **Hero Modal**: Purple (`focus:border-purple-500`)
- **Email Modal**: Emerald (`focus:border-emerald-500`)
- **Social Modal**: Pink (`focus:border-pink-500`)
- **Scroll Modal**: Cyan (`focus:border-cyan-500`)
- etc.

## Next Steps

Apply this pattern to remaining 11 modals:
1. ✅ **Email Signup** - COMPLETED (reference implementation)
2. Scroll Effects
3. Social Proof
4. Rich Text
5. Collapsible Content
6. Logo List
7. Promo Banner
8. Gallery
9. Blog
10. Video
11. Contact
12. Layout

For each modal:
1. Add field mapping constant
2. Add update function
3. Add AI generation function (where applicable)
4. Add editing fields in left panel
5. Update library component to use data fields
6. Test all variants

## Files Modified
- `/workspaces/nexusOSv2/components/AdminPanel.tsx` - Added editing controls to Email modal
- `/workspaces/nexusOSv2/components/SectionLibrary.tsx` - Updated Email components to use data fields

## Build Status
✅ Build successful (11.33s)
✅ No TypeScript errors
✅ Ready for testing
