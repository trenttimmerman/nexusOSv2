# Bug: Vercel Serverless Function Crashes in AI Header Generation

**Date Discovered:** February 10, 2026  
**Severity:** Critical  
**Reported By:** Production monitoring / Developer testing  
**Environment:** Production (Vercel deployment)

## Component/Feature Area
- [x] AI Generation
- [x] Database/Supabase
- [x] Vercel Deployment
- [ ] Admin Panel
- [ ] Storefront (Public)
- [ ] Component Libraries (Header/Hero/Footer/Section)
- [ ] Email Campaigns
- [ ] Import/Migration Tools
- [ ] Payment Processing
- [ ] Other: _______

## Browser/Environment
- [x] Vercel Deployment
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile
- [ ] Local Dev

---

## Description

Four distinct FUNCTION_INVOCATION_FAILED errors were occurring in production when the AI header generation endpoint was deployed to Vercel. All four issues were related to incompatibilities between Vite/browser code patterns and Vercel's Node.js serverless runtime.

---

## Issues Discovered

### Issue 1: `import.meta.env` in Node.js Runtime
**File:** `ai/variantGenerators.ts`

**Error:**
```
FUNCTION_INVOCATION_FAILED
ReferenceError: import is not defined in ES module scope
```

**Root Cause:** 
- Code used `import.meta.env.VITE_*` which is a Vite-specific API
- Vercel serverless functions run in Node.js, not Vite
- `import.meta.env` is undefined in Node.js runtime

**Steps to Reproduce:**
1. Deploy code with `import.meta.env` in api/ directory
2. Call the API endpoint
3. Function crashes immediately on load

**Impact:** All AI header generation requests failed in production

---

### Issue 2: Cross-Directory Imports
**File:** `api/ai/generate-headers.ts`

**Error:**
```
FUNCTION_INVOCATION_FAILED
Cannot find module '../../ai/variantGenerators'
```

**Root Cause:**
- `api/ai/generate-headers.ts` imported from `../../ai/variantGenerators`
- Vercel bundler failed to resolve cross-directory imports outside of api/
- Import worked locally but broke in serverless deployment

**Steps to Reproduce:**
1. Create serverless function in api/ that imports from outside api/
2. Deploy to Vercel
3. Function crashes at module resolution time

**Impact:** AI generation endpoint completely broken

---

### Issue 3: Sibling .ts Import as Handler
**File:** `api/ai/header-agent-prompt.ts`

**Error:**
```
FUNCTION_INVOCATION_FAILED
```

**Root Cause:**
- Created `header-agent-prompt.ts` in `api/ai/` to store training prompt
- Vercel treats **every .ts file in api/** as a serverless function handler
- File had `export const prompt = "..."` but no `export default` handler
- Vercel tried to invoke it as an endpoint and crashed

**Steps to Reproduce:**
1. Create any .ts file in api/ directory that doesn't export a default function
2. Import it from another api/ file
3. Vercel build succeeds but runtime crashes when trying to resolve dependency

**Impact:** Deployment broke all API endpoints that depended on the file

---

### Issue 4: Dual ESM Exports in Cron Job
**File:** `api/cron/send-scheduled-campaigns.ts`

**Error:**
```
SyntaxError: Unexpected token 'export'
```

**Root Cause:**
- File had both `export const config = {...}` and `export default handler`
- With `package.json` having `"type": "module"`, this is invalid ESM syntax
- Vercel runtime rejected the dual export pattern

**Steps to Reproduce:**
1. Create serverless function with both named and default exports
2. Set package.json `"type": "module"`
3. Deploy and invoke function
4. Function crashes with syntax error

**Impact:** Email campaign cron job failed on every scheduled run

---

## Expected Behavior

- AI header generation endpoint should return 3 AI-generated headers
- Cron job should send scheduled email campaigns
- All serverless functions should execute without FUNCTION_INVOCATION_FAILED errors

---

## Actual Behavior

- All AI generation requests returned 500 errors
- Cron job crashed on every execution
- Vercel logs showed FUNCTION_INVOCATION_FAILED with various module/syntax errors

---

## Screenshots/Logs

**Vercel Log Example:**
```
FUNCTION_INVOCATION_FAILED
Error: Cannot find module '../../ai/variantGenerators'
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:995:15)
    at Function.Module._load (node:internal/modules/cjs/loader:841:27)
```

---

## Root Cause

**Fundamental Misunderstanding:** Vercel serverless functions have different constraints than Vite dev environment:

1. **No `import.meta.env`** — Node.js doesn't support this Vite API
2. **No cross-directory imports** — Bundler can't reliably resolve ../.. paths outside api/
3. **Every .ts in api/ is a handler** — Cannot use .ts files as data/config storage
4. **Strict ESM rules** — Dual exports break in module mode

---

## Fix Applied

### Fix 1: Replace `import.meta.env` with `process.env`
**Commit:** `8edff1c`

**Changes in `ai/variantGenerators.ts`:**
- Replaced `import.meta.env.VITE_SUPABASE_URL` with `process.env.VITE_SUPABASE_URL`
- Replaced `crypto.randomUUID()` with Node.js `crypto.randomBytes(16).toString('hex')`
- Made all environment variable access Node.js compatible

**Note:** This file is no longer imported by the API endpoint, but was fixed for future compatibility.

---

### Fix 2: Make `generate-headers.ts` Fully Self-Contained
**Commit:** `bf46b90`

**Changes:**
- Removed all imports from outside `api/` directory
- Inlined all helper functions directly in the file
- Copied necessary utilities into the function file
- Zero external dependencies except node_modules

**Result:** 325-line self-contained serverless function

---

### Fix 3: Inline Training Prompt as Const String
**Commit:** `192f4a0`

**Changes:**
- Deleted `api/ai/header-agent-prompt.ts` entirely
- Inlined the full training prompt as a const string in `generate-headers.ts` (lines 15-82)
- No separate files that Vercel could try to invoke as handlers

**Note:** Original markdown prompt kept in `ai/prompts/header-agent.md` for documentation only.

---

### Fix 4: Remove Dual Exports from Cron Job
**Commit:** `4ac1138`

**Changes in `api/cron/send-scheduled-campaigns.ts`:**
- Removed `export const config = { maxDuration: 300 }`
- Kept only `export default async function handler()`
- Moved `maxDuration` to `vercel.json` functions config:
  ```json
  {
    "functions": {
      "api/cron/send-scheduled-campaigns.ts": {
        "maxDuration": 300
      }
    }
  }
  ```

---

## Architecture Lessons Learned

### Vercel Serverless Best Practices (Hard-Won)

1. **Self-Contained Functions**
   - Each serverless function should import ONLY from node_modules
   - No cross-directory imports (../../)
   - Inline all helpers directly in the function file

2. **Environment Variables**
   - Use `process.env.*`, never `import.meta.env.*`
   - These are different runtimes with different APIs

3. **File Structure**
   - Never put non-handler .ts files in `api/` directory
   - Vercel treats every .ts as a potential endpoint
   - Use inline constants or JSON files for data

4. **ESM Exports**
   - With `"type": "module"`, only `export default` for handlers
   - Named exports cause syntax errors in Vercel runtime
   - Move configs to `vercel.json` instead

5. **Testing**
   - Local dev (Vite) ≠ Production (Node.js serverless)
   - Must test actual Vercel deployments, not just `npm run build`
   - Monitor Vercel function logs immediately after deploy

---

## Testing Done

- [x] `npm run build` passes with no errors
- [x] AI header generation endpoint returns 200 with 3 headers in production
- [x] Headers auto-save to `shared_header_library` table
- [x] Live preview renders in Designer V3 selection step
- [x] Full-screen preview modal displays complete storefront
- [x] Cron job executes without crashes
- [x] Email campaigns send successfully on schedule
- [x] Vercel logs clean of FUNCTION_INVOCATION_FAILED errors
- [x] No TypeScript compilation errors
- [x] All API endpoints functional

---

## Deployment

**Commits (in order):**
1. `158b92a` - Improved AI generation error handling for production
2. `8edff1c` - Made variantGenerators Node.js compatible (process.env)
3. `bf46b90` - Made generate-headers.ts fully self-contained
4. `4ac1138` - Fixed cron job SyntaxError (removed dual exports)
5. `192f4a0` - Inlined prompt directly in generate-headers.ts

**Deployment Date:** February 10, 2026  
**Final Commit:** `de78509` (includes prompt rewrite)  
**Vercel Status:** All functions operational  
**Production Status:** ✅ Fully Resolved

---

## Follow-Up Items

- [ ] Document Vercel serverless constraints in developer onboarding guide
- [ ] Add eslint rule to prevent `import.meta.env` in api/ directory
- [ ] Create template for self-contained serverless functions
- [ ] Add deployment checklist item: "Test in actual Vercel environment"
- [ ] Consider creating shared utilities as npm package instead of local imports

---

## References

- **Handoff Doc:** `HANDOFF_FEB10_AI_HEADER_GENERATION.md`
- **Vercel Docs:** https://vercel.com/docs/functions/serverless-functions
- **Related Files:**
  - [api/ai/generate-headers.ts](../../api/ai/generate-headers.ts)
  - [api/cron/send-scheduled-campaigns.ts](../../api/cron/send-scheduled-campaigns.ts)
  - [vercel.json](../../vercel.json)
  - [ai/prompts/header-agent.md](../../ai/prompts/header-agent.md) (reference only)
