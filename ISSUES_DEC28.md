# Issues Found During Testing - Dec 28, 2025

## 🔴 CRITICAL BUGS

### 1. **Block Architect Creates Blocks with Empty Type** ✅ FIXED
- **Location**: [AdminPanel.tsx](components/AdminPanel.tsx#L912-L921)
- **Issue**: The `addBlock` function was being called with parameters in the wrong order
- **Fix Applied**: Swapped function signature to match call pattern:
```tsx
// OLD: addBlock(html: string, name: string, type: PageBlock['type'], variant?: string)
// NEW: addBlock(blockType: PageBlock['type'], name: string, content: string = '', variant?: string)
```

---

## 🟠 SCHEMA ISSUES

### 2. **Pages `slug` Column is Globally Unique (Not Per-Store)** ✅ MIGRATION CREATED
- **Location**: Database `pages` table
- **Issue**: `pages_slug_key` unique constraint is on just `slug`, not `(store_id, slug)`
- **Impact**: Two stores cannot have pages with the same slug (e.g., both can't have `/about`)
- **Expected**: Slug should be unique per store only
- **Fix**: Migration created: `supabase/migrations/20250101000031_fix_pages_slug_constraint.sql`

### 3. **Pages `id` is Not Auto-Generated**
- **Location**: Database `pages` table  
- **Issue**: The `id` column requires a value (no default)
- **Current Behavior**: Code uses `page.id = 'home'`, `page.id = 'about'` etc. which causes collisions
- **Suggested**: Use UUIDs with `gen_random_uuid()` default

### 4. **Products `id` is Not Auto-Generated**
- **Location**: Database `products` table
- **Issue**: `id` column requires explicit value
- **Current Behavior**: Must manually provide ID on insert

---

## 🟡 MISSING FUNCTIONALITY

### 5. **No Products in Demo Store** (Fixed during testing)
- Created test products manually

### 6. **Profile Table Missing `email` Column**
- **Issue**: Code expects `email` column but table only has `id, store_id, role, created_at`
- **Impact**: Minor - email isn't actually needed if we rely on auth.users

---

## 🔵 CONFIGURATION/IMPORT ISSUES

### 7. **SCROLL_OPTIONS Import Status**
- **Status**: ✅ Fixed (now imported from ScrollLibrary)
- **Location**: [UniversalEditor.tsx](components/UniversalEditor.tsx)

### 8. **PRODUCT_CARD_OPTIONS Import Status**  
- **Status**: ✅ Fixed (now imported from ProductCardLibrary)
- **Location**: [UniversalEditor.tsx](components/UniversalEditor.tsx)

### 9. **Section Field Configs Added**
- **Status**: ✅ Fixed
- Added configs for: `system-scroll`, `system-grid`, `system-logo-list`, `system-promo`

### 10. **Edit Pencil Routing for system-* Blocks**
- **Status**: ✅ Fixed  
- Added `else if (block.type.startsWith('system-'))` branch

---

## 📝 Verification Needed

### Items That Need Live Testing:
- [ ] Login flow with test account
- [ ] Block Architect - add new section (will fail due to type bug)
- [ ] Auto-save (1.5s debounce)
- [ ] Edit pencil on all system-* block types
- [ ] Product grid rendering
- [ ] Public store access (`/s/demo-store`)

### Test Account
- Email: `test-1766951942485@example.com`
- Password: `TestPassword123!`
- Store: `demo-store`

---

## Summary of Immediate Fixes Required

| Priority | Issue | File | Status |
|----------|-------|------|--------|
| 🔴 Critical | addBlock parameter order | AdminPanel.tsx | ✅ FIXED |
| 🟠 High | pages slug unique constraint | Database migration | ✅ MIGRATION CREATED |
| 🟠 Medium | pages.id auto-generation | Database migration | TO FIX |
| 🟠 Medium | products.id auto-generation | Database migration | TO FIX |

---

## Testing Results (Dec 28, 2025)

### Public Access ✅
- Stores table: Public read works
- Store Config: Public read works
- Products: Public read works
- Pages: Public read works

### Test Account Created
- Email: `test-1766951942485@example.com`
- Password: `TestPassword123!`
- Store: `demo-store`
- Products: 3 test products added

### Additional Notes
- Dev server running on port 3001
- All 15 section types have field configs in UniversalEditor
- Edit pencil routing fixed for all system-* blocks
