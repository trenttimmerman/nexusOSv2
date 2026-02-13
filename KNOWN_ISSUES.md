# Known Issues

**Last Updated:** February 13, 2026

This file tracks all active bugs, issues, and technical debt in the WebPilot Commerce OS platform.

---

## 🔴 Critical

Issues that break core functionality or affect all users.

None at this time.

---

## 🟠 High Priority

Significant issues affecting specific features or user workflows.

<!-- Example:
- [ ] AI generation times out for large websites - see maintenance/bugfixes/2026-02-06_ai-timeout.md
- [ ] Email campaigns sent twice due to cron overlap - investigating
-->

None at this time.

---

## 🟡 Medium Priority

Issues that impact user experience but have workarounds.

<!-- Example:
- [ ] Component preview shows stale data in Design tab - requires page refresh
- [ ] Customer import CSV fails with special characters in names
-->

None at this time.

---

## ⚪ Low Priority

Minor issues, cosmetic bugs, or technical debt.

### AI Header Generation (Feb 10, 2026)
- [ ] THREE.js duplicate import warning in console - cosmetic only, doesn't affect functionality
- [ ] Header preview modal uses `sticky: false` - cannot test sticky scroll behavior in full preview
- [ ] Mega menu preview doesn't show hover interactions in scaled preview cards

### Build & Performance
- [ ] Bundle size 2,915 kB (663 kB gzipped) triggers Vite warning - consider code-splitting for AdminPanel and Designer wizard
- [ ] 36 header example `.tsx` files in `headers-examples/` folder - could move to docs/examples or gitignore to reduce repo size

---

## ✅ Resolved

Recently fixed issues (kept for reference, cleaned monthly).

<!-- Example:
- [x] Email templates rendering incorrectly in Outlook - fixed 2026-02-05 (commit abc123)
- [x] RLS policy blocking customer data - fixed 2026-02-04 (commit def456)
-->

None at this time.

---

### February 13, 2026
- [x] **AI Header Generation FUNCTION_INVOCATION_FAILED** - FIXED (commit d84fde9)
  - **Root Cause:** Template literal syntax incompatible with Vercel Node.js ESM runtime
  - **Solution:** Converted template literals to string concatenation (FEW_SHOT_EXAMPLES + HEADER_AGENT_PROMPT)
  - **Impact:** Feature fully restored - AI generation working in production
  - **Testing:** Verified with production API call - HTTP 200, 3 valid headers generated
  - **Details:** See `maintenance/bugfixes/2026-02-13_ai-header-template-literal-crash.md`
  - **Previous attempts:** 6 unsuccessful fixes before root cause identified
  - **Duration:** ~12 hours (discovered Feb 13 AM, fixed Feb 13 PM)cy email templates to new MJML system
- [ ] Add comprehensive TypeScript types to API endpoints
- [ ] Optimize Supabase queries in admin dashboard
- [ ] Add unit tests for AI generation agents
-->

None at this time.

---

## Usage Guidelines

### When to Add an Issue

1. **Immediately** upon discovering a reproducible bug
2. When a customer reports a problem
3. When a deployment introduces a regression
4. When you identify technical debt during development

### How to Add an Issue

1. Add unchecked item `- [ ]` under appropriate severity section
2. Include brief description
3. Link to bugfix document: `see maintenance/bugfixes/YYYY-MM-DD_name.md`
4. If critical, notify team immediately

### Example Entry

```markdown
## 🔴 Critical
- [ ] Checkout fails for orders over $1000 - see maintenance/bugfixes/2026-02-07_checkout-limit-bug.md
```

### When to Mark Resolved

1. After successful deployment of fix
2. After production verification
3. After updating CHANGELOG.md with fix details
4. Change `- [ ]` to `- [x]` and add date and commit hash

### Example Resolution

```markdown
## ✅ Resolved
- [x] Checkout fails for orders over $1000 - fixed 2026-02-07 (commit a1b2c3d)
```

---

## Related Files

- See `TODO.md` for active development tasks
- See `CHANGELOG.md` for deployment history
- See `maintenance/bugfixes/` for detailed bug reports
- See recent `HANDOFF_*.md` docs for session context
