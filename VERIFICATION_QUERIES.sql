-- Customer Import Verification Queries
-- Run these in Supabase Studio (http://127.0.0.1:54323) after importing

-- ==========================================
-- QUICK CHECKS
-- ==========================================

-- 1. Total customers imported
SELECT COUNT(*) as total_customers FROM customers;

-- 2. Customers by type
SELECT 
  client_type, 
  COUNT(*) as count 
FROM customers 
GROUP BY client_type
ORDER BY client_type;

-- Expected: 3 individual, 2 organization

-- 3. Total addresses
SELECT COUNT(*) as total_addresses FROM customer_addresses;
-- Expected: 5

-- 4. Total contacts
SELECT COUNT(*) as total_contacts FROM customer_contacts;
-- Expected: 2 (only for B2B customers)

-- ==========================================
-- DETAILED VERIFICATION
-- ==========================================

-- 5. View all imported customers with key fields
SELECT 
  id,
  first_name,
  last_name,
  email,
  client_type,
  company_name,
  tax_exempt,
  tags,
  email_marketing,
  created_at
FROM customers
ORDER BY created_at DESC
LIMIT 20;

-- 6. Check B2B customers specifically
SELECT 
  first_name || ' ' || last_name as name,
  email,
  company_name,
  tax_exempt,
  tax_number,
  tags
FROM customers
WHERE client_type = 'organization'
ORDER BY created_at DESC;

-- Expected: 2 rows
-- - Jane Smith @ ACME Corporation (tax_exempt = true, tags includes 'wholesale', 'b2b')
-- - Alice Williams @ TechStart Inc (tax_exempt = true, tags includes 'b2b', 'tech', 'startup')

-- 7. Check individual customers
SELECT 
  first_name || ' ' || last_name as name,
  email,
  tags,
  email_marketing
FROM customers
WHERE client_type = 'individual'
ORDER BY created_at DESC;

-- Expected: 3 rows
-- - John Doe (tags: 'vip')
-- - Bob Johnson (tags: 'retail')  
-- - Mike Brown (tags: 'newsletter', 'promo')

-- 8. View all addresses with customer info
SELECT 
  c.first_name || ' ' || c.last_name as customer_name,
  c.email,
  ca.address_type,
  ca.label,
  ca.address_line1,
  ca.address_line2,
  ca.city,
  ca.state_province,
  ca.postal_code,
  ca.country,
  ca.is_default
FROM customer_addresses ca
JOIN customers c ON ca.customer_id = c.id
ORDER BY ca.created_at DESC;

-- Expected: 5 addresses, all with is_default = true, all with country = 'CA' or 'Canada'

-- 9. View all contacts with customer info
SELECT 
  c.company_name,
  c.email as company_email,
  cc.full_name as contact_name,
  cc.email as contact_email,
  cc.phone as contact_phone,
  cc.role,
  cc.is_primary
FROM customer_contacts cc
JOIN customers c ON cc.customer_id = c.id
ORDER BY cc.created_at DESC;

-- Expected: 2 contacts
-- - Contact for ACME Corporation (Jane Smith)
-- - Contact for TechStart Inc (Alice Williams)

-- 10. Check tags distribution
SELECT 
  unnest(tags) as tag,
  COUNT(*) as usage_count
FROM customers
WHERE tags IS NOT NULL
GROUP BY tag
ORDER BY usage_count DESC;

-- Expected tags: vip, wholesale, b2b, retail, newsletter, promo, tech, startup

-- 11. Tax exempt customers
SELECT 
  first_name || ' ' || last_name as name,
  company_name,
  email,
  tax_exempt,
  tax_number
FROM customers
WHERE tax_exempt = true
ORDER BY created_at DESC;

-- Expected: 2 customers (Jane Smith @ ACME, Alice Williams @ TechStart)

-- 12. Check email marketing opt-ins
SELECT 
  email_marketing,
  COUNT(*) as count
FROM customers
GROUP BY email_marketing;

-- ==========================================
-- DATA INTEGRITY CHECKS
-- ==========================================

-- 13. Ensure all customers have store_id
SELECT COUNT(*) as customers_without_store 
FROM customers 
WHERE store_id IS NULL;
-- Expected: 0

-- 14. Ensure all addresses have customer_id
SELECT COUNT(*) as orphan_addresses
FROM customer_addresses ca
WHERE NOT EXISTS (
  SELECT 1 FROM customers c WHERE c.id = ca.customer_id
);
-- Expected: 0

-- 15. Ensure all contacts have customer_id
SELECT COUNT(*) as orphan_contacts
FROM customer_contacts cc
WHERE NOT EXISTS (
  SELECT 1 FROM customers c WHERE c.id = cc.customer_id
);
-- Expected: 0

-- 16. Check for duplicate emails
SELECT 
  email,
  COUNT(*) as count
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;
-- Expected: 0 rows (no duplicates on first import)

-- 17. Check all organizations have contacts
SELECT 
  c.first_name || ' ' || c.last_name as name,
  c.company_name,
  c.email,
  COUNT(cc.id) as contact_count
FROM customers c
LEFT JOIN customer_contacts cc ON c.id = cc.customer_id
WHERE c.client_type = 'organization'
GROUP BY c.id, c.first_name, c.last_name, c.company_name, c.email;

-- Expected: Both organizations should have contact_count = 1

-- 18. Check all customers have addresses
SELECT 
  c.first_name || ' ' || c.last_name as name,
  c.email,
  COUNT(ca.id) as address_count
FROM customers c
LEFT JOIN customer_addresses ca ON c.id = ca.customer_id
GROUP BY c.id, c.first_name, c.last_name, c.email
ORDER BY c.created_at DESC;

-- Expected: All 5 customers should have address_count = 1

-- ==========================================
-- IMPORT TRACKING (if customer_imports table exists)
-- ==========================================

-- 19. View import history
SELECT 
  id,
  filename,
  total_rows,
  successful_rows,
  failed_rows,
  skipped_rows,
  status,
  started_at,
  completed_at,
  EXTRACT(EPOCH FROM (completed_at - started_at)) as duration_seconds
FROM customer_imports
ORDER BY started_at DESC
LIMIT 10;

-- 20. View import errors
SELECT 
  filename,
  error_details
FROM customer_imports
WHERE failed_rows > 0
ORDER BY started_at DESC;

-- ==========================================
-- CLEANUP (USE CAREFULLY - DELETES DATA!)
-- ==========================================

-- DANGER: Only run these if you need to reset and re-test

-- Delete all imported data (in correct order due to foreign keys)
-- UNCOMMENT TO USE:

-- DELETE FROM customer_contacts;
-- DELETE FROM customer_addresses;
-- DELETE FROM customers WHERE email IN (
--   'john@example.com',
--   'jane@acmecorp.com', 
--   'bob@example.com',
--   'alice@techstart.io',
--   'mike@example.com'
-- );

-- Or delete by timestamp (safer - only deletes recent imports)
-- DELETE FROM customer_addresses WHERE created_at > NOW() - INTERVAL '1 hour';
-- DELETE FROM customer_contacts WHERE created_at > NOW() - INTERVAL '1 hour';
-- DELETE FROM customers WHERE created_at > NOW() - INTERVAL '1 hour';

-- ==========================================
-- END OF VERIFICATION QUERIES
-- ==========================================
