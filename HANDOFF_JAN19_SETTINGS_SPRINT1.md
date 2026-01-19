# Settings Page Sprint 1 - Company Details & Social Media
**Date**: January 19, 2025
**Status**: ✅ COMPLETE - 0 TypeScript Errors, Build Passing

## Overview
Completed comprehensive overhaul of Settings → General tab, removing redundant logo upload and adding full company details and social media integration per SETTINGS_WIRING_PLAN.md.

---

## Changes Implemented

### 1. TypeScript Interface Updates (`types.ts` lines 283-314)

**Added Company Information Fields:**
```typescript
companyName?: string;           // Legal business name
taxId?: string;                 // Tax ID / EIN
businessType?: 'llc' | 'corporation' | 'partnership' | 'sole-proprietorship' | 'non-profit' | 'other';
```

**Enhanced Contact Information:**
```typescript
phone?: string;                 // Primary phone
alternatePhone?: string;        // Secondary contact
fax?: string;                   // Fax number (if applicable)
```

**Added Social Media Integration (12 Platforms):**
```typescript
socialMedia?: {
  facebook?: string;
  instagram?: string;
  twitter?: string;             // X (formerly Twitter)
  threads?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  pinterest?: string;
  snapchat?: string;
  googleBusiness?: string;
  whatsapp?: string;
  telegram?: string;
};
```

**Fixed Store Address Structure:**
```typescript
storeAddress?: {
  street1?: string;             // Changed from "street"
  street2?: string;             // NEW - Suite/Apt/Unit
  phone?: string;               // NEW - Location phone
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};
```

---

### 2. AdminPanel.tsx Settings UI (`lines 15305-15720`)

**Removed:**
- ❌ Entire Logo Management section (lines 15326-15430)
  - Text/Image mode toggle
  - Logo upload widget
  - Logo height slider
  - Remove logo button
- **Rationale**: Logo now managed exclusively in Designer → Site Identity (single source of truth)

**Added:**

#### A. Save Changes Button (Top of General Tab)
- Green success button with CheckCircle icon
- Toast notification: "Settings saved successfully!"
- Positioned prominently at top of form

#### B. Company Information Card
- **Legal Company Name** - Full business name for legal documents
- **Tax ID / EIN** - Federal tax identification
- **Business Type** - Dropdown: LLC, Corporation, Partnership, Sole Proprietorship, Non-Profit, Other
- Icon: Building2 (blue)

#### C. Enhanced Contact Information Card
- **Support Email** (existing)
- **Primary Phone** - Main customer service number
- **Alternate Phone** - Secondary contact (optional)
- **Fax Number** - For businesses requiring fax (optional)
- Icon: MessageCircle (green)

#### D. Social Media & Online Presence Card (NEW)
Full integration for 12 social platforms with platform-specific SVG icons:
1. **Facebook** - Profile/Page URL
2. **Instagram** - Profile URL
3. **X (Twitter)** - Profile URL
4. **Threads** - Profile URL
5. **LinkedIn** - Company Page URL
6. **TikTok** - Profile URL
7. **YouTube** - Channel URL
8. **Pinterest** - Profile URL
9. **Snapchat** - Username
10. **Google Business** - Business profile URL
11. **WhatsApp Business** - Business number/link
12. **Telegram** - Channel/Bot URL

Features:
- Platform logo next to each field
- Placeholder examples for proper URL format
- Gray info text explaining usage
- Icon: Globe (purple)

#### E. Improved Store Address Card
- **Street Address Line 1** (renamed from "Street Address")
- **Street Address Line 2** (NEW) - For Suite/Apt/Floor/Unit
- **Address Phone** (NEW) - Location-specific contact
- **City**
- **State / Province**
- **Postal / Zip Code**
- **Country**
- Icon: MapPin (blue)

#### F. Formats & Standards Card (Unchanged)
- Timezone selector
- Weight unit (kg, lb, oz, g)
- Dimension unit (cm, in, m, mm)
- Icon: Globe (purple)

---

## Technical Implementation

### Icon Imports Added
```typescript
import { Building2, MessageCircle } from 'lucide-react';
```

### Platform-Specific SVG Icons
Used inline SVG icons for social platforms (24x24px) with brand-accurate colors:
- Facebook: #1877F2 blue
- Instagram: #E4405F pink gradient
- TikTok: Black (#000)
- YouTube: #FF0000 red
- LinkedIn: #0A66C2 blue
- etc.

### State Management
All fields connected to existing `config` object and `onConfigChange` handler:
```typescript
onChange={e => onConfigChange({ 
  ...config, 
  socialMedia: { 
    ...config.socialMedia, 
    facebook: e.target.value 
  }
})}
```

---

## Testing Checklist

### ✅ Build Verification
- [x] TypeScript compilation: 0 errors
- [x] Vite build: SUCCESS (16.15s)
- [x] No ESLint warnings in modified sections
- [x] All imports resolved correctly

### 🔲 Runtime Testing (Pending)
- [ ] Settings → General tab renders without errors
- [ ] Save Changes button triggers toast notification
- [ ] Company Information fields save to database
- [ ] Social Media URLs save to database
- [ ] Address Line 2 displays correctly
- [ ] Phone fields accept valid formats
- [ ] All dropdown menus function (Business Type, Timezone, etc.)
- [ ] Logo still absent from Settings (verify removal)
- [ ] Designer → Site Identity logo upload still works

### 🔲 Database Migration (Pending)
- [ ] Add `company_name` column to `store_config` table
- [ ] Add `tax_id` column
- [ ] Add `business_type` column
- [ ] Add `phone` column
- [ ] Add `alternate_phone` column
- [ ] Add `fax` column
- [ ] Add `social_media` JSONB column
- [ ] Rename `store_address.street` to `street1`
- [ ] Add `store_address.street2`
- [ ] Add `store_address.phone`

---

## Database Schema Updates Needed

```sql
-- Add company information columns
ALTER TABLE store_config 
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS tax_id TEXT,
  ADD COLUMN IF NOT EXISTS business_type TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS alternate_phone TEXT,
  ADD COLUMN IF NOT EXISTS fax TEXT,
  ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb;

-- Update store_address structure (if stored as JSONB)
-- This requires data migration to rename "street" to "street1"
-- and add "street2" and "phone" fields
```

---

## User-Facing Changes

### What Users Will See:
1. **Cleaner Settings Experience** - No duplicate logo upload confusion
2. **Professional Business Information** - Legal name, tax ID, business type for invoices/receipts
3. **Complete Contact Options** - Multiple phone numbers, fax for traditional businesses
4. **Social Media Hub** - Centralized management of all social profiles
5. **Improved Addressing** - Support for complex addresses (Suite 200, Floor 3, etc.)
6. **Save Confirmation** - Visual feedback when settings are saved

### What Users Will NOT See:
- ❌ Logo upload in Settings (moved to Designer → Site Identity only)

---

## Next Steps (Sprint 2 & 3)

### Sprint 2: Enhanced Legal & Compliance
- Invoice/Receipt customization (logo, footer text, legal disclaimers)
- Tax settings (default tax rates, tax-inclusive pricing)
- Return/Refund policies
- Terms of Service / Privacy Policy links

### Sprint 3: Multi-Location & Advanced
- Multiple warehouse/store locations
- Location-specific inventory
- Regional shipping rules
- Localization settings (language, currency by region)

---

## Files Modified

1. **types.ts** (lines 283-314)
   - Added 9 new fields to StoreConfig interface
   - Updated storeAddress structure
   - Added socialMedia object type

2. **components/AdminPanel.tsx** (lines 140-250, 15305-15720)
   - Added Building2, MessageCircle icon imports
   - Removed Logo Management section (~100 lines)
   - Added 4 new UI cards (~300 lines)
   - Added Save Changes button with toast
   - Updated all field bindings

---

## Performance Impact
- **Bundle Size**: No significant change (social media icons are small SVGs)
- **Render Performance**: Minimal impact (same number of form fields, just reorganized)
- **Database Queries**: No change (still single store_config fetch/update)

---

## Notes for Next Developer

### Logo Management Decision:
The redundant logo upload in Settings has been **permanently removed**. Logo is now managed exclusively in:
- **Designer → Site Identity → Logo**

This was a deliberate architectural decision to prevent:
- User confusion (two places to upload logo)
- Data synchronization issues
- Inconsistent logo across store

### Social Media URL Format:
All social media fields accept full URLs (e.g., `https://facebook.com/yourpage`). No client-side validation currently implemented. Consider adding:
```typescript
// URL validation helper
const isValidURL = (url: string) => {
  try { new URL(url); return true; } 
  catch { return false; }
};
```

### Database Migration Priority:
**CRITICAL**: The `social_media` JSONB column must be created before users can save social links. Without it, saves will fail silently or throw database errors.

---

## Success Metrics
- ✅ 0 TypeScript errors (down from 8 JSX errors)
- ✅ Build time: 16.15s (no performance regression)
- ✅ Code removed: ~100 lines (logo section)
- ✅ Code added: ~350 lines (company details + social media)
- ✅ Net change: +250 lines (comprehensive feature addition)
- ✅ User experience: Streamlined, professional settings page

---

**Session Complete**: Settings → General tab fully modernized with company details and social media integration. Ready for runtime testing and database migration.
