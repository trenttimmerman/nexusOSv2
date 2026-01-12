# 🧪 Customer Import Feature Testing

Welcome! This directory contains everything you need to test the Customer Import feature that was built on January 12, 2026.

## 📋 Quick Navigation

### For Quick Testing (5 minutes)
Start here: **[QUICK_START_CUSTOMER_IMPORT_TEST.md](QUICK_START_CUSTOMER_IMPORT_TEST.md)**

### For Comprehensive Testing (30 minutes)
Full guide: **[TESTING_JAN12_CUSTOMER_IMPORT.md](TESTING_JAN12_CUSTOMER_IMPORT.md)**

### Session Summary
Overview: **[SESSION_SUMMARY_JAN12_TESTING.md](SESSION_SUMMARY_JAN12_TESTING.md)**

### Original Feature Documentation
Details: **[HANDOFF_JAN12_CUSTOMER_IMPORT.md](HANDOFF_JAN12_CUSTOMER_IMPORT.md)**

---

## 🚀 What's Ready

✅ **Code:** Fully implemented and error-free  
✅ **Database:** All migrations applied  
✅ **Servers:** Running and accessible  
✅ **Test Data:** Sample CSV prepared  
✅ **Documentation:** Complete testing guides  

---

## 🎯 What to Test

The Customer Import feature allows you to:
- Upload CSV files with customer data
- Auto-detect and map fields (40+ patterns)
- Validate data before import
- Handle duplicates (skip/update/merge)
- Support B2B customers with company info
- Create contacts for organizations
- Create shipping/billing addresses
- Track import progress in real-time

---

## 📦 Files You Need

### Test Data
- `sample-customer-import.csv` - 5 sample customers (3 individual, 2 B2B)

### Documentation
- `QUICK_START_CUSTOMER_IMPORT_TEST.md` - 5-minute test procedure
- `TESTING_JAN12_CUSTOMER_IMPORT.md` - Comprehensive test plan
- `SESSION_SUMMARY_JAN12_TESTING.md` - What's ready and how to start
- `VERIFICATION_QUERIES.sql` - 20 SQL queries for database checks

### Code (already in place)
- `components/CustomerImport.tsx` - Main UI component
- `lib/customerImportParser.ts` - CSV parsing engine
- `lib/customerImportProcessor.ts` - Import logic
- `lib/customerImportValidator.ts` - Data validation

### Database Migrations (already applied)
- `supabase/migrations/20250112000001_customer_imports.sql`
- `supabase/migrations/20250112000002_enhance_customers_b2b.sql`
- `supabase/migrations/20250112000003_email_subscribers.sql`

---

## ⚡ 3-Step Quick Start

### 1. Open the App
```
http://localhost:3000
```

### 2. Navigate to Import
- Login → Admin Panel → Customers → "Import Customers" button

### 3. Upload Sample CSV
- Select `sample-customer-import.csv`
- Follow the wizard
- Verify results

**Full instructions:** [QUICK_START_CUSTOMER_IMPORT_TEST.md](QUICK_START_CUSTOMER_IMPORT_TEST.md)

---

## 🔍 What to Verify

### In the UI
- [ ] 5 customers imported successfully
- [ ] B2B customers show company names
- [ ] Tags visible on customer cards
- [ ] No error messages in UI

### In Browser Console (F12)
- [ ] No 400 Bad Request errors
- [ ] No 404 Not Found errors
- [ ] No red error messages

### In Database
Run queries from `VERIFICATION_QUERIES.sql` in Supabase Studio:
- [ ] 5 customers created (3 individual, 2 organization)
- [ ] 5 addresses created
- [ ] 2 contacts created (for B2B customers)
- [ ] 2 customers marked tax_exempt
- [ ] All customers have tags

---

## 📊 Expected Results

After importing `sample-customer-import.csv`:

| Metric | Expected |
|--------|----------|
| Total Customers | 5 |
| Individual | 3 |
| Organization | 2 |
| Tax Exempt | 2 |
| Addresses | 5 |
| Contacts | 2 |
| Import Time | < 5 sec |

---

## 🛠️ Available Tools

### Application URLs
- **App:** http://localhost:3000
- **Supabase Studio:** http://127.0.0.1:54323
- **Mailpit:** http://127.0.0.1:54324

### Test Queries
Open `VERIFICATION_QUERIES.sql` and run in Supabase Studio SQL Editor

### Documentation
All markdown files in this directory provide guidance

---

## ❓ If Something Goes Wrong

### Check Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Note any 400 or 404 messages

### Check Database
1. Open Supabase Studio: http://127.0.0.1:54323
2. Go to Table Editor
3. Check `customers`, `customer_addresses`, `customer_contacts` tables
4. Look for imported data

### Check Migrations
```bash
npx supabase migration list --local
```
Should show all migrations with ✓

### Still Having Issues?
Document the error and share:
- Error message (exact text)
- Browser console screenshot
- Steps to reproduce
- Which test was running

---

## 🎓 Learning Resources

### Feature Architecture
```
CSV Upload → Parser → Validator → Processor → Database
     ↓          ↓          ↓           ↓          ↓
 File Read   Field Map  Check Errors  Batch     Insert
             Auto-detect Validation   Import    Customers
             40+ patterns Email check  Progress  Addresses
                                       Tracking  Contacts
```

### Key Concepts
- **Field Mapping:** Auto-detects Shopify, WooCommerce, or custom formats
- **Validation:** Checks email format, required fields
- **Duplicate Detection:** Email-based matching
- **Batch Processing:** 10 rows at a time for performance
- **B2B Support:** Auto-detects organizations via company_name
- **Multi-tenant:** Isolated by store_id via RLS

---

## 📝 Test Execution Template

Copy this to track your testing:

```markdown
## Test Session: [DATE/TIME]

### Tests Completed
- [ ] Basic CSV Upload
- [ ] Field Auto-Detection
- [ ] Validation
- [ ] Duplicate Handling
- [ ] B2B Import
- [ ] Contact Creation
- [ ] Address Creation
- [ ] Console Error Check

### Results
- **Import Time:** _____ seconds
- **Customers Created:** _____
- **Addresses Created:** _____
- **Contacts Created:** _____

### Issues Found
1. [Issue description]
2. [Issue description]

### Screenshots
- [Attach if needed]

### Verdict
- [ ] ✅ Ready for Production
- [ ] ⚠️ Needs Fixes
- [ ] ❌ Blocked
```

---

## 🎯 Success Criteria

The feature is **PRODUCTION READY** when:

1. ✅ CSV uploads without errors
2. ✅ Field mapping auto-detects correctly
3. ✅ Validation catches invalid data
4. ✅ All 3 duplicate strategies work
5. ✅ B2B customers created with company info
6. ✅ Contacts created for organizations
7. ✅ Addresses created for all customers
8. ✅ No 400/404 console errors
9. ✅ Database records match expectations
10. ✅ Import completes in reasonable time

---

## 🚀 After Testing

### If Tests Pass
1. Test with larger CSV (100+ rows)
2. Test duplicate scenarios (import twice)
3. Test edge cases (malformed data)
4. Document findings
5. Mark as production-ready

### If Tests Fail
1. Document specific errors
2. Share error details
3. We'll debug together in next session

---

## 📞 Support

- **Original Handoff:** [HANDOFF_JAN12_CUSTOMER_IMPORT.md](HANDOFF_JAN12_CUSTOMER_IMPORT.md)
- **Code Location:** `components/CustomerImport.tsx`, `lib/customerImport*.ts`
- **Database Migrations:** `supabase/migrations/202501120000*.sql`

---

**Ready to test?** Start with [QUICK_START_CUSTOMER_IMPORT_TEST.md](QUICK_START_CUSTOMER_IMPORT_TEST.md) 🧪

**Happy Testing!** 🎉
