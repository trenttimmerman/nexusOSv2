# Customer Import Engine Documentation

## Overview
The Customer Import Engine is a comprehensive system for importing customer data from various e-commerce platforms (especially Shopify) into nexusOS. It intelligently handles B2B and B2C customers, addresses, and contacts with automatic field mapping and validation.

## Features

### 🎯 Platform Auto-Detection
- **Shopify**: Detects standard Shopify export format
- **WooCommerce**: Recognizes WooCommerce customer export
- **BigCommerce**: Identifies BigCommerce format
- **Generic CSV**: Falls back to smart field mapping

### 🗺️ Smart Field Mapping
- Automatic field suggestions based on column headers
- Visual mapping interface with dropdowns
- Support for custom field mapping
- Real-time preview of mapped data

### ✅ Data Validation
- Email format validation (required field)
- Phone number format checking
- Duplicate email detection
- Row-by-row error reporting
- Pre-import validation summary

### 🔄 Duplicate Handling Strategies
1. **Skip**: Don't import if email exists
2. **Update**: Replace existing data completely
3. **Merge**: Keep existing data, merge tags and notes

### 🏢 B2B/B2C Support
- Auto-detection based on company name
- Creates separate contact records for B2B customers
- Support for multiple addresses per customer
- Tax-exempt status handling

### 📊 Import Progress Tracking
- Real-time progress bar
- Statistics: created, updated, skipped, errors
- Background processing with progress callbacks
- Final summary report

## Database Schema

### customer_imports
Tracks all import operations:
```sql
- id (UUID)
- store_id (UUID)
- source_platform (shopify, woocommerce, csv)
- status (pending, processing, completed, failed, partial)
- total_records, customers_created, customers_updated, etc.
- mapping_config (JSONB)
- import_options (JSONB)
- error_log (JSONB)
- created_at, completed_at
```

### customers
Enhanced for B2B/B2C:
```sql
- id, store_id, email (required)
- first_name, last_name, phone
- client_type ('organization' | 'individual')
- company_name
- email_marketing, tax_exempt, tax_number
- tags (array), notes
```

### customer_addresses
Multiple addresses per customer:
```sql
- id, customer_id
- address_type ('billing', 'shipping', 'both')
- label ('Headquarters', 'Warehouse', etc.)
- address_line1, address_line2, city, state_province, postal_code, country
- is_default
```

### customer_contacts
B2B contact persons:
```sql
- id, customer_id
- full_name, role, email, phone
- is_primary
```

## Import Workflow

### 1. Upload Step
- Drag & drop CSV file or click to browse
- File is parsed using PapaParse library
- Platform is auto-detected from headers
- Displays file info and preview

### 2. Mapping Step
- Shows all CSV columns
- Dropdowns to map each column to customer fields
- Auto-populated based on platform detection
- Email field is required
- Groups: Customer, Address, Contact (B2B)

### 3. Validation Step
- Validates all mapped data
- Shows error count and details
- Detects duplicate emails
- Lists first 10 errors/duplicates
- Cannot proceed if critical errors exist

### 4. Options Step
- **Duplicate Strategy**: Skip, Update, or Merge
- **Create Addresses**: Import address data when available
- **Create B2B Contacts**: Create contact records for business customers
- **Auto-detect B2B**: Mark customers with company as organizations

### 5. Processing Step
- Shows real-time progress bar
- Live statistics: created, updated, skipped, errors
- Processes in batches of 10 for performance
- Creates import record in database

### 6. Complete Step
- Final summary statistics
- Error log (if any)
- Option to export errors as CSV
- Buttons: Import Another File or View Customers

## Field Mapping Reference

### Shopify Default Mapping
```
First Name → first_name
Last Name → last_name
Email → email
Phone → phone
Company → company_name
Address1 → address_line1
Address2 → address_line2
City → city
Province → state_province
Zip → postal_code
Country → country
Tags → tags (comma-separated → array)
Note → notes
Tax Exempt → tax_exempt (yes/no → boolean)
Accepts Email Marketing → email_marketing (yes/no → boolean)
```

## Usage in Code

### Basic Integration
```tsx
import CustomerImport from './CustomerImport';

<CustomerImport
  storeId={yourStoreId}
  onComplete={() => {
    // Refresh customer list
    loadCustomers();
  }}
/>
```

### Import Processing
```typescript
import { processBatchImport } from '../lib/customerImportProcessor';

const result = await processBatchImport(
  rows,
  storeId,
  {
    duplicateStrategy: 'merge',
    createAddresses: true,
    createContacts: true,
    autoDetectB2B: true,
    batchSize: 10,
  },
  supabase,
  (progress) => {
    console.log(`${progress.current}/${progress.total} processed`);
  }
);
```

## Files Structure
```
components/
  CustomerImport.tsx          # Main UI component
  Customers.tsx               # Enhanced with Import button

lib/
  customerImportParser.ts     # CSV parsing, platform detection, field mapping
  customerImportValidator.ts  # Data validation, duplicate detection
  customerImportProcessor.ts  # Import logic, database operations

migrations/
  create_customer_imports.sql # Database schema for import tracking
```

## Sample CSV

See [sample-customer-import.csv](sample-customer-import.csv) for a Shopify-formatted example with:
- Individual customers (B2C)
- Organization customers (B2B)
- Various addresses and tags
- Tax-exempt businesses

## Error Handling

### Validation Errors
- Missing required email
- Invalid email format
- Invalid phone format
- Invalid client_type

### Import Errors
- Database connection issues
- Constraint violations
- Permission errors
- Row-specific failures are logged and don't stop the import

## Performance Considerations

- **Batch Processing**: Processes 10 rows at a time to balance speed and memory
- **Parallel Processing**: Uses Promise.all for batch operations
- **Progress Callbacks**: Efficient state updates without blocking
- **Database Transactions**: Each row is independent to prevent rollback cascades

## Best Practices

1. **Test with Small Files First**: Validate mapping with 5-10 rows before full import
2. **Export from Source Platform**: Use native export features for best compatibility
3. **Clean Data First**: Remove test/duplicate data before export
4. **Use Merge Strategy**: For repeat imports to avoid losing existing data
5. **Review Errors**: Always check error log after import completion
6. **Tag Consistently**: Use consistent tag formatting across imports

## Future Enhancements
- CSV export with mapping templates
- Scheduled/recurring imports
- API-based imports (Shopify, WooCommerce REST APIs)
- Customer merge/deduplication tools
- Import history and rollback
- Excel (.xlsx) file support
- Custom field mapping templates
