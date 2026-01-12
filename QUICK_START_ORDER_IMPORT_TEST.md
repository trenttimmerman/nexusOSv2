# Order Import - Quick Test Guide

## Overview
The order import feature allows bulk importing of orders from CSV files. It supports Shopify, WooCommerce, and Square export formats.

## Quick Test

### 1. Access Order Import
1. Navigate to the Orders page in the admin panel
2. Click the **"Import Orders"** button in the top-right corner

### 2. Upload Sample CSV
Use the provided `sample-order-import.csv` file which contains 5 test orders:
- Order #1001: Paid, fulfilled, single item
- Order #1002: Paid, unfulfilled, 2 items  
- Order #1003: Pending payment, unfulfilled
- Order #1004: Paid, fulfilled, 3 items, with tags
- Order #1005: Refunded order

### 3. Follow the Wizard

**Step 1: Upload**
- Click or drag-and-drop the CSV file
- System detects platform automatically (Shopify format for sample)

**Step 2: Mapping**
- Fields are auto-mapped based on platform detection
- Review the mapping table showing CSV columns → database fields
- Sample data is displayed for verification
- Adjust any mappings if needed

**Step 3: Validation**
- View validation results
- System checks for:
  - Missing required fields (order_number, total_amount, customer_email)
  - Valid email formats
  - Duplicate order numbers
  - Positive quantities and amounts
  - Valid currency codes (3 letters)

**Step 4: Options**
- **Duplicate Handling**: Choose how to handle duplicate order numbers
  - Skip (default): Leave existing orders unchanged
  - Update: Overwrite existing data (not recommended)
  - Merge: Combine old and new data (not recommended)
- **Create Missing Customers**: Auto-create customer records from emails (enabled by default)
- **Match Products by SKU**: Link order items to products when SKUs match (enabled by default)

**Step 5: Processing**
- Real-time progress bar shows import status
- Statistics display:
  - Orders created
  - Items created
  - Orders skipped
  - Errors encountered
- Processing happens in batches of 10 orders

**Step 6: Complete**
- Final summary shows results
- Any errors are listed for review
- Click "Import More" to import another file or "Done" to return

## What Gets Created

### Orders Table
- `order_number`: Unique identifier from CSV
- `total_amount`: Order total
- `currency`: Currency code (USD, EUR, etc.)
- `payment_status`: paid, pending, refunded, etc.
- `fulfillment_status`: fulfilled, unfulfilled, partial, etc.
- `notes`: Order notes/comments
- `tags`: Comma-separated tags
- `customer_id`: Link to customer record
- `store_id`: Current store

### Order Items Table
- `order_id`: Link to parent order
- `product_name`: Item name from CSV
- `sku`: Product SKU
- `quantity`: Item quantity
- `price_at_purchase`: Item price at time of order
- `product_id`: Link to product (if SKU matched)

### Customers Table (if auto-create enabled)
- New customer records created for emails not in system
- `email`: From order data
- `name`: Parsed from email or order name field
- `store_id`: Current store

## Platform Support

### Shopify Format
- Automatically detected by headers like "Name", "Financial Status", "Lineitem quantity"
- All fields mapped automatically
- Supports multiple line items per order

### WooCommerce Format  
- Detected by headers like "Order ID", "Order Status", "Item Name"
- Auto-mapped to nexusOS fields

### Square Format
- Detected by headers containing "Transaction", "Gross Sales"
- Mapped with Square-specific field patterns

### Custom Format
- System suggests best field mappings
- Manual adjustment available in mapping step

## Testing Checklist

- [ ] Upload CSV with valid orders
- [ ] Verify auto-detection of platform
- [ ] Check field mapping is correct
- [ ] Confirm validation passes
- [ ] Test duplicate detection (upload same file twice)
- [ ] Verify customer auto-creation works
- [ ] Check product SKU matching
- [ ] Confirm batch processing completes
- [ ] Verify orders appear in database
- [ ] Test error handling with invalid data

## Sample Data Format (Shopify)

```csv
Name,Email,Financial Status,Fulfillment Status,Currency,Subtotal,Shipping,Taxes,Total,Lineitem quantity,Lineitem name,Lineitem price,Lineitem sku,Created at,Notes,Tags
#1001,customer@example.com,paid,fulfilled,USD,49.99,5.00,4.50,59.49,1,Premium Widget,49.99,WIDGET-001,2024-01-15,First order,vip
```

## Expected Results

After importing the 5 sample orders:
- **Orders Created**: 5
- **Items Created**: 8 (1+2+1+3+1)
- **Customers Created**: 5 (if not already in system)
- **Skipped**: 0 (on first import)
- **Errors**: 0

## Common Issues

### Issue: No orders created
- **Check**: RLS policies allow INSERT on orders table
- **Fix**: Verify user is authenticated and has store_id

### Issue: Validation errors
- **Check**: Required fields (order_number, total_amount, email)
- **Fix**: Ensure CSV has all required columns mapped

### Issue: Duplicates detected
- **Check**: Order numbers already exist in database
- **Fix**: Choose "Skip" or "Update" strategy in options

### Issue: Customers not created
- **Check**: "Create Missing Customers" option is enabled
- **Fix**: Enable in Step 4 (Options)

### Issue: Products not linked
- **Check**: SKUs in CSV match products in database
- **Fix**: Ensure products have correct SKU values

## Database Verification

After import, verify in Supabase dashboard:

```sql
-- Check orders were created
SELECT * FROM orders 
WHERE order_number IN ('#1001', '#1002', '#1003', '#1004', '#1005');

-- Check order items
SELECT oi.*, o.order_number 
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.order_number IN ('#1001', '#1002', '#1003', '#1004', '#1005');

-- Check customers
SELECT * FROM customers 
WHERE email IN ('customer@example.com', 'jane@example.com', 'bob@example.com', 'alice@example.com', 'charlie@example.com');
```

## Next Steps

1. Test with real Shopify export data
2. Test with WooCommerce export
3. Test with large CSV files (100+ orders)
4. Test error handling with malformed data
5. Verify product matching with existing SKUs
