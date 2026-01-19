# Settings Page - Company Details Wiring Plan

**Date:** January 19, 2026  
**Status:** Analysis & Planning (No Changes Made)

---

## 🔍 Current State Analysis

### **Settings Page (General Tab) - Current Fields**

Located in: `components/AdminPanel.tsx` lines 15305-15500

#### ✅ Already Wired & Working
1. **Store Details**
   - Store Name → `config.name` ✅
   - Currency → `config.currency` ✅

2. **Contact Information**
   - Support Email → `config.supportEmail` ✅

3. **Store Address**
   - Street Address → `config.storeAddress.street` ✅
   - City → `config.storeAddress.city` ✅
   - State/Province → `config.storeAddress.state` ✅
   - Postal/Zip Code → `config.storeAddress.zip` ✅
   - Country → `config.storeAddress.country` ✅

4. **Formats & Standards**
   - Timezone → `config.storeFormats.timezone` ✅
   - Weight Unit → `config.storeFormats.weightUnit` ✅
   - Dimension Unit → `config.storeFormats.dimensionUnit` ✅

5. **Logo Management**
   - Logo Upload → `config.logoUrl` ✅
   - Logo Height → `config.logoHeight` ✅
   - Mode Toggle (Text/Image) → Local state `logoMode` ✅

#### ⚠️ Issues Found

**1. REDUNDANT LOGO UPLOAD - CONFIRMED** ❌
- **Location 1:** Settings → General → Logo Management (lines 15326-15430)
- **Location 2:** Designer → Site Identity → Logo (lines 11290-11344)
- **Issue:** Same fields (`config.logoUrl`, `config.logoHeight`) managed in two places
- **Recommendation:** Remove from Settings, keep only in Designer

**2. Missing Fields in StoreConfig**
The UI has fields but they're not in the TypeScript interface:

| Field in UI | Expected in Config | Currently Exists? |
|-------------|-------------------|-------------------|
| Street Address | `storeAddress.street` | ❌ Uses `street1` |
| Phone (missing) | `storeAddress.phone` | ✅ Exists but not in UI |
| Street 2 (missing) | `storeAddress.street2` | ✅ Exists but not in UI |

**3. Incomplete Data Persistence**
- ✅ All fields call `onConfigChange()` 
- ✅ Changes update local state immediately
- ⚠️ But no explicit "Save" button on Settings page
- ⚠️ Relying on auto-save (need to verify this works)

**4. Missing Company Details Fields**
These are common e-commerce fields NOT in Settings:

| Missing Field | Purpose | Where to Add |
|--------------|---------|--------------|
| Company Name | Legal business name | General Settings |
| Tax ID / VAT | Tax registration | General Settings |
| Phone Number | Main contact | Contact Information |
| Business Hours | Operating hours | Contact Information |
| Social Media Links | Instagram, Facebook, etc. | Contact Information |
| Return Address | Separate from store address | Shipping Settings |

---

## 📊 StoreConfig Interface Analysis

From `types.ts` lines 184-333:

### ✅ Already Defined in Interface
```typescript
interface StoreConfig {
  // Basic Info
  name: string;                    ✅ Wired
  tagline?: string;                ❌ Not in UI
  currency: string;                ✅ Wired
  supportEmail?: string;           ✅ Wired
  
  // Logo
  logoUrl?: string;                ✅ Wired (REDUNDANT)
  logoHeight?: number;             ✅ Wired (REDUNDANT)
  
  // Address
  storeAddress?: {
    street1?: string;              ⚠️ UI uses 'street' not 'street1'
    street2?: string;              ❌ Not in UI
    city?: string;                 ✅ Wired
    state?: string;                ✅ Wired
    zip?: string;                  ✅ Wired
    country?: string;              ✅ Wired
    phone?: string;                ❌ Not in UI
  };
  
  // Formats
  storeFormats?: {
    timezone: string;              ✅ Wired
    weightUnit: 'kg' | 'lb' ...;  ✅ Wired
    dimensionUnit: 'cm' | 'in' ...; ✅ Wired
    orderIdPrefix?: string;        ❌ Not in UI
    orderIdSuffix?: string;        ❌ Not in UI
  };
}
```

### ❌ Missing in Interface (Need to Add)
```typescript
// Proposed additions to StoreConfig:
interface StoreConfig {
  // Company Details (MISSING)
  companyName?: string;            // Legal business name
  taxId?: string;                  // Tax ID / VAT number
  businessType?: 'individual' | 'llc' | 'corporation' | 'partnership';
  
  // Contact Details (MISSING)
  phone?: string;                  // Main phone number
  alternatePhone?: string;         // Secondary phone
  fax?: string;                    // Fax (if needed)
  
  // Business Hours (MISSING)
  businessHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    // ... etc
    timezone?: string;
  };
  
  // Social Media (MISSING)
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    pinterest?: string;
  };
  
  // Shipping/Return Address (MISSING)
  returnAddress?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}
```

---

## 🎯 Proposed Changes

### **Phase 1: Fix Existing Issues (High Priority)**

#### 1.1 Remove Redundant Logo Upload from Settings ✅
**Action:** Delete Logo Management section from Settings → General  
**Reason:** Already perfectly managed in Designer → Site Identity  
**Impact:** Reduces confusion, single source of truth  
**Lines:** Remove 15326-15430 in AdminPanel.tsx

#### 1.2 Fix Address Field Naming Mismatch ✅
**Action:** Change UI from `config.storeAddress.street` to `config.storeAddress.street1`  
**Reason:** Match TypeScript interface  
**Impact:** Consistency with database schema  
**Alternative:** Update interface to use `street` instead of `street1`

#### 1.3 Add Missing Address Fields ✅
**Action:** Add Street 2 and Phone to Store Address section  
**Reason:** Standard fields for complete address  
**Impact:** More complete contact information

#### 1.4 Add Explicit Save Button ✅
**Action:** Add "Save Changes" button at bottom of Settings page  
**Reason:** Clear user feedback when changes are persisted  
**Impact:** Better UX, clear save state

---

### **Phase 2: Add Missing Company Details (Medium Priority)**

#### 2.1 Expand General Settings Section ✅
Add new "Company Information" card:
```tsx
<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
  <h4>Company Information</h4>
  - Company Legal Name (optional)
  - Tax ID / VAT Number (optional)
  - Business Type (select: individual, LLC, corporation, partnership)
</div>
```

#### 2.2 Expand Contact Information Section ✅
Add to existing "Contact Information" card:
```tsx
- Primary Phone Number *
- Alternate Phone Number
- Fax (optional)
```

#### 2.3 Add Social Media Links Section ✅
New card in General Settings:
```tsx
<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
  <h4>Social Media</h4>
  - Facebook URL
  - Instagram Handle
  - Twitter/X Handle
  - LinkedIn Company Page
  - YouTube Channel
  - TikTok Handle
  - Pinterest Profile
</div>
```

---

### **Phase 3: Add Advanced Settings (Low Priority)**

#### 3.1 Business Hours ✅
New section for operating hours by day of week

#### 3.2 Return Address ✅
Separate address for returns/exchanges (can be different from store address)

#### 3.3 Order ID Customization ✅
Use existing `orderIdPrefix` and `orderIdSuffix` fields

---

## 🔧 Implementation Checklist

### **Immediate Fixes (Do First)**
- [ ] Remove Logo Management from Settings → General (lines 15326-15430)
- [ ] Add Street Line 2 field to Store Address
- [ ] Add Phone field to Store Address
- [ ] Fix field name: `street` → `street1` (or update interface)
- [ ] Add "Save Changes" button with loading state
- [ ] Add "Changes saved" toast notification

### **Type Updates Required**
- [ ] Update `StoreConfig` interface to add:
  - `companyName?: string`
  - `taxId?: string`
  - `businessType?: string`
  - `phone?: string`
  - `alternatePhone?: string`
  - `socialMedia?: {...}`
  - `returnAddress?: {...}`
  - `businessHours?: {...}`

### **UI Components to Add**
- [ ] Company Information card
- [ ] Expanded Contact Information fields
- [ ] Social Media Links card
- [ ] Business Hours editor (day/time picker)
- [ ] Return Address card

### **Database Migration**
- [ ] Create migration to add new fields to `store_config` table
- [ ] Ensure JSONB fields can store new structures
- [ ] Update RLS policies if needed

---

## 📋 Database Schema Verification

Need to check `store_config` table schema to confirm:
1. Are all fields stored in JSONB or separate columns?
2. Do we need migration for new fields?
3. Are RLS policies correct for new fields?

**SQL to run:**
```sql
-- Check current store_config schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'store_config';

-- Check if fields are JSONB columns
SELECT * FROM store_config LIMIT 1;
```

---

## 🎨 UI/UX Improvements

### **Settings Page Organization**
Current tabs: General | Payments | Shipping | Taxes | Policies | Notifications | Domains

**Proposed reorganization:**
```
General Settings:
  ├─ Store Details (name, tagline, currency)
  ├─ Company Information (legal name, tax ID, business type) [NEW]
  ├─ Contact Information (email, phone, fax, social media) [EXPANDED]
  ├─ Store Address (complete address with street1, street2, phone)
  ├─ Return Address (separate shipping address) [NEW]
  ├─ Formats & Standards (timezone, units, order ID format) [EXPANDED]
  └─ Business Hours (operating hours) [NEW]

Brand & Design:
  ├─ Logo (MOVED FROM SETTINGS - now only in Designer)
  ├─ Colors
  ├─ Typography
  └─ Styles
```

### **Visual Improvements**
- [ ] Add icons to each section header
- [ ] Add helper text/tooltips for complex fields
- [ ] Show field validation errors inline
- [ ] Add "unsaved changes" warning when navigating away
- [ ] Show last saved timestamp

---

## 🚀 Recommended Implementation Order

### **Sprint 1: Critical Fixes** (1-2 hours)
1. Remove redundant logo upload from Settings
2. Fix address field naming
3. Add missing address fields (street2, phone)
4. Add explicit Save button
5. Test all existing fields still work

### **Sprint 2: Essential Additions** (2-3 hours)
1. Update StoreConfig interface
2. Add Company Information section
3. Expand Contact Information
4. Add Social Media links
5. Create database migration
6. Test data persistence

### **Sprint 3: Polish** (1-2 hours)
1. Add Business Hours section
2. Add Return Address section
3. Add order ID customization
4. Improve visual design
5. Add validation and error handling

---

## ✅ Verification Plan

After implementation, verify:
1. [ ] All Settings fields save to database correctly
2. [ ] No duplicate logo management
3. [ ] Address fields match database schema
4. [ ] New fields persist across sessions
5. [ ] Designer logo upload still works
6. [ ] Settings → General loads existing data
7. [ ] Social media links validate as URLs
8. [ ] Phone numbers format correctly
9. [ ] Save button shows loading state
10. [ ] Toast notification on successful save

---

## 🎯 Success Criteria

**Must Have:**
- ✅ Zero redundant fields between Settings and Designer
- ✅ All company details persist to database
- ✅ Clear save/cancel actions
- ✅ Validation for required fields
- ✅ Complete address capture (street1, street2, city, state, zip, country, phone)

**Nice to Have:**
- ✅ Social media links
- ✅ Business hours
- ✅ Return address
- ✅ Field validation with helpful error messages
- ✅ Auto-save draft changes
- ✅ "Unsaved changes" warning

---

## 📊 Impact Analysis

### **Affected Components**
- `components/AdminPanel.tsx` - Settings UI (15305-15500)
- `components/AdminPanel.tsx` - Designer UI (11280-11350)
- `types.ts` - StoreConfig interface (184-333)
- Database: `store_config` table

### **Breaking Changes**
- ⚠️ Removing logo from Settings (users might look for it there)
  - **Mitigation:** Add message "Logo is now in Designer → Site Identity"
- ⚠️ Changing `street` to `street1`
  - **Mitigation:** Database migration to copy data

### **User Benefits**
- ✅ Single source of truth for logo
- ✅ Complete company information
- ✅ Better contact management
- ✅ Social media integration ready
- ✅ Clear save/cancel workflow
- ✅ Professional business setup

---

## 🎉 Next Steps

**Ready to implement when user approves:**
1. Start with Sprint 1 (critical fixes)
2. Get user feedback on Company Information fields
3. Proceed with Sprint 2 if approved
4. Test thoroughly before deployment

**Questions for User:**
1. Which company details are most important for your use case?
2. Do you need business hours functionality?
3. Should social media links be on Settings or in Designer?
4. Any other company/contact fields we're missing?
