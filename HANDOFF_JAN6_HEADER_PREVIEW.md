# Header Preview Issue - January 6, 2026

## CRITICAL PROBLEM
Header previews in the Global Settings modal (Headers tab) are NOT working for most headers. Only the first 4 headers (Canvas, Nebula, Luxe, Pilot) show previews correctly. The remaining 23 headers do not display properly in the preview popup.

## WHAT WAS WORKING
According to the user, **ALL headers except the last 6 newly added ones** (Pathfinder, Cypher, Particle, Lumina, Aqua, Refined) had working previews earlier today. This means headers 5-21 (Bunker through Ghost) were working with previews AND had updated editing tools.

## TIMELINE OF CHANGES

### Commit History (Most Recent First)
1. `def4198` - Fix header preview popup to pass logoHeight, onLinkClick, and data props
2. `f8a6d15` - Fix header selector to use HEADER_OPTIONS.map() for all headers
3. `a91c7e4` - Revert "Add preview button to header selector in Global Settings"
4. `7434ab3` - Add preview button to header selector in Global Settings (REVERTED)
5. `0b94d1f` - Restore all 17 header implementations from archive
6. `78b87e6` - Fix header selector to show all 28 headers instead of hardcoded 4
7. `3e4c3f0` - Add 6 new headers from new-footers folder
8. `9f94f81` - Add 3 new footers: Aurora, Ripple, Glitch

### What Broke When
- **Before `3e4c3f0`**: Headers 1-21 had working previews
- **After `3e4c3f0`**: Added 6 new headers (Pathfinder, Cypher, Particle, Lumina, Aqua, Refined)
- **After `78b87e6`**: Changed header selector from hardcoded 4 to HEADER_OPTIONS.map() showing all 28
- **Current State**: Only first 4 headers preview correctly

## CURRENT CODE STATE

### Header Library (`components/HeaderLibrary.tsx`)
- **Total Headers**: 28 implementations
- **HEADER_COMPONENTS**: Contains all 28 header components
- **HEADER_OPTIONS**: Contains metadata for all 28 headers
- **Headers 1-4**: HeaderCanvas, HeaderNebula, HeaderLuxe, HeaderPilot (WORKING)
- **Headers 5-21**: Restored from archive with full implementations (NOT WORKING IN PREVIEW)
- **Headers 22-28**: Pathfinder, Cypher, Particle, Lumina, Aqua, Refined (NOT WORKING IN PREVIEW)

### Header Selector (`components/AdminPanel.tsx` ~line 4680)
```tsx
{HEADER_OPTIONS.map((header) => (
  <button
    key={header.id}
    onClick={() => onConfigChange({ ...config, headerStyle: header.id as any, headerData: {} })}
    className={...}
  >
    <span>{header.name}</span>
  </button>
))}
```
- Shows all 28 headers
- Clicking a header directly selects it (no preview)
- NO preview button/icon on hover

### Header Preview Popup (`components/AdminPanel.tsx` ~line 5829)
```tsx
const renderHeaderPreview = () => {
  if (!previewingHeaderId) return null;
  const HeaderComponent = HEADER_COMPONENTS[previewingHeaderId];
  if (!HeaderComponent) return null;
  
  return (
    <div className="fixed inset-0 z-[250]">
      <HeaderComponent
        storeName={config.name || 'My Store'}
        logoUrl={config.logoUrl}
        logoHeight={config.logoHeight || 32}
        links={mockLinks}
        cartCount={3}
        onOpenCart={() => {}}
        onLinkClick={() => {}}
        data={config.headerData}
        // ... old props that may not be used
      />
    </div>
  );
};
```

### Live Preview at Top of Settings (`components/AdminPanel.tsx` ~line 4660)
```tsx
<HeaderCanvas
  storeName={config.name || 'Your Store'}
  logoUrl={config.logoUrl}
  logoHeight={config.logoHeight || 32}
  links={[...]}
  cartCount={2}
  onOpenCart={() => {}}
  onLinkClick={() => {}}
  data={config.headerData}
/>
```

## KEY ISSUE: previewingHeaderId IS NEVER SET

**CRITICAL FINDING**: The state variable `previewingHeaderId` exists but is NEVER set to open the preview popup!

```tsx
const [previewingHeaderId, setPreviewingHeaderId] = useState<HeaderStyleId | null>(null);
```

The header selector buttons do NOT call `setPreviewingHeaderId()` - they only call `onConfigChange()` to directly select the header.

## WHAT WE TRIED

### Attempt 1: Add Eye Icon Preview Button
- Added a hover-revealed eye icon to each header card
- Clicking eye would call `setPreviewingHeaderId(header.id)`
- **USER REJECTED** - Said we "changed it" and reverted this commit

### Attempt 2: Revert to Hardcoded 4 Headers
- Changed selector back to only show 4 hardcoded headers
- **USER REJECTED** - Said all headers were working before, not just 4

### Attempt 3: Use HEADER_OPTIONS.map() Again
- Restored the selector to show all headers via `HEADER_OPTIONS.map()`
- Current state

### Attempt 4: Fix Preview Props
- Added `logoHeight`, `onLinkClick`, `data` props to preview popup
- Still not working according to user

## WHAT USER REMEMBERS

1. **All headers 1-21 had working previews** (before adding the 6 new headers)
2. **Headers had "updated editing tools"** - meaning the customization controls worked
3. **Preview system was functional** - there must have been a way to open previews
4. **Only the last 6 added headers** (Pathfinder through Refined) didn't have previews

## CRITICAL QUESTIONS TO INVESTIGATE

### Question 1: How Were Previews Opened Before?
- Was there a preview button that we removed?
- Did clicking the header card open a preview instead of selecting?
- Was there a separate "Preview" section/button?
- Check commits before `3e4c3f0` for the preview triggering mechanism

### Question 2: What Made Headers 5-21 Work?
- These headers were restored from archive in commit `0b94d1f`
- They have full implementations matching the first 4 headers
- What's different about how they render in preview vs the first 4?

### Question 3: Are the First 4 Actually Special?
- Do Canvas, Nebula, Luxe, Pilot have different prop signatures?
- Are they imported differently in AdminPanel?
- Check line 4: `import { HEADER_OPTIONS, HEADER_COMPONENTS, HEADER_FIELDS, HeaderCanvas, HeaderNebula, HeaderLuxe, HeaderPilot }`
- Why are these 4 imported explicitly while others use HEADER_COMPONENTS?

### Question 4: What's the Actual Preview Flow?
Current understanding:
1. User clicks header in selector → `onConfigChange()` called → header selected (no preview)
2. `previewingHeaderId` state exists but is NEVER set
3. `renderHeaderPreview()` exists but is never triggered because state is null
4. Live preview at top of settings shows the SELECTED header (not a popup)

**HYPOTHESIS**: The "preview" the user sees working for the first 4 might be the live preview at the top of the settings panel, NOT the popup preview system.

## FILES TO CHECK

### Primary Files
1. `/workspaces/nexusOSv2/components/AdminPanel.tsx`
   - Line 823: `previewingHeaderId` state declaration
   - Line 4680: Header selector grid
   - Line 4660: Live preview component
   - Line 5829: `renderHeaderPreview()` function
   - Line 9962: Where `renderHeaderPreview()` is called in JSX

2. `/workspaces/nexusOSv2/components/HeaderLibrary.tsx`
   - Line 1612: `HEADER_COMPONENTS` export
   - Line 1642: `HEADER_OPTIONS` export
   - All header implementations

### Git History to Check
```bash
# Check what the preview system looked like before adding 6 headers
git show 9f94f81:components/AdminPanel.tsx | grep -A 50 "previewingHeaderId"

# Check when preview functionality was added
git log -p --all -S "previewingHeaderId" -- components/AdminPanel.tsx

# Check what changed in the header selector area
git log -p --all -- components/AdminPanel.tsx | grep -A 20 "Header Design"
```

## IMMEDIATE NEXT STEPS

1. **Check Git History for Preview Trigger**
   ```bash
   git log -p --all -S "setPreviewingHeaderId" -- components/AdminPanel.tsx
   ```
   Find when and how `setPreviewingHeaderId` was called

2. **Compare Working vs Broken State**
   - Go back to commit BEFORE `3e4c3f0` (when user says it was working)
   - Document EXACTLY how the preview system worked
   - Look for any preview buttons, modals, or trigger mechanisms

3. **Test the Live Preview vs Popup Preview**
   - The live preview at top might be what's "working" for first 4
   - The popup preview might have never worked
   - Clarify with user what they mean by "preview"

4. **Check HeaderProps Interface**
   Compare prop requirements between working headers (1-4) and non-working (5-28)

5. **Search for Preview UI Elements**
   ```bash
   git show 9f94f81:components/AdminPanel.tsx | grep -i "preview"
   ```

## SYMPTOMS SUMMARY

✅ **WORKING**:
- Headers 1-4 (Canvas, Nebula, Luxe, Pilot) show in live preview at top
- All 28 headers appear in selector grid
- Clicking headers selects them (changes live preview)

❌ **NOT WORKING**:
- Headers 5-28 don't work in "preview" (unclear which preview system)
- `previewingHeaderId` state is never set
- Popup preview system appears to be dormant/unused

## USER FRUSTRATION POINTS

1. "Whole library of headers was working with preview"
2. "All but last 6 had working previews AND updated editing tools"
3. "First 4 headers have working preview" (current state)
4. Very angry that we "regressed" on header work

## RECOMMENDATION FOR NEXT SESSION

**DO NOT MAKE CODE CHANGES UNTIL YOU:**
1. Understand what "preview" means to the user (live preview vs popup?)
2. Find the commit where previews actually worked for headers 5-21
3. Identify the exact mechanism that triggered previews
4. Verify if popup preview system was ever actually used

**THEN:**
1. Restore the working preview trigger mechanism
2. Ensure all 28 headers work with that mechanism
3. Test thoroughly before committing
