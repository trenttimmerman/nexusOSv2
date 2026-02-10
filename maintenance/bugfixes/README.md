# Bugfix Documentation

This directory contains detailed bug reports and fixes for the WebPilot Commerce OS platform.

---

## Purpose

- **Track bugs** from discovery through resolution
- **Document root causes** for future reference
- **Record fix details** including code changes and testing
- **Create searchable history** of issues and solutions

---

## File Naming Convention

Use this format for all bugfix documents:

```
YYYY-MM-DD_brief-description.md
```

Examples:
- `2026-02-07_email-template-rendering.md`
- `2026-02-08_component-preview-stale.md`
- `2026-02-10_rls-policy-blocking-access.md`

---

## Bug Documentation Template

When creating a new bugfix document, use this template:

```markdown
# Bug: [Brief Description]

**Date Discovered:** YYYY-MM-DD HH:MM
**Severity:** Critical / High / Medium / Low
**Reported By:** [Name/Role or "Customer via email"]
**Environment:** Production / Staging / Dev

## Component/Feature Area
- [ ] Admin Panel
- [ ] Storefront (Public)
- [ ] Component Libraries (Header/Hero/Footer/Section)
- [ ] AI Generation
- [ ] Email Campaigns
- [ ] Database/Supabase
- [ ] Import/Migration Tools
- [ ] Payment Processing
- [ ] Other: _______

## Browser/Environment
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile
- [ ] Vercel Deployment
- [ ] Local Dev

## Description

Clear, detailed description of what's wrong.

## Steps to Reproduce

1. Go to...
2. Click on...
3. Enter...
4. Observe...

## Expected Behavior

What should happen when following the steps above.

## Actual Behavior

What actually happens. Include error messages, console output, or screenshots.

## Impact

- **Users Affected:** All users / Specific store / Admin only / etc.
- **Severity Justification:** Why this severity level?
- **Workaround Available:** Yes/No - describe if yes

## Screenshots/Logs

\`\`\`
[Paste error messages here]
\`\`\`

![Screenshot if applicable](url-or-path)

**Vercel Logs:**
\`\`\`
[Paste relevant Vercel function logs]
\`\`\`

**Supabase Logs:**
\`\`\`
[Paste relevant database errors or RLS issues]
\`\`\`

**Browser Console:**
\`\`\`
[Paste JavaScript errors]
\`\`\`

## Database Check (if applicable)

- [ ] Checked Supabase logs
- [ ] Verified RLS policies
- [ ] Tested with different store_id (multi-tenant isolation)
- [ ] Checked auth.uid() references in queries

**Findings:**
[What you discovered about database state]

## Root Cause

**Date Identified:** YYYY-MM-DD HH:MM

[Detailed explanation of what caused the bug. Be specific about code, logic, or data issues.]

**Related Code:**
\`\`\`typescript
// Problematic code snippet
\`\`\`

## Fix Applied

**Date Fixed:** YYYY-MM-DD HH:MM

**Solution:**
[Detailed explanation of how the bug was fixed]

**Code Changes:**
\`\`\`typescript
// New code snippet showing the fix
\`\`\`

**Files Modified:**
- `path/to/file1.ts` - [what changed]
- `path/to/file2.tsx` - [what changed]

## Testing Done

- [ ] Reproduced bug in dev
- [ ] Verified fix resolves issue in dev
- [ ] Tested related features
- [ ] Checked for regression
- [ ] Tested multi-tenant isolation (if applicable)
- [ ] Tested in production after deployment

**Test Results:**
[Describe testing outcomes]

## Deployment

**Commit Hash:** `abc123d`
**Deployment Date:** YYYY-MM-DD HH:MM
**Vercel Deployment URL:** [link to deployment]

**Post-Deployment Verification:**
- [ ] Verified fix in production
- [ ] Monitored logs for 15 minutes
- [ ] No new errors introduced
- [ ] Customer notified (if applicable)

## Follow-Up Tasks

- [ ] None needed / Issue fully resolved
- [ ] Additional task: [description]
- [ ] Technical debt: [description]

## Related Issues

- See also: `bugfixes/2026-XX-XX_related-issue.md`
- Related to: `HANDOFF_XXX.md`
- Mentioned in: `KNOWN_ISSUES.md`

## Lessons Learned

[What did we learn from this bug? How can we prevent similar issues in the future?]

---

**Status:** Draft / In Progress / Resolved / Deployed
```

---

## Quick Create Command

```bash
# Create new bugfix document with template
touch maintenance/bugfixes/$(date +%Y-%m-%d)_brief-description.md
```

Then copy the template above into the new file.

---

## Workflow

### 1. Bug Discovered
```bash
# Create bugfix document immediately
touch maintenance/bugfixes/$(date +%Y-%m-%d)_brief-description.md
```

### 2. Document the Bug
- Fill out template sections: Description, Steps to Reproduce, Impact
- Add to `KNOWN_ISSUES.md` with appropriate severity
- Set status to "Draft" or "In Progress"

### 3. Investigate
- Research root cause
- Update "Root Cause" section when identified
- Update status to "In Progress"

### 4. Fix and Test
- Implement fix
- Document in "Fix Applied" section
- Complete "Testing Done" checklist
- Update status to "Resolved"

### 5. Deploy
- Follow `maintenance/deployment-checklist.md`
- Add commit hash and deployment date
- Update status to "Deployed"

### 6. Verify and Close
- Verify fix in production
- Complete post-deployment verification
- Mark as resolved in `KNOWN_ISSUES.md`
- Update `CHANGELOG.md`

---

## Example Bugfix Documents

### Example 1: Email Template Bug

**Filename:** `2026-02-07_email-template-dark-text.md`

Brief issue: Email templates had black text on dark backgrounds in some clients.

### Example 2: RLS Policy Issue

**Filename:** `2026-02-08_customer-data-blocked.md`

Brief issue: New RLS policy prevented admin from viewing customer data.

### Example 3: Component Rendering

**Filename:** `2026-02-09_header-variant-missing.md`

Brief issue: Header variant not showing in component library preview.

---

## Severity Levels

**Critical:** Production broken for all users, data at risk, security issue
- Document immediately
- Add to KNOWN_ISSUES.md as 🔴 Critical
- Fix as top priority

**High:** Major feature broken, affects many users
- Document within 1 hour
- Add to KNOWN_ISSUES.md as 🟠 High Priority
- Plan fix in current session

**Medium:** Feature partially broken, workaround available
- Document same day
- Add to KNOWN_ISSUES.md as 🟡 Medium Priority
- Plan fix in next few days

**Low:** Cosmetic issue, minimal impact
- Document when convenient
- Add to KNOWN_ISSUES.md as ⚪ Low Priority
- Fix when time permits

---

## Archive Policy

- Keep all bugfix documents (they're small and valuable for history)
- Reference in git commits: `fix(email): template rendering - see bugfixes/2026-02-07_email-template-dark-text.md`
- Search bugfixes folder when similar issues occur

---

## Related Documentation

- **Bug Discovery:** See `.github/workflows/DAILY_OPERATIONS_PROTOCOL.md`
- **Current Issues:** See `KNOWN_ISSUES.md`
- **Deployments:** See `CHANGELOG.md`
- **Session Notes:** See `HANDOFF_*.md` files

---

**This directory is the single source of truth for bug investigation and resolution.**
