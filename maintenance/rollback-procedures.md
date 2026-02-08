# Rollback Procedures

**Emergency procedures for reverting problematic deployments.**

Use these procedures when a deployment causes critical issues in production.

---

## Quick Decision Guide

### When to Rollback

**Rollback Immediately If:**
- 🔴 Production site completely broken
- 🔴 Data loss or corruption occurring
- 🔴 Security vulnerability exposed
- 🔴 Multi-tenant data leaking between stores
- 🔴 Payment processing completely broken
- 🔴 All users unable to access site

**Fix Forward If:**
- 🟡 Minor visual bug
- 🟡 Single feature broken but site functional
- 🟡 Issue affects small user subset
- 🟡 Quick fix available (< 10 minutes)

**When in doubt:** Rollback first, fix properly later.

---

## Method 1: Git Revert (Recommended)

**Best for:** Most situations, preserves history

### Step 1: Identify Bad Commit

```bash
# View recent commits
git log --oneline -5

# Example output:
# a1b2c3d fix(email): template changes
# e4f5g6h feat(admin): new dashboard widget
# i7j8k9l fix(db): RLS policy update
```

### Step 2: Revert the Commit

```bash
# Revert the last commit (most common)
git revert HEAD

# Or revert a specific commit
git revert a1b2c3d

# This creates a NEW commit that undoes the changes
```

### Step 3: Push to Trigger Rollback Deployment

```bash
git push origin main

# Vercel will automatically deploy the reverted state
```

### Step 4: Monitor

- Watch Vercel deployment logs
- Verify production is restored
- Check Vercel and Supabase error logs clear up

**Advantages:**
✅ Preserves git history  
✅ Can revert multiple commits  
✅ Automatic Vercel deployment  
✅ Easy to re-apply changes later

---

## Method 2: Vercel Dashboard Rollback

**Best for:** Quick rollback when git is unavailable

### Step 1: Access Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments" tab

### Step 2: Find Last Good Deployment

- Deployments are listed chronologically
- Identify the last working deployment (before the bad one)
- Click on that deployment

### Step 3: Promote to Production

- Click "..." menu on the deployment
- Select "Promote to Production"
- Confirm the promotion

### Step 4: Verify

- Production URL now serves the old deployment
- Check site functionality restored

**Important:** This does NOT change git history. You still need to revert the bad commit in git.

### Step 5: Sync Git

```bash
# After Vercel rollback, revert in git too
git revert HEAD
git push origin main
```

**Advantages:**
✅ Fastest method (30 seconds)  
✅ No git knowledge needed  
✅ Immediate production fix

**Disadvantages:**
❌ Doesn't fix git repository  
❌ Need to manually sync git after

---

## Method 3: Hard Reset (Last Resort)

**⚠️ Use ONLY in extreme emergencies. Rewrites history.**

### When to Use

- Git history is completely broken
- Multiple bad commits tangled together
- Other methods failed

### Procedure

```bash
# WARNING: This deletes commits permanently

# 1. Find the last good commit
git log --oneline -10

# 2. Create backup branch first
git branch backup-before-reset

# 3. Hard reset to good commit
git reset --hard <good-commit-hash>

# 4. Force push (WARNING: destructive)
git push origin main --force

# Vercel will deploy the reset state
```

**Only use if you understand the consequences.**

---

## Supabase Migration Rollback

If a database migration caused the issue:

### Step 1: Identify Bad Migration

```bash
# Check recent migrations
ls -lt supabase/migrations/

# Example:
# 20260207120000_add_new_column.sql  <- Bad migration
# 20260206150000_update_rls_policy.sql
```

### Step 2: Create Reverse Migration

```bash
# Create new migration file
cd supabase/migrations/
touch $(date +%Y%m%d%H%M%S)_rollback_add_new_column.sql
```

### Step 3: Write Reverse SQL

```sql
-- Example: If migration added a column, remove it
ALTER TABLE my_table DROP COLUMN IF EXISTS new_column;

-- Example: If migration changed RLS policy, restore old one
DROP POLICY IF EXISTS new_policy_name ON my_table;
CREATE POLICY old_policy_name ON my_table
  FOR ALL USING (store_id = auth.uid());
```

### Step 4: Apply Rollback Migration

- Push the rollback migration to git
- Vercel deployment will run it automatically
- Or run manually in Supabase SQL Editor

### Alternative: Manual SQL in Supabase

For urgent fixes:

1. Go to Supabase Dashboard → SQL Editor
2. Write and execute reverse SQL directly
3. Later: Create migration file to match production state

**Important:** Keep migrations and database state in sync.

---

## RLS Policy Rollback

If a Row-Level Security policy broke multi-tenant isolation:

### Critical: Immediate Lockdown

```sql
-- If data is leaking, immediately restrict table
-- Run this in Supabase SQL Editor

-- Disable all access temporarily
DROP POLICY IF EXISTS problematic_policy_name ON table_name;

-- Create ultra-restrictive temporary policy
CREATE POLICY emergency_lockdown ON table_name
  FOR ALL USING (false);
  
-- This blocks ALL access until fixed properly
```

### Restore Previous Policy

```sql
-- Remove bad policy
DROP POLICY IF EXISTS new_policy_name ON table_name;

-- Restore old policy (check git history for exact SQL)
CREATE POLICY old_policy_name ON table_name
  FOR SELECT USING (store_id = auth.uid());
```

### Verify Multi-Tenant Isolation

```bash
# Test with multiple users immediately
# Log in as Store A owner → should see only Store A data
# Log in as Store B owner → should see only Store B data
```

---

## Environment Variable Rollback

If bad environment variables were deployed:

### Via Vercel Dashboard

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Find the problematic variable
3. Click "Edit"
4. Restore previous value (check git history or previous deployment)
5. Save
6. Redeploy: Deployments → Latest → Redeploy

### Via Git

If variables are in `vercel.json` or `.env.example`:

```bash
# Revert the commit that changed them
git revert <commit-hash>
git push origin main
```

---

## Post-Rollback Procedures

### 1. Verify Production is Stable

- [ ] Site loads correctly
- [ ] Error logs stopped
- [ ] Multi-tenant isolation verified
- [ ] Critical features working
- [ ] No new errors for 15 minutes

### 2. Document the Incident

Create incident report in `maintenance/bugfixes/`:

```bash
touch maintenance/bugfixes/$(date +%Y-%m-%d)_rollback-incident.md
```

Include:
- What was deployed
- What broke
- When rollback occurred
- Rollback method used
- Current status
- Plan to fix properly

### 3. Update KNOWN_ISSUES.md

```markdown
## 🔴 Critical
- [ ] [Feature X] broken after deployment - ROLLED BACK - see maintenance/bugfixes/2026-02-07_rollback-incident.md
```

### 4. Notify Team

- Update team on incident
- Explain what happened
- Share rollback details
- Plan next steps

### 5. Fix Properly

- Don't rush to redeploy
- Understand root cause thoroughly
- Test extensively in dev
- Follow deployment checklist strictly
- Consider additional testing requirements

---

## Rollback Testing

Periodically test rollback procedures in staging:

1. Deploy intentionally broken code
2. Practice rollback
3. Verify restoration
4. Document timing and issues

**Practice makes perfect in emergencies.**

---

## Prevention: Reduce Rollback Need

- ✅ Follow deployment checklist religiously
- ✅ Test thoroughly in dev before deploying
- ✅ Deploy small, focused changes
- ✅ Use feature flags for risky changes
- ✅ Deploy during working hours (not Friday evening)
- ✅ Monitor logs immediately after deployment
- ✅ Test multi-tenant isolation always
- ✅ Review git diff before pushing

---

## Emergency Contacts & Resources

**Dashboards:**
- Vercel: https://vercel.com/dashboard
- Supabase: https://app.supabase.com
- Resend: https://resend.com/emails

**Documentation:**
- Deployment Checklist: `maintenance/deployment-checklist.md`
- Daily Operations: `.github/workflows/DAILY_OPERATIONS_PROTOCOL.md`
- Known Issues: `KNOWN_ISSUES.md`

---

## Rollback Decision Tree

```
Is production critically broken?
├─ YES → Rollback immediately (Method 1 or 2)
│         Then investigate and fix properly
│
└─ NO → Can you fix forward in < 10 minutes?
         ├─ YES → Quick fix and deploy
         │         Monitor closely
         │
         └─ NO → Rollback immediately
                  Then fix properly in dev
```

---

**Remember: Safety > Speed > Perfection**

**When in doubt, roll back. Better to be temporarily on old code than broken on new code.**

---

**Last Updated:** February 7, 2026
