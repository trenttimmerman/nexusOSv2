# Daily Operations Protocol

**Reference this file at the start of every maintenance session.**

---

## SESSION START CHECKLIST

### 1. Review Current State
- [ ] Read `KNOWN_ISSUES.md` - check for open issues
- [ ] Read `CHANGELOG.md` - see recent changes
- [ ] Check `TODO.md` - review active tasks and known bugs
- [ ] Review recent `HANDOFF_*.md` docs - understand recent sessions
- [ ] Check `maintenance/bugfixes/` - review active bug reports
- [ ] Pull latest code: `git pull origin main`
- [ ] Check Vercel dashboard for any deployment errors

### 2. Environment Check
- [ ] Verify dev environment is running correctly (`npm run dev`)
- [ ] Check Vercel dashboard for deployment status
- [ ] Verify Supabase connection (check `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Check Resend API key for email functionality
- [ ] Verify Google AI API key for AI generation features
- [ ] Check Vercel cron job status (email campaigns)
- [ ] Test Stripe/PayPal/Square sandbox keys (if testing payments)
- [ ] Review any error notifications in Vercel and Supabase logs

### 3. Session Context
- [ ] What are you working on today? (Bug fix / Feature / Investigation)
- [ ] Priority level? (Critical / High / Medium / Low)
- [ ] Expected timeline? (Minutes / Hours / Days)

---

## BUG REPORTING WORKFLOW

### When Bug is Discovered

1. **Document Immediately**
   ```bash
   # Create new bugfix document
   touch maintenance/bugfixes/$(date +%Y-%m-%d)_brief-description.md
   ```

2. **Fill Out Bug Template**
   ```markdown
   # Bug: [Brief Description]
   
   **Date Discovered:** YYYY-MM-DD HH:MM
   **Severity:** Critical / High / Medium / Low
   **Reported By:** [Name/Role]
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
   Clear description of what's wrong.
   
   ## Steps to Reproduce
   1. Go to...
   2. Click on...
   3. See error...
   
   ## Expected Behavior
   What should happen.
   
   ## Actual Behavior
   What actually happens.
   
   ## Impact
   Who/what is affected?
   
   ## Screenshots/Logs
   [Paste error messages, screenshots, Vercel logs, Supabase logs]
   
   ## Database Check (if applicable)
   - [ ] Checked Supabase logs
   - [ ] Verified RLS policies
   - [ ] Tested with different store_id (multi-tenant isolation)
   - [ ] Checked auth.uid() references in queries
   
   ## Root Cause
   [Fill in after investigation]
   
   ## Fix Applied
   [Fill in after fix]
   
   ## Commit Hash
   [Fill in after deployment]
   
   ## Testing Done
   [Fill in after verification]
   
   ## Deployment
   Date/time pushed to production.
   ```

3. **Update KNOWN_ISSUES.md**
   ```markdown
   ## Critical (or appropriate section)
   - [ ] Brief description - see maintenance/bugfixes/YYYY-MM-DD_name.md
   ```

---

## FIX IMPLEMENTATION PROTOCOL

### Before Coding

1. **Understand the Problem**
   - [ ] Can you reproduce the bug?
   - [ ] Do you understand the root cause?
   - [ ] Have you checked similar code for the same issue?

2. **Plan the Fix**
   - [ ] What files need to be modified?
   - [ ] Will this break anything else?
   - [ ] Is this a surgical fix or does it require refactoring?

3. **Follow .github/copilot_instructions.md**
   - [ ] RED LINE RULE - only touch what's needed
   - [ ] NO cleanup or refactoring unless requested
   - [ ] Maintain existing code patterns
   - [ ] All text inputs MUST have `style={{ color: '#000000' }}`
   - [ ] Test multi-tenant isolation (verify with different store_id values)

### During Coding

1. **Make Surgical Changes**
   - Identify exact lines that need modification
   - Change ONLY those lines
   - Test incrementally

2. **Test Locally**
   ```bash
   npm run build  # Must pass with no errors
   npm run dev    # Test the specific fix
   ```

3. **Verify Related Features**
   - Test features that use the same code
   - Check for regression issues

---

## DEPLOYMENT PROTOCOL

### Pre-Deployment

**ALWAYS follow `maintenance/deployment-checklist.md`**

Critical items:
- [ ] `npm run build` - no TypeScript errors
- [ ] Test the specific fix in dev
- [ ] Check related features still work
- [ ] Review `git diff` - only intended changes
- [ ] Remove console.log statements
- [ ] Use proper commit message format
- [ ] Followed RED LINE RULE (only changed necessary lines)
- [ ] All text inputs have `style={{ color: '#000000' }}`
- [ ] Test in both Admin Panel and public Storefront (if applicable)
- [ ] Check multi-tenant isolation (test with different store_id)
- [ ] Verify component preview in Design tab (if component library changed)
- [ ] Test email sending (if email code changed)
- [ ] Test AI generation (if AI code changed)
- [ ] Supabase migration is backwards compatible (if migration added)

### Commit Message Format

```
fix(component): brief description of what was fixed

Detailed explanation if needed.
Addresses issue in maintenance/bugfixes/YYYY-MM-DD_name.md

Commit includes:
- What changed
- Why it changed
- Impact of change
```

**WebPilot-Specific Scopes:**
- `admin` - AdminPanel.tsx changes
- `storefront` - Public storefront rendering
- `library` - Component library (Header/Hero/Footer/Section)
- `ai` - AI generation system
- `email` - Email campaigns/templates
- `db` - Supabase schema/migrations/RLS
- `migration` - Import/crawler tools
- `auth` - Authentication/authorization
- `api` - Vercel API endpoints
- `payment` - Payment provider integrations

Examples:
- `fix(library): header variant render issue in mobile view`
- `fix(email): convert MJML to light theme for email client compatibility`
- `fix(ai): generation prompt timeout for large content`
- `fix(db): RLS policy blocking customer data access`
- `hotfix(auth): critical security patch for token validation`
- `feat(admin): add customer analytics widget to dashboard`

### Deploy

```bash
git add [files]
git commit -m "fix(component): description"
git push origin main
```

### Post-Deployment

1. **Monitor Deployment**
   - [ ] Watch Vercel build logs
   - [ ] Wait for "Deployment Complete"
   - [ ] Check for build warnings

2. **Immediate Testing**
   - [ ] Test the fixed feature in production
   - [ ] Test related features
   - [ ] Check Vercel error logs (first 5 minutes critical)
   - [ ] Test admin panel loads for multiple stores
   - [ ] Verify storefront renders correctly
   - [ ] Check Supabase logs for RLS errors
   - [ ] Test component previews in Design tab (if library changed)
   - [ ] Verify data isolation (check another store doesn't see changes)

3. **Verify Email** (if applicable)
   - [ ] Send test email via Resend
   - [ ] Check formatting and content
   - [ ] Verify delivery and tracking

---

## DOCUMENTATION UPDATE PROTOCOL

### After Successful Deployment

1. **Update CHANGELOG.md**
   ```markdown
   ## [YYYY-MM-DD]
   
   ### Fixed
   - Brief description (commit hash)
   ```

2. **Update KNOWN_ISSUES.md**
   - Mark issue as resolved
   - Remove from "In Progress" or "Critical"
   - Add to "Resolved" section if needed

3. **Complete Bugfix Document**
   - [ ] Add final commit hash
   - [ ] Document testing done
   - [ ] Add deployment timestamp
   - [ ] Note any follow-up needed

---

## EMERGENCY ROLLBACK PROTOCOL

**If critical issue discovered after deployment:**

1. **Assess Severity**
   - Is production broken?
   - Is data at risk?
   - How many users affected?

2. **Execute Rollback**
   ```bash
   # Quick rollback (last commit)
   git revert HEAD
   git push origin main
   
   # Or see maintenance/rollback-procedures.md for other methods
   ```

3. **Notify Team**
   - Document what happened
   - Update KNOWN_ISSUES.md
   - Create incident report in bugfix doc

4. **Fix Properly**
   - Investigate in dev environment
   - Test thoroughly
   - Redeploy when confident

---

## SUPABASE DEBUGGING GUIDE

### RLS Policy Issues

**Symptoms:** Data not showing, unauthorized access errors, multi-tenant data leaking

**Debug Steps:**
1. **Check RLS is Enabled**
   - Go to Supabase Dashboard → Table Editor → Select Table → View Policies
   - Verify "Enable RLS" is checked

2. **Review Policy Logic**
   ```sql
   -- Example: Check if policy filters by store_id
   SELECT * FROM pg_policies WHERE tablename = 'your_table';
   ```

3. **Test as Different Users**
   - Use Supabase SQL Editor with different auth contexts
   - Verify `auth.uid()` returns expected user ID

4. **Common Fixes**
   - Add `store_id` filter to policies
   - Verify foreign key relationships
   - Check policy uses correct auth function

### Migration Troubleshooting

**Before Running Migration:**
- [ ] Review SQL syntax carefully
- [ ] Check table/column dependencies exist
- [ ] Test in local Supabase if possible
- [ ] Backup data if modifying production tables

**If Migration Fails:**
1. Check Supabase Dashboard → Database → Migrations for error message
2. Review migration dependencies (does referenced table exist?)
3. Check for syntax errors in SQL
4. Create rollback migration if needed:
   ```sql
   -- Example rollback
   ALTER TABLE my_table DROP COLUMN new_column;
   ```

**Rollback Process:**
```bash
# Create reverse migration
cd supabase/migrations/
# Create new migration file with rollback SQL
touch YYYYMMDDHHMMSS_rollback_previous_change.sql
```

### Multi-Tenant Data Isolation

**Verify Isolation:**
1. Log in as Store A owner
2. Verify can only see Store A data
3. Log in as Store B owner
4. Verify cannot see Store A data

**Common Issues:**
- Missing `store_id` filter in queries
- RLS policy not filtering by store
- Join queries bypassing RLS
- Admin users seeing all stores (intended? check auth role)

### Query Performance Analysis

**Check Slow Queries:**
1. Go to Supabase Dashboard → Database → Logs
2. Filter by "Slow queries"
3. Copy query to SQL Editor
4. Run with EXPLAIN ANALYZE:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM your_table WHERE conditions;
   ```

**Optimization Tips:**
- Add indexes on frequently filtered columns
- Use `select('column1,column2')` instead of `select('*')`
- Paginate large result sets
- Cache frequently accessed data

### Supabase Logs Access

**Log Types:**
- **SQL Logs** - Database queries and errors
- **Auth Logs** - Login attempts, token issues
- **Realtime Logs** - Subscription errors
- **API Logs** - REST/GraphQL endpoint calls

**Access:**
Supabase Dashboard → Logs → Select log type → Filter by time range

---

## SESSION END CHECKLIST

Before ending your session:

- [ ] All changes committed and pushed?
- [ ] CHANGELOG.md updated?
- [ ] KNOWN_ISSUES.md updated?
- [ ] Bugfix documents completed?
- [ ] Production verified working?
- [ ] Any follow-up tasks documented?
- [ ] Vercel logs clear of new errors?

---

## QUICK REFERENCE

**Files to check at session start:**
- `KNOWN_ISSUES.md` - Active bugs and issues
- `CHANGELOG.md` - Recent deployment history
- `TODO.md` - Active tasks and known bugs
- Recent `HANDOFF_*.md` docs - Session summaries
- `maintenance/bugfixes/` - Detailed bug reports

**Files to update after deployment:**
- `CHANGELOG.md` - Record what was deployed
- `KNOWN_ISSUES.md` - Mark issues as resolved
- Bugfix document with commit hash
- Create `HANDOFF_*.md` for major sessions

**Emergency procedures:**
- `maintenance/rollback-procedures.md` - Rollback guide

**Development rules:**
- `.github/copilot_instructions.md` - RED LINE RULE and coding standards

**Deployment checklist:**
- `maintenance/deployment-checklist.md` - Pre-deploy verification

**Key guides:**
- `AI_GENERATION_GUIDE.md` - AI website builder usage
- `EMAIL_BACKEND_SETUP.md` - Email campaign setup
- `CUSTOMER_IMPORT_GUIDE.md` - CSV import workflows

**External dashboards:**
- Vercel: https://vercel.com/dashboard
- Supabase: https://app.supabase.com
- Resend: https://resend.com/emails
- Google AI Studio: https://aistudio.google.com

---

## COMMON SCENARIOS

### Scenario 1: Customer Reports Bug
1. Create bugfix document
2. Update KNOWN_ISSUES.md
3. Investigate and reproduce
4. Document root cause
5. Fix → Test → Deploy
6. Update all documentation
7. Verify with customer

### Scenario 2: Build Failure on Vercel
1. Check Vercel logs immediately
2. Identify error (TypeScript / import / dependency)
3. Fix locally and test `npm run build`
4. Push fix quickly
5. Document in CHANGELOG.md

### Scenario 3: Production Working but Slow
1. Check Vercel performance metrics
2. Check Supabase database usage and query performance
3. Review RLS policies (Row-Level Security overhead)
4. Investigate slow queries using Supabase SQL explain analyze
5. Document findings
6. Plan optimization (not urgent)
7. Add to KNOWN_ISSUES.md as "Low Priority"

### Scenario 4: Third-Party Service Issues
1. Check service status (Resend/Stripe/PayPal/Square/Google AI)
2. Check Vercel logs for API errors
3. Test in dev environment
4. Verify API keys/credentials in environment variables
5. Check recent code changes to affected services
6. Fix → Deploy → Test in production

### Scenario 5: Component Not Rendering in Storefront
1. Check browser console for errors
2. Verify component is exported in component library file
3. Check component variant is registered in library system
4. Test component preview in Design tab
5. Verify Supabase data contains correct component_type
6. Check for TypeScript errors in component code
7. Test with different themes/designs

### Scenario 6: AI Generation Fails
1. Check Google AI API key is valid and has quota
2. Review Vercel function logs for AI endpoint errors
3. Check rate limits and timeout settings
4. Test prompt with simpler content
5. Verify Gemini model availability
6. Check prompt engineering in AI agent code
7. Test with different generation types (page/section/content)

### Scenario 7: Email Campaign Not Sending
1. Check Resend API key and dashboard
2. Review Vercel cron job logs (`/api/cron/send-scheduled-campaigns`)
3. Check `email_logs` table in Supabase for errors
4. Verify campaign is in "scheduled" status
5. Test email template rendering
6. Check recipient list and email addresses
7. Verify cron job schedule in vercel.json

### Scenario 8: Data Showing in Wrong Store (Multi-Tenant Issues)
1. Check RLS policies in Supabase (table security settings)
2. Verify all queries include `store_id` filter
3. Confirm `auth.uid()` is correctly mapped to store owner
4. Test with different authenticated users
5. Review recent database migrations for RLS changes
6. Check component queries use proper filtering
7. Test in both admin panel and storefront contexts

### Scenario 9: Supabase Migration Fails
1. Check Supabase migration logs for specific error
2. Review migration SQL syntax
3. Verify migration dependencies (table/column existence)
4. Test migration in local Supabase instance
5. Check for conflicting migrations
6. Rollback if needed: create reverse migration
7. Fix and re-run migration carefully

---

**END OF PROTOCOL**

Always prioritize: Safety > Speed > Perfection
