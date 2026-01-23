# Commit Safety Checklist

## Before Every Commit

### 1. Review Changed Files
```bash
git status
git diff --stat
```

**RED FLAGS:**
- ❌ More deletions than additions (unless intentional cleanup)
- ❌ Changes to files unrelated to your task
- ❌ Deletions of entire features/functions
- ❌ Changes spanning 10+ files for a "small fix"

### 2. Review Each Changed File
```bash
git diff src/path/to/file.tsx
```

**ASK YOURSELF:**
- ✅ Is this change necessary for my current task?
- ✅ Did I understand what I'm deleting?
- ✅ Could this break existing functionality?

### 3. Test the Build
```bash
npm run build
```

**MUST PASS** before committing!

### 4. Check for Accidental Deletions
```bash
# See lines deleted
git diff --unified=0 | grep '^-' | grep -v '^---'
```

### 5. Commit Message Standards
```
<type>: <short description>

- Bullet point of what changed
- Another change
- Any breaking changes or warnings

<type> can be:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Formatting, no code change
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance
```

## After Pushing

### 6. Verify Deployment
- Wait for Vercel build to complete
- Check deployment logs for errors
- Smoke test critical paths

## Emergency Rollback

If something breaks:
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to previous commit (use with caution)
git reset --hard HEAD~1
git push origin main --force
```

## Key Rules

1. **NEVER commit without reviewing every changed line**
2. **NEVER assume auto-generated diffs are correct**
3. **NEVER commit if unsure - ask for review**
4. **ALWAYS test build before pushing**
5. **ALWAYS read your own commit diff on GitHub after pushing**

## What Happened on Jan 14, 2026

**Incident:** Timestamp serialization "fix" deleted 2,030 lines including:
- Entire SwagBucks purchase system
- Purchase history visualization
- Earned vs Purchased breakdown
- Transaction type definitions

**Root Cause:** Likely a bad merge/revert that wasn't properly reviewed

**Prevention:** Use this checklist EVERY time
