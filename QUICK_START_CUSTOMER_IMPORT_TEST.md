# Quick Start: Customer Import Testing

## 🚀 Ready to Test!

All prerequisites are met. The customer import feature is ready for manual testing.

### What's Running
- ✅ **Dev Server:** http://localhost:3000
- ✅ **Supabase Local:** http://127.0.0.1:54323 (Studio)
- ✅ **Database Migrations:** All applied (38 migrations including 3 for customer import)
- ✅ **Code:** No compilation errors

### Quick Test Steps

#### 1. Access the Feature
1. Open browser: http://localhost:3000
2. Login to admin
3. Navigate to **Customers** page
4. Look for **"Import Customers"** button

#### 2. Upload Sample CSV
- File: `sample-customer-import.csv` (in root directory)
- Contains: 5 customer records (3 individual, 2 organization)
- Features tested:
  - Individual customers (John Doe, Bob Johnson, Mike Brown)
  - B2B customers (Jane Smith @ ACME, Alice Williams @ TechStart)
  - Tax exempt customers (2)
  - Tags (all rows)
  - Addresses (all rows)

#### 3. Follow the Wizard
**Step 1: Upload**
- Drag and drop OR click to browse
- Select `sample-customer-import.csv`

**Step 2: Field Mapping**
- Verify auto-detected Shopify format
- All fields should map automatically:
  - First Name → first_name
  - Company → company_name
  - Tax Exempt → tax_exempt
  - etc.

**Step 3: Validation**
- Should show "5 rows valid, 0 errors"
- Preview should display cleanly

**Step 4: Options**
- Duplicate Strategy: **Skip** (for first import)
- Create Addresses: ✅ **Enabled**
- Create Contacts: ✅ **Enabled**
- Auto-detect B2B: ✅ **Enabled**

**Step 5: Processing**
- Watch progress bar
- Should complete in < 5 seconds

**Step 6: Verify Results**
- Return to Customers list
- Should see 5 new customers

### What to Check

#### In the UI:
- [ ] 5 customers visible in list
- [ ] Jane Smith shows "ACME Corporation"
- [ ] Alice Williams shows "TechStart Inc"
- [ ] Tags visible on customers
- [ ] Clicking customer shows address details

#### In Browser Console:
- [ ] No 400 Bad Request errors
- [ ] No 404 Not Found errors
- [ ] No red error messages

#### In Database (Supabase Studio):
Open http://127.0.0.1:54323 and run:

```sql
-- Count customers by type
SELECT client_type, COUNT(*) 
FROM customers 
GROUP BY client_type;

-- Expected: 3 individual, 2 organization

-- Check tax exempt
SELECT first_name, last_name, company_name, tax_exempt
FROM customers
WHERE tax_exempt = true;

-- Expected: 2 rows (Jane @ ACME, Alice @ TechStart)

-- Check addresses
SELECT COUNT(*) FROM customer_addresses;

-- Expected: 5 addresses

-- Check contacts
SELECT COUNT(*) FROM customer_contacts;

-- Expected: 2 contacts (for B2B customers)
```

### Expected Results Summary

| Metric | Expected Value |
|--------|----------------|
| Total Customers | 5 |
| Individual | 3 |
| Organization | 2 |
| Tax Exempt | 2 |
| Addresses Created | 5 |
| Contacts Created | 2 |
| Import Time | < 5 seconds |

### If Something Goes Wrong

1. **Check browser console** - Look for error messages
2. **Check Supabase logs** - In Studio, go to Logs
3. **Verify migrations** - Run: `npx supabase migration list --local`
4. **Check file format** - Ensure CSV has headers

### Full Testing Documentation

For comprehensive test scenarios and verification queries, see:
📄 **[TESTING_JAN12_CUSTOMER_IMPORT.md](TESTING_JAN12_CUSTOMER_IMPORT.md)**

### Next Steps After Testing

If tests pass:
- ✅ Test with larger CSV (100+ rows)
- ✅ Test duplicate handling (import same file twice)
- ✅ Test error scenarios (malformed CSV)
- ✅ Mark feature as production-ready

If tests fail:
- Document the error
- Check browser console
- Review database logs
- Report findings

---

**Happy Testing!** 🧪
