# Handoff Document — February 10, 2026

## Session: AI Header Generation Quality & Production Stability

### Summary

This session focused on getting the AI header generation pipeline from "broken in production" to "generating high-quality, visually distinct headers." We resolved 4 production crashes, rebuilt the preview system, and completely rewrote the AI training prompt based on 36 real header examples.

---

## Commits (chronological)

| Commit | Description |
|--------|-------------|
| `88295c3` | Designer V3 merged to main (starting point) |
| `158b92a` | Improved AI generation error handling for production |
| `8edff1c` | Made variantGenerators Node.js compatible (process.env instead of import.meta.env) |
| `bf46b90` | Made generate-headers.ts fully self-contained (removed cross-directory imports) |
| `4ac1138` | Fixed cron job SyntaxError crash (removed dual ESM exports) |
| `02bfe59` | Added live CSS mini-previews for AI-generated headers |
| `e66bf50` | Upgraded to real HeaderCanvas2026 live preview + full-screen modal |
| `e318f01` | Auto-save all 3 generated headers to shared_header_library |
| `e68bc09` | Created comprehensive header-agent.md training prompt |
| `93344bc` | Embedded prompt as TS import + fixed mapConfigToHeaderData to spread ALL style fields |
| `192f4a0` | Inlined prompt directly in generate-headers.ts (Vercel treats every .ts in api/ as a handler) |
| `6df30e9` | Full scrollable storefront preview in modal (hero, products, testimonials, footer) |
| `de78509` | Complete rewrite of AI training prompt based on 36 real header examples |

---

## Production Bugs Fixed

### 1. FUNCTION_INVOCATION_FAILED — `import.meta.env` in Node.js
- **File:** `ai/variantGenerators.ts`
- **Cause:** `import.meta.env.VITE_*` is Vite-only, crashes in Vercel Node.js runtime
- **Fix:** Replaced with `process.env.*` and Node.js crypto

### 2. FUNCTION_INVOCATION_FAILED — Cross-directory import
- **File:** `api/ai/generate-headers.ts`
- **Cause:** `import from '../../ai/variantGenerators'` caused Vercel bundler crash at module load
- **Fix:** Made generate-headers.ts fully self-contained — all logic inlined, zero imports from outside `api/`

### 3. Cron Job SyntaxError — Dual ESM exports
- **File:** `api/cron/send-scheduled-campaigns.ts`
- **Cause:** `export const config` + `export default` with `"type": "module"` = invalid ESM
- **Fix:** Removed `export const config`, moved `maxDuration` to `vercel.json`

### 4. FUNCTION_INVOCATION_FAILED — Sibling .ts import in api/
- **File:** `api/ai/header-agent-prompt.ts` (now deleted)
- **Cause:** Vercel treats every `.ts` file in `api/` as a serverless function handler. A file with `export const` and no default handler export crashes when Vercel tries to resolve it as a dependency.
- **Fix:** Inlined the training prompt as a `const` string directly in `generate-headers.ts`. File deleted.

---

## Key Architecture Decisions

### Vercel Serverless Rules (Learned the Hard Way)
1. **Every `.ts` in `api/` = a handler.** Don't put non-handler files there.
2. **No cross-directory imports.** `api/ai/generate-headers.ts` cannot import from `../../ai/`. Vercel bundler fails silently at runtime.
3. **No `import.meta.env` in API routes.** Use `process.env` only.
4. **No dual named exports.** With `"type": "module"`, only `export default` works reliably.
5. **Self-contained is king.** Each serverless function should have zero local imports outside node_modules.

### Preview System Architecture
- **Card preview:** HeaderCanvas2026 rendered at 55% scale (`transform: scale(0.55)`) in a 140px container
- **Full preview modal:** Fixed overlay with real HeaderCanvas + full mock storefront (hero, categories, products, sale banner, testimonials, newsletter, footer)
- **Data mapping:** `mapConfigToHeaderData()` uses `...style` spread to pass ALL AI-generated fields through. Only overrides `sticky: false` for preview.

---

## Files Modified

### `api/ai/generate-headers.ts` (325 lines)
The core AI generation endpoint. Fully self-contained. Key sections:
- **Lines 15-82:** Inlined training prompt (the "brain" of the AI)
- **Step 1-3:** Env validation, request parsing, Supabase store context lookup
- **Step 4:** Builds prompt with training + brand context + color palette
- **Step 5:** Calls Gemini 2.5-flash
- **Step 6:** Parses JSON array from AI response (handles markdown fences)
- **Step 7:** Transforms to response format with config.style passthrough
- **Step 8:** Auto-saves all 3 headers to `shared_header_library` with `status: 'public'`
- **Step 9:** Analytics logging to `ai_generation_log`

### `components/designer/HeaderSelectionStep.tsx` (~650 lines)
The Designer V3 Step 1 UI. Key components:
- **`mapConfigToHeaderData()`** — Spreads ALL style fields from AI response, merges data text content, only overrides `sticky: false`
- **`HeaderPreviewModal`** — Full-screen preview with real HeaderCanvas + scrollable mock storefront
- **`HeaderPreviewCard`** — Card with 55% scaled live HeaderCanvas, expand button overlay, AI badge
- **Mock storefront sections:** Hero, 3 category cards, 8-product grid with ratings, sale banner, 3 testimonials, newsletter signup, 4-column footer

### `vercel.json`
- Added `functions` config for `generate-headers.ts` with `maxDuration: 60`
- Added `functions` config for `send-scheduled-campaigns.ts` with `maxDuration: 300`

### `ai/prompts/header-agent.md` (280 lines, kept for reference)
The original markdown training prompt. NOT used by the API (Vercel can't read it). Kept as documentation of the full field reference.

### `ai/variantGenerators.ts`
Updated with `process.env` and Node.js crypto. No longer imported by the API endpoint.

---

## AI Training Prompt Design

### The Problem
The original prompt was a dry field reference: "here are 60 fields, generate 3 variants." The AI treated it like a form — same white background, same dot nav, same generic announcement on every generation.

### The Solution (commit `de78509`)
Rewrote based on analysis of all 36 headers in `headers-examples/`. The new prompt teaches **design philosophy**, not just field names:

**7 Header Archetypes:**
1. Clean Minimal (Aesop/Apple — white, thin borders, underline nav)
2. Dark Luxury (deep blacks, warm accent glows, glassmorphism)
3. Bold & Colorful (saturated brand color bg, white text, high contrast)
4. Frosted Glass (semi-transparent, backdrop blur, delicate borders)
5. Editorial/Brutalist (unexpected colors, thick borders, marquee, large icons)
6. Full-Featured Professional (all bars enabled, CTA, mega menu, utility links)
7. Warm Artisan (earth tones, craft feel, spotlight borders, brand-voice announcements)

**Absolute Rules:**
- At least one dark variant per generation
- No duplicate navActiveStyle values
- No generic blue (#3b82f6) — derive from brand palette
- No boilerplate announcements — brand-specific messaging
- Evocative variant names (not "Header 1")
- Each variant enables different feature sets

**Full Worked Example:** "Glow Lab" skincare brand showing Botanical Clean, Dark Apothecary (glassmorphism), and Desert Bloom (spotlight borders + marquee).

---

## Database Impact

### `shared_header_library` table
- All AI-generated headers are auto-saved with `status: 'public'`, `ai_generated: true`
- Each generation creates 3 rows
- `config` column stores the full `{ variant, style, data, layout }` object
- `tags` include 'AI Generated' + layout type
- `design_trends` stored from AI response

### `ai_generation_log` table
- Fire-and-forget analytics logging
- Tracks `store_id`, `generation_type: 'header'`, prompt text, variant count, model, timestamp

---

## Testing Checklist

- [x] `npm run build` passes cleanly
- [x] No TypeScript errors
- [x] generate-headers.ts returns 200 with 3 headers
- [x] Headers auto-save to shared_header_library
- [x] Live preview renders real HeaderCanvas in cards
- [x] Full-screen modal scrolls through mock storefront
- [x] Cron job no longer crashes
- [ ] Verify new prompt generates visually distinct headers (dark + light + creative)
- [ ] Verify announcement bars, utility bars, glassmorphism render correctly
- [ ] Verify different navActiveStyles are visible in previews

---

## Known Issues / Future Work

1. **THREE.js duplicate import warning** — `THREE.WARNING: Multiple instances of Three.js being imported.` Shows in console. Cosmetic only, doesn't affect functionality. Likely from header-examples or a dependency importing Three.js separately.

2. **Bundle size** — 2,915 kB (663 kB gzipped). The single-chunk build triggers Vite's warning. Consider code-splitting with dynamic imports for AdminPanel, Designer wizard, etc.

3. **Header examples folder** — 36 `.tsx` files in `headers-examples/` are reference material, not imported anywhere. Could be moved to a docs/examples folder or gitignored to reduce repo size.

4. **Preview scroll behavior** — The header in the full preview modal uses `sticky: false`. If someone wants to test sticky behavior, the modal would need a different approach (nested scroll container).

5. **Mega menu preview** — `enableMegaMenu` is in the field reference but the preview doesn't show mega menu dropdowns since there's no hover interaction in the scaled cards.

---

## Environment

- **Branch:** `main`
- **Latest commit:** `de78509`
- **Node:** Vercel serverless (Node.js runtime)
- **AI Model:** Gemini 2.5-flash via `@google/genai`
- **Framework:** React 18.3.1 + TypeScript + Vite 6.4.1
- **Database:** Supabase PostgreSQL
- **Deployment:** Vercel (auto-deploy on push to main)
