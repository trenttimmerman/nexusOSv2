# NexusOS v2 - Handoff Document
## December 17, 2025

---

## Session Summary

This session focused on:
1. Setting up a new Vercel deployment
2. Connecting to Supabase (unpaused existing project)
3. Adding a live preview panel to SimpleWizard
4. Attempting to connect wizard design choices to the actual storefront output

---

## Current Deployment

- **Vercel Project**: `nexus-os-v2` (in 333-production2025 team)
- **Production URL**: https://nexus-os-v2-18u4o7qhk-333-production2025.vercel.app
- **Supabase Project**: `supabase-nexusos2`
  - Reference ID: `fwgufmjraxiadtnxkymi`
  - URL: `https://fwgufmjraxiadtnxkymi.supabase.co`

### Environment Variables (set in Vercel)
```
VITE_SUPABASE_URL=https://fwgufmjraxiadtnxkymi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Z3VmbWpyYXhpYWR0bnhreW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1OTg3MzgsImV4cCI6MjA4MDE3NDczOH0.lXuhTCnWm2cKf76hNozQNYyo8F44GOCobalLpjiTM-Q
```

### Superuser Account
- **Email**: trent@3thirty3.ca
- **Role**: superuser

---

## What Was Built This Session

### 1. SimpleWizard Live Preview Panel
**File**: `components/SimpleWizard.tsx`

Added a real-time preview that shows users what their store will look like:
- **Desktop**: Phone mockup on the right side with header, hero, product grid, navigation
- **Mobile**: Compact preview bar at the top showing store emoji, name, colors

The preview updates dynamically as users:
- Enter store name
- Select store type (emoji)
- Pick color palette
- Choose vibe/style

### 2. Database Schema Updates
**Migration**: `supabase/migrations/20250101000029_wizard_design_settings.sql`

Added columns to `store_config`:
```sql
secondary_color TEXT
background_color TEXT
store_type TEXT
store_vibe TEXT
color_palette TEXT
```

### 3. Design Settings Flow (INCOMPLETE)
Updated the flow to save and load wizard choices:

| Component | Status | Notes |
|-----------|--------|-------|
| SimpleWizard saves to `store_config` | ✅ Done | Saves all colors, vibe, type |
| DataContext loads settings | ✅ Done | Loads new columns |
| types.ts updated | ✅ Done | Added new fields to StoreConfig |
| Storefront applies settings | ⚠️ **NOT WORKING** | Settings exist but not rendering |

---

## THE PROBLEM (Critical)

### Wizard saves settings correctly:
```typescript
// SimpleWizard.tsx - This IS running
await supabase
  .from('store_config')
  .update({
    primary_color: selectedPalette?.primary,
    secondary_color: selectedPalette?.secondary,
    background_color: selectedPalette?.bg,
    store_type: storeType,
    store_vibe: storeVibe,
    color_palette: colorPalette,
  })
  .eq('store_id', storeId);
```

### Storefront should apply them:
```typescript
// Storefront.tsx - This should work but ISN'T visible
const primaryColor = config.primaryColor || '#6366F1';
const secondaryColor = config.secondaryColor || '#8B5CF6';
const backgroundColor = config.backgroundColor || '#FFFFFF';

// Applied via inline styles and CSS variables
style={{ ...designTokenStyles, backgroundColor }}
```

### Likely Issues to Debug:
1. **Timing**: `store_config` may not exist yet when wizard tries to update it
2. **RLS Policies**: May be blocking the update
3. **Data flow**: Check if DataContext is actually receiving the values
4. **Component re-render**: Storefront may not re-fetch after wizard completes

---

## Files Modified This Session

```
components/SimpleWizard.tsx      - Added live preview, save all design settings
components/Storefront.tsx        - Apply design settings (colors, vibe, CSS vars)
components/HeaderLibrary.tsx     - Added primaryColor/secondaryColor props
components/FooterLibrary.tsx     - Added secondaryColor prop
context/DataContext.tsx          - Load new design settings from store_config
types.ts                         - Added design fields to StoreConfig interface
supabase/migrations/
  20250101000001_multi_tenant.sql    - Fixed uuid_generate_v4 → gen_random_uuid
  20250101000004_commerce_and_saas.sql - Fixed uuid_generate_v4
  20250101000013_payment_integrations.sql - Fixed uuid_generate_v4
  20250101000025_discounts.sql       - Fixed uuid_generate_v4
  20250101000029_wizard_design_settings.sql - NEW: design columns
.env                             - Updated to use hosted Supabase
```

---

## Debugging Steps for Next Session

### 1. Check if data is saving
```sql
-- Run in Supabase SQL Editor
SELECT store_id, primary_color, secondary_color, background_color, store_vibe, store_type 
FROM store_config;
```

### 2. Check if create_tenant creates store_config
Look at `supabase/migrations/20250101000023_create_tenant_function.sql`:
- Does `create_tenant()` INSERT into store_config?
- Is it creating the row BEFORE SimpleWizard tries to UPDATE?

### 3. Add console logs
```typescript
// In DataContext.tsx after loading config
console.log('Loaded store config:', configData);

// In Storefront.tsx
console.log('Applying colors:', { primaryColor, secondaryColor, backgroundColor });
```

### 4. Check RLS policies
```sql
-- Check policies on store_config
SELECT * FROM pg_policies WHERE tablename = 'store_config';
```

---

## SimpleWizard Flow

```
1. User lands on /start (SimpleWizard)
2. Welcome → Name → Type → Colors → Vibe
3. On "Create My Store!":
   - Calls create_tenant RPC (creates store + profile)
   - Updates stores.settings with wizard choices
   - Updates store_config with design settings ← MAY FAIL IF ROW DOESN'T EXIST
4. Redirect to /admin
5. Dashboard/Storefront should show chosen colors ← NOT HAPPENING
```

---

## Git Status

All changes committed and pushed to `main`:
- Commit `2bf2d3b`: Connect wizard design settings to storefront
- Commit `037b299`: Fix migrations (uuid)
- Commit `efb98eb`: Add live preview panel

---

## What Works

✅ User signup/login  
✅ SimpleWizard UI and live preview  
✅ Store creation via wizard  
✅ Superuser admin access  
✅ Database migrations applied  
✅ Vercel deployment  

## What Doesn't Work

❌ Wizard design choices not appearing on actual storefront  
❌ Colors/vibe not applied to public store view  

---

## Priority for Next Session

1. **Debug the design settings flow** - Figure out why settings aren't showing
2. **Test public storefront** - Visit `/s/[store-slug]` and check console
3. **Verify store_config data** - Confirm values are actually in the database
4. **Fix any RLS/timing issues** - May need to INSERT then UPDATE, or fix RPC

---

## Useful Commands

```bash
# Deploy to Vercel
npx vercel --prod --scope 333-production2025 --yes

# Push DB migrations
npx supabase db push

# Check Supabase connection
npx supabase status

# Run dev server locally
npm run dev
```

---

## API Keys (for reference)

**Supabase Service Role Key** (use for admin operations):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Z3VmbWpyYXhpYWR0bnhreW1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU5ODczOCwiZXhwIjoyMDgwMTc0NzM4fQ.HF8KSZNMEHxzWwicvg1PAdlOd_QG1ayLMK9DJ5sBTPU
```

---

*End of handoff - Dec 17, 2025*
