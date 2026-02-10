# Deployment Checklist

Use this checklist before **every deployment** to production to ensure quality and prevent regressions.

---

## Pre-Deployment Verification

### 1. Code Quality

- [ ] **Build passes:** `npm run build` completes with zero errors
- [ ] **No TypeScript errors:** Check build output carefully
- [ ] **No console.log statements:** Remove debugging code
- [ ] **No commented-out code blocks:** Clean unless intentionally documented
- [ ] **Proper error handling:** Try-catch blocks where needed

### 2. Code Review

- [ ] **Review git diff:** `git diff` shows only intended changes
- [ ] **RED LINE RULE followed:** Only modified necessary lines
- [ ] **No unintended refactoring:** No "cleanup" or "housekeeping" changes
- [ ] **Maintained existing patterns:** Didn't modernize old code unnecessarily
- [ ] **Text input colors:** All inputs have `style={{ color: '#000000' }}`

### 3. Testing - Core Functionality

- [ ] **Dev environment works:** `npm run dev` runs without errors
- [ ] **Tested specific fix:** The bug/feature you worked on is verified
- [ ] **Tested related features:** Features using same code still work
- [ ] **No regression issues:** Existing functionality not broken

### 4. Testing - WebPilot Specific

#### Admin Panel
- [ ] **Admin panel loads:** Dashboard accessible
- [ ] **Multi-tenant verified:** Test with at least 2 different stores
- [ ] **Navigation works:** All tabs and sections accessible
- [ ] **Data operations:** CRUD operations work (create, read, update, delete)

#### Storefront
- [ ] **Public storefront renders:** Homepage loads correctly
- [ ] **Components display:** All sections/components visible
- [ ] **Responsive design:** Test mobile view
- [ ] **No console errors:** Browser console clean

#### Component Library (if changed)
- [ ] **Component preview works:** Design tab shows components
- [ ] **Variant selection:** Can switch between variants
- [ ] **Component exports:** All components properly exported
- [ ] **Rendering in storefront:** Components display correctly

#### AI Generation (if changed)
- [ ] **Generation completes:** Test with sample prompt
- [ ] **No timeouts:** Generation finishes in reasonable time
- [ ] **Content quality:** Generated content makes sense
- [ ] **API quota:** Check Google AI Studio for API limits

#### Email Campaigns (if changed)
- [ ] **Template renders:** Email preview displays correctly
- [ ] **Test email sends:** Use Resend to send test email
- [ ] **Links work:** All buttons/links in email functional
- [ ] **Tracking works:** Open/click tracking functional
- [ ] **Cron jobs:** Verify scheduled campaigns in Vercel

#### Database (if changed)
- [ ] **Migration runs:** Supabase migration succeeds
- [ ] **RLS policies active:** Row-Level Security enforced
- [ ] **Backwards compatible:** Migration doesn't break existing data
- [ ] **Multi-tenant isolation:** Data properly filtered by store_id
- [ ] **Query performance:** No significant slowdowns

#### Payments (if changed)
- [ ] **Stripe sandbox:** Test payment in sandbox mode
- [ ] **PayPal sandbox:** Test PayPal checkout
- [ ] **Order creation:** Orders saved correctly
- [ ] **Webhooks:** Payment webhooks processed

### 5. Environment Variables

- [ ] **Required vars present:** All `VITE_*` variables defined
- [ ] **Supabase connection:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] **API keys valid:** Resend, Google AI, payment providers
- [ ] **Vercel environment:** Production vars match local .env

### 6. Commit Message

- [ ] **Follows format:** `fix(scope): description` or `feat(scope): description`
- [ ] **Appropriate scope:** Use WebPilot-specific scopes (admin, storefront, library, ai, email, db, etc.)
- [ ] **Clear description:** Explains what changed and why
- [ ] **References issue:** Links to bugfix doc or HANDOFF if applicable

### 7. Documentation

- [ ] **Bugfix doc complete:** If fixing bug, document is filled out
- [ ] **KNOWN_ISSUES.md updated:** Marked issue as in-progress or resolved
- [ ] **HANDOFF doc created:** If major session, document session notes

---

## Deployment Process

### 1. Final Pre-Deploy Check

```bash
# Ensure on correct branch
git status

# Pull latest changes
git pull origin main

# Build one more time
npm run build

# Review changes
git diff origin/main
```

### 2. Commit and Push

```bash
# Stage changes
git add [specific files]

# Commit with proper message
git commit -m "fix(scope): description"

# Push to trigger Vercel deployment
git push origin main
```

### 3. Monitor Deployment

- [ ] **Vercel build starts:** Check Vercel dashboard
- [ ] **Build logs clean:** No errors or concerning warnings
- [ ] **Deployment completes:** Wait for "Deployment Ready" status
- [ ] **Domain updates:** Verify production URL reflects changes

---

## Post-Deployment Verification

### 1. Immediate Testing (First 5 Minutes Critical)

- [ ] **Verify fix in production:** Test the specific change
- [ ] **Check error logs:** Vercel logs for new errors
- [ ] **Supabase logs:** Check for RLS or query errors
- [ ] **Console errors:** Browser console on production site

### 2. Multi-Tenant Testing

- [ ] **Test Store A:** Log in as Store A owner, verify functionality
- [ ] **Test Store B:** Log in as Store B owner, verify functionality
- [ ] **Data isolation:** Confirm Store B cannot see Store A data
- [ ] **Admin vs Storefront:** Test both contexts

### 3. Component Testing (if applicable)

- [ ] **Admin panel:** All sections load correctly
- [ ] **Component previews:** Design tab shows components
- [ ] **Public storefront:** Components render on live site
- [ ] **Mobile view:** Test responsive behavior

### 4. Integration Testing (if applicable)

- [ ] **Email sending:** Send test email, verify delivery
- [ ] **AI generation:** Test generate feature
- [ ] **Payment processing:** Test checkout flow
- [ ] **Webhooks:** Verify external webhooks still work

---

## Documentation Updates

After successful deployment:

- [ ] **Update CHANGELOG.md:** Add entry with commit hash
- [ ] **Update KNOWN_ISSUES.md:** Mark bug as resolved
- [ ] **Complete bugfix doc:** Add deployment timestamp and commit hash
- [ ] **Create HANDOFF doc:** If major session, document what was built

---

## Rollback Criteria

**Roll back immediately if:**

- Production site is completely broken
- Data is at risk (security vulnerability, data loss)
- Critical feature used by many users is broken
- Payments are failing
- Multi-tenant isolation is broken (data leaking)

**See `maintenance/rollback-procedures.md` for rollback steps.**

---

## Common Mistakes to Avoid

❌ **Don't:**
- Deploy without testing in dev
- Skip `npm run build` check
- Push multiple unrelated changes at once
- Deploy late Friday (risk of weekend issues)
- Modify core flows without thorough testing
- Skip multi-tenant testing
- Forget to remove console.log statements

✅ **Do:**
- Test thoroughly in dev environment
- Deploy small, focused changes
- Monitor Vercel logs after deployment
- Test in production immediately
- Document everything
- Follow RED LINE RULE strictly
- Verify multi-tenant isolation

---

## Quick Pre-Deploy Command

Run this before every deployment:

```bash
# Full pre-deploy check
npm run build && \
git status && \
git diff origin/main && \
echo "✓ Build passed, review changes above"
```

If build fails or changes look wrong, **DO NOT DEPLOY**.

---

## Emergency Contacts

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Resend Dashboard:** https://resend.com/emails

---

**Last Updated:** February 7, 2026

**Always prioritize: Safety > Speed > Perfection**
