import { Customer, CustomerAddress, CustomerContact } from '../types';

export interface ImportRow {
  // Customer fields
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company_name?: string;
  client_type?: 'individual' | 'organization';
  email_marketing?: boolean;
  tags?: string[];
  notes?: string;
  tax_exempt?: boolean;
  
  // Address fields
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  
  // B2B Contact fields (when company_name is present)
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_role?: string;
}

export interface ImportResult {
  success: boolean;
  customerId?: string;
  action: 'created' | 'updated' | 'skipped' | 'error';
  addressesCreated?: number;
  contactsCreated?: number;
  error?: string;
}

export interface ImportProgress {
  current: number;
  total: number;
  customersCreated: number;
  customersUpdated: number;
  customersSkipped: number;
  addressesCreated: number;
  contactsCreated: number;
  errors: Array<{ row: number; error: string; data?: any }>;
}

export async function processImportRow(
  row: ImportRow,
  storeId: string,
  options: {
    duplicateStrategy: 'skip' | 'update' | 'merge';
    createAddresses: boolean;
    createContacts: boolean;
    autoDetectB2B: boolean;
  },
  supabase: any
): Promise<ImportResult> {
  try {
    // Step 1: Auto-detect B2B if enabled
    if (options.autoDetectB2B && row.company_name && !row.client_type) {
      row.client_type = 'organization';
    } else if (!row.client_type) {
      row.client_type = 'individual';
    }

    // Step 2: Check if customer exists
    const { data: existingCustomers, error: searchError } = await supabase
      .from('customers')
      .select('id, tags')
      .eq('store_id', storeId)
      .eq('email', row.email.toLowerCase().trim())
      .limit(1);

    if (searchError) {
      throw new Error(`Database search error: ${searchError.message}`);
    }

    const existingCustomer = existingCustomers?.[0];

    // Step 3: Handle duplicate based on strategy
    if (existingCustomer) {
      if (options.duplicateStrategy === 'skip') {
        return {
          success: true,
          customerId: existingCustomer.id,
          action: 'skipped',
        };
      }

      if (options.duplicateStrategy === 'update') {
        // Update customer
        const updateData: Partial<Customer> = {
          first_name: row.first_name || null,
          last_name: row.last_name || null,
          phone: row.phone || null,
          company_name: row.company_name || null,
          client_type: row.client_type,
          email_marketing: row.email_marketing,
          notes: row.notes || null,
          tax_exempt: row.tax_exempt || false,
        };

        // Handle tags
        if (row.tags && row.tags.length > 0) {
          updateData.tags = row.tags;
        }

        const { error: updateError } = await supabase
          .from('customers')
          .update(updateData)
          .eq('id', existingCustomer.id);

        if (updateError) {
          throw new Error(`Customer update error: ${updateError.message}`);
        }

        return {
          success: true,
          customerId: existingCustomer.id,
          action: 'updated',
        };
      }

      if (options.duplicateStrategy === 'merge') {
        // Merge tags
        const mergedTags = Array.from(
          new Set([...(existingCustomer.tags || []), ...(row.tags || [])])
        );

        const updateData: Partial<Customer> = {
          first_name: row.first_name || existingCustomer.first_name,
          last_name: row.last_name || existingCustomer.last_name,
          phone: row.phone || existingCustomer.phone,
          company_name: row.company_name || existingCustomer.company_name,
          client_type: row.client_type,
          email_marketing: row.email_marketing !== undefined ? row.email_marketing : existingCustomer.email_marketing,
          notes: [existingCustomer.notes, row.notes].filter(Boolean).join('\n\n') || null,
          tax_exempt: row.tax_exempt || existingCustomer.tax_exempt,
          tags: mergedTags.length > 0 ? mergedTags : null,
        };

        const { error: mergeError } = await supabase
          .from('customers')
          .update(updateData)
          .eq('id', existingCustomer.id);

        if (mergeError) {
          throw new Error(`Customer merge error: ${mergeError.message}`);
        }

        return {
          success: true,
          customerId: existingCustomer.id,
          action: 'updated',
        };
      }
    }

    // Step 4: Create new customer
    const customerData: Partial<Customer> = {
      store_id: storeId,
      email: row.email.toLowerCase().trim(),
      first_name: row.first_name || null,
      last_name: row.last_name || null,
      phone: row.phone || null,
      company_name: row.company_name || null,
      client_type: row.client_type,
      email_marketing: row.email_marketing || false,
      notes: row.notes || null,
      tax_exempt: row.tax_exempt || false,
      tags: row.tags && row.tags.length > 0 ? row.tags : null,
    };

    const { data: newCustomer, error: createError } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single();

    if (createError) {
      throw new Error(`Customer creation error: ${createError.message}`);
    }

    let addressesCreated = 0;
    let contactsCreated = 0;

    // Step 5: Create address if data provided
    if (options.createAddresses && row.address_line1) {
      const addressData: Partial<CustomerAddress> = {
        customer_id: newCustomer.id,
        address_type: 'both',
        label: 'Primary',
        address_line1: row.address_line1,
        address_line2: row.address_line2 || null,
        city: row.city || null,
        state_province: row.state_province || null,
        postal_code: row.postal_code || null,
        country: row.country || null,
        is_default: true,
      };

      const { error: addressError } = await supabase
        .from('customer_addresses')
        .insert(addressData);

      if (!addressError) {
        addressesCreated = 1;
      }
    }

    // Step 6: Create contact for B2B customers
    if (
      options.createContacts &&
      row.client_type === 'organization' &&
      (row.contact_first_name || row.first_name)
    ) {
      const contactData: Partial<CustomerContact> = {
        customer_id: newCustomer.id,
        full_name: [row.contact_first_name || row.first_name, row.contact_last_name || row.last_name]
          .filter(Boolean)
          .join(' '),
        role: row.contact_role || null,
        email: row.contact_email || row.email,
        phone: row.contact_phone || row.phone || null,
        is_primary: true,
      };

      const { error: contactError } = await supabase
        .from('customer_contacts')
        .insert(contactData);

      if (!contactError) {
        contactsCreated = 1;
      }
    }

    return {
      success: true,
      customerId: newCustomer.id,
      action: 'created',
      addressesCreated,
      contactsCreated,
    };
  } catch (error: any) {
    return {
      success: false,
      action: 'error',
      error: error.message || 'Unknown error',
    };
  }
}

export async function processBatchImport(
  rows: ImportRow[],
  storeId: string,
  options: {
    duplicateStrategy: 'skip' | 'update' | 'merge';
    createAddresses: boolean;
    createContacts: boolean;
    autoDetectB2B: boolean;
    batchSize?: number;
  },
  supabase: any,
  onProgress?: (progress: ImportProgress) => void
): Promise<ImportProgress> {
  const progress: ImportProgress = {
    current: 0,
    total: rows.length,
    customersCreated: 0,
    customersUpdated: 0,
    customersSkipped: 0,
    addressesCreated: 0,
    contactsCreated: 0,
    errors: [],
  };

  const batchSize = options.batchSize || 10; // Process 10 rows at a time

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    
    // Process batch in parallel
    const results = await Promise.all(
      batch.map((row, batchIndex) =>
        processImportRow(row, storeId, options, supabase).then(result => ({
          result,
          rowIndex: i + batchIndex,
          row,
        }))
      )
    );

    // Update progress
    for (const { result, rowIndex, row } of results) {
      progress.current = rowIndex + 1;

      if (result.success) {
        if (result.action === 'created') {
          progress.customersCreated++;
        } else if (result.action === 'updated') {
          progress.customersUpdated++;
        } else if (result.action === 'skipped') {
          progress.customersSkipped++;
        }
        progress.addressesCreated += result.addressesCreated || 0;
        progress.contactsCreated += result.contactsCreated || 0;
      } else {
        progress.errors.push({
          row: rowIndex + 1,
          error: result.error || 'Unknown error',
          data: row,
        });
      }

      // Report progress
      if (onProgress) {
        onProgress({ ...progress });
      }
    }
  }

  return progress;
}
