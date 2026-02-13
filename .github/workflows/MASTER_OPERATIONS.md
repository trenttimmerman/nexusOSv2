# 🎯 MASTER OPERATIONS - 3Thirty3 Printing
## Production Operations Hub | Updated: February 12, 2026

> **⚠️ CRITICAL:** Follow [Daily Operations Protocol](.github/DAILY_OPERATIONS_PROTOCOL.md) for all maintenance.  
> **⚠️ IMMUTABILITY:** RED LINE RULE - [copilot_instructions](.github/copilot_instructions.md) applies to all code changes.

---

## 📋 SESSION START CHECKLIST

**Use this checklist at the start of every session:**

1. **Current State Check**
   - [ ] Read [Recent Changes](#-recent-changes) below
   - [ ] Review [KNOWN_ISSUES.md](KNOWN_ISSUES.md)
   - [ ] Check [CHANGELOG.md](CHANGELOG.md)
   - [ ] Review `maintenance/bugfixes/` for active bugs
   - [ ] Pull latest: `git pull origin main`
   - [ ] Check [Vercel Dashboard](https://vercel.com/3thirty3gitter/3thirty3-2026-main)

2. **Development Priority Today**
   - [ ] Bug Fix / Feature / Investigation / Maintenance
   - [ ] Priority: Critical / High / Medium / Low
   - [ ] Timeline: Minutes / Hours / Days

3. **Build Verification**
   ```bash
   npm run build    # Must pass before any deployment
   npm run dev      # Verify local environment
   ```

---

## 📰 Recent Changes (Last 10)

| Date | Commit | Description | Status |
|------|--------|-------------|--------|
| Feb 13, 2026 | `6b738b0` | AI Headers: Nexus Foundry archetypes (Alchemist/Purist/Brutalist) + chaos injection | ✅ |
| Feb 12, 2026 | `7889345` | Sinalite Import Build Hotfix: Fix TypeScript implicit any causing Vercel build failure | ✅ |
| Feb 12, 2026 | `bf8314a` | Sinalite Import Structure: Category-aware mapping + admin structure preview/grouping | ✅ |
| Feb 05, 2026 | `b176c27` | AI Image Fix: Use gemini-2.5-flash-image (actual image generation model) | ✅ |
| Feb 05, 2026 | — | AI Content: Increase description tokens from 500 to 2000 (fixes cut-off text) | ✅ |
| Feb 05, 2026 | `30af28a` | AI Endpoints: Update to gemini-flash-latest and fix response structure | ✅ |
| Feb 05, 2026 | — | DTF Export Documentation: Complete technical guide for print system | ✅ |
| Feb 05, 2026 | `c4a58c0` | Quote Builder System: Create formal quotes with line items, pricing, PDF/email | ✅ |
| Feb 05, 2026 | `c230c63` | Quote Form: Change team type to conditional organization question (Yes/No) | ✅ |
| Feb 05, 2026 | `a9a2728` | Quote Display Fix: Serialize Firestore timestamps for server actions | ✅ |
| Feb 05, 2026 | `be941d5` | Firestore: Deploy rules for generalQuotes collection (admin read, public create) | ✅ |
| Feb 05, 2026 | `3e38c56` | Build Fix: Remove duplicate function definitions in quote-actions.ts | ✅ |
| Feb 05, 2026 | `895aa41` | Quote System Backend: Email notifications, admin UI, Office 365 integration | ✅ |
| Feb 05, 2026 | — | Master Operations hub created, documentation reorganized | ✅ |
| Feb 01, 2026 | `0ec5ad8` | Customer CRUD: Full create/edit/delete, notes, tags | ✅ |
| Jan 30, 2026 | `66d730b` | Customer Management: RFM segmentation, abandoned carts | ✅ |
| Jan 30, 2026 | `8930a78` | Filename Validation: sanitizeCustomerName() helpers | ✅ |
| Jan 18, 2026 | — | Catalog System Complete: 3-tier hierarchy | ✅ |
| Jan 13, 2026 | — | Categories System: Slug-based routing | ✅ |

---

## 🏢 Project Quick Facts

| Property | Value |
|----------|-------|
| **Company** | 3Thirty3 Printing (formerly DTF Wholesale) |
| **Product** | Custom DTF transfers, stickers, apparel printing |
| **Currency** | CAD (Canadian Dollars) |
| **Repository** | `3thirty3gitter/3thirty3-2026-main` |
| **Hosting** | Vercel (auto-deploy on push to `main`) |
| **Framework** | Next.js 14+ with TypeScript |
| **Database** | Firebase/Firestore |
| **Payments** | Square SDK (Production mode) |

---

## ⚡ Quick Actions

### Deploy to Production
```bash
git add [specific-files]
git commit -m "fix(component): description"
git push origin main
# Auto-deploys in ~90 seconds
```

### Emergency Rollback
```bash
# Fastest: Vercel Dashboard → Previous Deployment → Promote
# Or: git revert HEAD && git push origin main
```
📖 **Full Guide:** [maintenance/rollback-procedures.md](maintenance/rollback-procedures.md)

### Check Production Status
- **Vercel Logs:** https://vercel.com/3thirty3gitter/3thirty3-2026-main
- **Firebase Console:** Check Firestore, Auth, Storage
- **Square Dashboard:** Check payments

### Build & Test
```bash
npm run build           # Full production build test
npm run dev             # Local development server
npx tsc --noEmit       # TypeScript check only
```

---

## 🐛 CRITICAL BUG WORKFLOW

**When a bug is discovered:**

1. **Document Immediately**
   ```bash
   touch maintenance/bugfixes/$(date +%Y-%m-%d)_brief-description.md
   # Use template from maintenance/bugfixes/README.md
   ```

2. **Update Issue Tracker**
   - Add to [KNOWN_ISSUES.md](KNOWN_ISSUES.md) under appropriate severity
   - Link to bugfix document

3. **Fix Following RED LINE RULE**
   - Use [.github/copilot_instructions.md](.github/copilot_instructions.md)
   - Surgical edits ONLY
   - No cleanup or refactoring

4. **Deploy with Checklist**
   - Follow [maintenance/deployment-checklist.md](maintenance/deployment-checklist.md)
   - Test locally: `npm run build`
   - Monitor Vercel logs for 10 minutes after deployment

5. **Document Resolution**
   - Update [CHANGELOG.md](CHANGELOG.md)
   - Mark resolved in [KNOWN_ISSUES.md](KNOWN_ISSUES.md)
   - Add commit hash to bugfix document

📖 **Full Workflow:** [.github/DAILY_OPERATIONS_PROTOCOL.md](.github/DAILY_OPERATIONS_PROTOCOL.md)

---

## ✅ Feature Status Matrix

### Core Features (Production-Ready)
| Feature | Status | Quick Access | Notes |
|---------|--------|--------------|-------|
| DTF Nesting Tool | ✅ Live | `/nesting-tool` | 13" & 17" sheets, GA algorithm |
| Square Payments | ✅ Live | `api/process-payment` | Production mode, CAD |
| Cart System | ✅ Live | `nesting-tool.tsx` | Firebase-backed, optimized |
| Order Management | ✅ Live | `/admin` | Full admin dashboard |
| Quote System | ✅ Live | `/admin/quotes` | Email notifications, Office 365 |
| Customer Management | ✅ Live | `/admin/customers` | RFM, tags, notes |
| User Auth | ✅ Live | Login/signup | Email + Google |
| AI Content Gen | ✅ Live | Admin products | GPT-4o-mini |
| Catalog System | ✅ Live | Categories/Collections | 3-tier hierarchy |
| Sticker Builder | ✅ Live | `/stickers` | Size/quantity options |
| Product Customizer | ✅ Live | Product pages | Resize, rotate, flip |

📖 **Detailed Status:** [docs/README.md](docs/README.md)

---

## 🔥 Common Issues & Solutions

### Orders Not Saving
**Symptom:** Orders don't appear in admin dashboard  
**Cause:** Client SDK used in API route instead of Admin SDK  
**Solution:** Always use `order-manager-admin.ts` in API routes  
**Check:** Is `FIREBASE_SERVICE_ACCOUNT_KEY` set in Vercel?

### Payment Fails
**Symptom:** Square payment errors  
**Cause:** Environment mismatch (sandbox keys in production)  
**Solution:** Verify `NEXT_PUBLIC_SQUARE_ENVIRONMENT` matches key prefixes  
**Production keys:** Start with `sq0idp-`  
**Sandbox keys:** Start with `sandbox-sq0idb-`

### Grey Boxes in PDFs
**Symptom:** Blank grey boxes instead of images in print exports  
**Cause:** Cart optimization removed image data  
**Solution:** Ensure `imageUrl` is stored in `layout.positions`  
**Fixed:** Jan 28, 2026

### Cart Won't Add Items
**Symptom:** Items fail to add to cart  
**Cause:** Firestore document size exceeded (1MB limit)  
**Solution:** Already optimized to ~550KB per cart item  
**Check:** Browser console for Firestore errors

### Products Not Showing
**Symptom:** Products missing from collection pages  
**Cause:** `isActive: false` or missing `collectionIds[]`  
**Solution:** Check product admin, ensure correct collection assignment

### Build Fails on Vercel
**Symptom:** Deployment fails, TypeScript errors  
**Cause:** Type errors, missing imports, syntax issues  
**Solution:** Run `npm run build` locally first, fix all errors before pushing

📖 **More Solutions:** [docs/systems/troubleshooting.md](docs/systems/troubleshooting.md)

---

## 🗄️ Database Quick Reference

### Firestore Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users` | Customer profiles | email, firstName, lastName, phone, address |
| `orders` | Order records | userId, total, status, items[], createdAt |
| `generalQuotes` | Quote requests | contactName, contactEmail, teamName, items[], status, createdAt |
| `abandoned_carts` | Incomplete checkouts | userId, items[], total, lastUpdated |
| `categories` | Top-level catalog | slug, name, sortOrder, isActive |
| `catalogCollections` | Mid-tier catalog | categoryId, slug, name, sortOrder |
| `products` | Product listings | slug, basePrice, collectionIds[], isActive |

### Required Firestore Indexes
1. `catalogCollections`: `categoryId` (Asc), `isActive` (Asc), `sortOrder` (Asc)
2. `products`: `collectionIds` (Array), `isActive` (Asc)

📖 **Full Schema:** [docs/systems/database-schema.md](docs/systems/database-schema.md)

---

## 🔐 Environment Variables Reference

### Quick Checklist (Vercel Dashboard)
```bash
# Firebase Client (NEXT_PUBLIC_*)
✓ NEXT_PUBLIC_FIREBASE_API_KEY
✓ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✓ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✓ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✓ NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin (SERVER ONLY - no NEXT_PUBLIC)
✓ FIREBASE_SERVICE_ACCOUNT_KEY          # Base64 JSON - CRITICAL!

# Square (Production)
✓ SQUARE_ACCESS_TOKEN                   # Server-only secret
✓ NEXT_PUBLIC_SQUARE_APPLICATION_ID     # Starts with sq0idp-
✓ NEXT_PUBLIC_SQUARE_LOCATION_ID
✓ NEXT_PUBLIC_SQUARE_ENVIRONMENT        # "production"

# OpenAI
✓ OPENAI_API_KEY                        # Starts with sk-

# Admin Access
✓ NEXT_PUBLIC_ADMIN_EMAILS              # Comma-separated
```

⚠️ **CRITICAL:** Never prefix server secrets with `NEXT_PUBLIC_`

📖 **Full Guide:** [docs/systems/environment-variables.md](docs/systems/environment-variables.md)

---

## 📁 Code Navigation Guide

### Need to fix orders?
- **API:** `src/app/api/process-payment/route.ts`
- **Admin:** `src/lib/order-manager-admin.ts`
- **Types:** `src/types/`

### Need to fix payments?
- **Square Config:** `src/lib/square.ts`
- **Payment API:** `src/app/api/process-payment/route.ts`

### Need to fix nesting/DTF?
- **Main Component:** `src/components/nesting-tool.tsx`
- **Algorithm:** `src/lib/ga-nesting.ts`
- **Export:** `src/lib/print-export.ts`
- **API:** `src/app/api/nesting/route.ts`

### Need to fix catalog/products?
- **Actions:** `src/lib/actions/product-actions.ts`
- **Collections:** `src/lib/actions/catalog-collection-actions.ts`
- **Categories:** `src/lib/actions/category-actions.ts`
- **Admin UI:** `src/app/admin/products/`

### Need to fix customers?
- **Actions:** `src/lib/actions/customer-actions.ts`
- **Admin UI:** `src/app/admin/customers/`
- **Types:** `src/types/customer.ts`

### Need to fix authentication?
- **Client Firebase:** `src/lib/firebase.ts`
- **Server Firebase:** `src/lib/firebase-admin.ts`
- **Auth Context:** `src/contexts/AuthContext.tsx`

### Need to fix AI generation?
- **API:** `src/app/api/ai/generate-content/route.ts`
- **Component:** `src/components/admin/AIGenerateButton.tsx`

📖 **Complete File Map:** [docs/systems/code-structure.md](docs/systems/code-structure.md)

---

## 🚨 Emergency Procedures

### Production is Down
1. **Check Vercel Status:** https://vercel.com (build logs, error logs)
2. **Check Firebase Status:** https://status.firebase.google.com
3. **Check Square Status:** https://status.squareup.com
4. **If Code Issue:** Execute rollback (see below)

### Execute Emergency Rollback
**Fastest (60 seconds):**
1. Open [Vercel Dashboard](https://vercel.com/3thirty3gitter/3thirty3-2026-main)
2. Find last working deployment
3. Click ⋯ → "Promote to Production"

**Git Rollback (2-3 minutes):**
```bash
git revert HEAD
git push origin main
```

📖 **Full Procedures:** [maintenance/rollback-procedures.md](maintenance/rollback-procedures.md)

### Monitor After Rollback
- [ ] Test critical user flows (quotes, orders, checkout)
- [ ] Verify error logs return to normal
- [ ] Document incident in `maintenance/bugfixes/`
- [ ] Update [KNOWN_ISSUES.md](KNOWN_ISSUES.md)

---

## 📊 Monitoring & Health Checks

### Daily Health Check
```bash
# Check build status
npm run build

# Check TypeScript
npx tsc --noEmit

# Check for dependency issues
npm audit
```

### Production Monitoring
- **Vercel Dashboard:** Deployment status, error logs, analytics
- **Firebase Console:** Database usage, auth stats, storage
- **Square Dashboard:** Payment volume, failed transactions
- **Browser Console:** Client-side errors (test in production)

### Performance Metrics
- **Page Load:** Should be < 3 seconds
- **Build Time:** ~90 seconds on Vercel
- **Nesting Algorithm:** < 30 seconds for typical cart (20-30 items)
- **Cart Size:** ~550KB per item (Firestore optimized)

---

## 📚 Documentation Index

### Operations & Maintenance
- [.github/DAILY_OPERATIONS_PROTOCOL.md](.github/DAILY_OPERATIONS_PROTOCOL.md) - Daily workflow
- [maintenance/deployment-checklist.md](maintenance/deployment-checklist.md) - Pre-deploy checklist
- [maintenance/rollback-procedures.md](maintenance/rollback-procedures.md) - Emergency rollback
- [maintenance/bugfixes/](maintenance/bugfixes/) - Bug reports archive
- [KNOWN_ISSUES.md](KNOWN_ISSUES.md) - Active issues tracker
- [CHANGELOG.md](CHANGELOG.md) - Deployment history

### Development Guidelines
- [.github/copilot_instructions.md](.github/copilot_instructions.md) - RED LINE RULE
- [docs/README.md](docs/README.md) - Documentation navigation

### Feature Documentation
- [docs/features/](docs/features/) - Feature guides (catalog, quotes, admin, etc.)
- [docs/systems/](docs/systems/) - System architecture (nesting, cart, auth, etc.)
- [docs/integrations/](docs/integrations/) - Third-party integrations (Firebase, Square, OpenAI)

### Archive
- [handoff-archive/](handoff-archive/) - Historical handoff documents (55 files)
- [docs/archive/](docs/archive/) - Outdated documentation

---

## 🎯 Today's Focus Areas

**Before starting work:**
1. ✓ Read [Recent Changes](#-recent-changes) above
2. ✓ Check [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for blockers
3. ✓ Pull latest code: `git pull origin main`
4. ✓ Run `npm run build` to verify current state
5. ✓ Review [.github/copilot_instructions.md](.github/copilot_instructions.md)

**During work:**
- Follow RED LINE RULE - surgical edits only
- Test with `npm run build` frequently
- Document any issues discovered

**After work:**
- Update [CHANGELOG.md](CHANGELOG.md)
- Update [KNOWN_ISSUES.md](KNOWN_ISSUES.md) if bugs fixed
- Update [Recent Changes](#-recent-changes) above
- Verify production deployment successful

---

## 💡 Pro Tips

### Before Every Commit
```bash
# Run these to avoid deployment failures
npm run build          # Catches 90% of issues
npx tsc --noEmit      # TypeScript validation
git diff              # Review exactly what's changing
```

### Search the Codebase
```bash
# Find where something is used
grep -r "functionName" src/

# Find a component
find src/ -name "*component-name*"

# Search in specific directory
grep -r "search term" src/app/admin/
```

### Best Deployment Times
- ✅ **Mon-Fri 9am-5pm** - Can monitor and respond quickly
- ⚠️ **Evenings/Weekends** - Only for emergencies
- ❌ **Late Friday** - Potential issues linger over weekend

### Keep Commits Atomic
- One feature/fix per commit
- Clear commit messages: `fix(component): what changed`
- Easy to revert if needed
- Better changelog entries

---

## 🆘 Getting Help

### Self-Service Resources
1. Search [docs/](docs/) directory for topic
2. Check [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for similar issues
3. Review [maintenance/bugfixes/](maintenance/bugfixes/) for past solutions
4. Search commit history: `git log --grep="search term"`

### External Resources
- **Next.js Docs:** https://nextjs.org/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Square API Docs:** https://developer.squareup.com/docs
- **Vercel Support:** https://vercel.com/support

---

## 📝 Maintenance Notes

### Update This Document When:
- ✓ New feature completed → Update [Feature Status Matrix](#-feature-status-matrix)
- ✓ Bug fixed → Update [Recent Changes](#-recent-changes) and [Common Issues](#-common-issues--solutions)
- ✓ New integration added → Update [Quick Actions](#-quick-actions)
- ✓ Environment variable changed → Update [Environment Variables](#-environment-variables-reference)
- ✓ New critical file → Update [Code Navigation](#-code-navigation-guide)

### Document Maintenance Schedule
- **Daily:** Update [Recent Changes](#-recent-changes) after deployments
- **Weekly:** Review and update [KNOWN_ISSUES.md](KNOWN_ISSUES.md)
- **Monthly:** Archive old entries from recent changes to full changelog
- **As Needed:** Update sections when system changes

---

**Last Updated:** February 5, 2026  
**Primary Reference:** This document + [.github/DAILY_OPERATIONS_PROTOCOL.md](.github/DAILY_OPERATIONS_PROTOCOL.md)  
**Emergency Contact:** Check project team channels

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| **Production Site** | https://3thirty3-2026-main.vercel.app |
| **Vercel Dashboard** | https://vercel.com/3thirty3gitter/3thirty3-2026-main |
| **GitHub Repo** | https://github.com/3thirty3gitter/3thirty3-2026-main |
| **Firebase Console** | https://console.firebase.google.com |
| **Square Dashboard** | https://squareup.com/dashboard |

---

**Remember:** When in doubt, follow the RED LINE RULE. Make surgical edits. Test thoroughly. Deploy confidently.
