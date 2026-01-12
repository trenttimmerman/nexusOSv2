import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Download, Settings, Database, Users, MapPin, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { parseCustomerCSV, detectPlatform, suggestMapping, SHOPIFY_DEFAULT_MAPPING } from '../lib/customerImportParser';
import { validateImportData, detectDuplicates } from '../lib/customerImportValidator';
import { processBatchImport, ImportProgress, ImportRow } from '../lib/customerImportProcessor';

interface CustomerImportProps {
  storeId: string;
  onComplete?: () => void;
}

type ImportStep = 'upload' | 'mapping' | 'validation' | 'options' | 'processing' | 'complete';

export default function CustomerImport({ storeId, onComplete }: CustomerImportProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCSVData] = useState<any>(null);
  const [platform, setPlatform] = useState<string>('unknown');
  const [fieldMapping, setFieldMapping] = useState<Map<string, string>>(new Map());
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<Map<string, number[]>>(new Map());
  
  // Import options
  const [duplicateStrategy, setDuplicateStrategy] = useState<'skip' | 'update' | 'merge'>('skip');
  const [createAddresses, setCreateAddresses] = useState(true);
  const [createContacts, setCreateContacts] = useState(true);
  const [autoDetectB2B, setAutoDetectB2B] = useState(true);
  
  // Progress
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [importId, setImportId] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    try {
      setFile(uploadedFile);
      const parsed = await parseCustomerCSV(uploadedFile);
      setCSVData(parsed);
      
      const detectedPlatform = detectPlatform(parsed.headers);
      setPlatform(detectedPlatform);
      
      // Auto-map fields
      if (detectedPlatform === 'shopify') {
        const shopifyMap = new Map(
          SHOPIFY_DEFAULT_MAPPING.map(m => [m.sourceField, m.targetField])
        );
        setFieldMapping(shopifyMap);
      } else {
        const suggested = suggestMapping(parsed.headers);
        setFieldMapping(suggested);
      }
      
      setStep('mapping');
    } catch (error: any) {
      alert(`Failed to parse CSV: ${error.message}`);
    }
  }, []);

  const handleNextFromMapping = useCallback(() => {
    // Transform data based on mapping
    const transformedData = csvData.data.map((row: any) => {
      const transformed: any = {};
      
      for (const [sourceField, targetField] of fieldMapping.entries()) {
        const value = row[sourceField];
        
        // Apply transformations
        if (targetField === 'tags' && value) {
          transformed[targetField] = value.split(',').map((t: string) => t.trim());
        } else if (targetField === 'email_marketing' || targetField === 'tax_exempt') {
          transformed[targetField] = value?.toLowerCase() === 'yes' || value?.toLowerCase() === 'true';
        } else if (targetField === 'client_type') {
          // Normalize client_type values
          const normalized = value?.toLowerCase().trim();
          if (normalized === 'organization' || normalized === 'business' || normalized === 'company' || normalized === 'b2b') {
            transformed[targetField] = 'organization';
          } else if (normalized === 'individual' || normalized === 'consumer' || normalized === 'personal' || normalized === 'b2c') {
            transformed[targetField] = 'individual';
          }
        } else if (value !== undefined && value !== null && value !== '') {
          transformed[targetField] = value;
        }
      }
      
      return transformed;
    });

    // Validate
    const validation = validateImportData(transformedData);
    setValidationErrors(validation.errors);
    
    // Detect duplicates
    const dupes = detectDuplicates(transformedData);
    setDuplicates(dupes);
    
    setCSVData({ ...csvData, data: transformedData });
    setStep('validation');
  }, [csvData, fieldMapping]);

  const handleNextFromValidation = useCallback(() => {
    setStep('options');
  }, []);

  const handleStartImport = useCallback(async () => {
    setImporting(true);
    setStep('processing');

    // Create import record
    const { data: importRecord, error: importError } = await supabase
      .from('customer_imports')
      .insert({
        store_id: storeId,
        source_platform: platform,
        status: 'processing',
        total_records: csvData.data.length,
        filename: file?.name,
        file_size: file?.size,
        mapping_config: Object.fromEntries(fieldMapping),
        import_options: {
          duplicateStrategy,
          createAddresses,
          createContacts,
          autoDetectB2B,
        },
      })
      .select()
      .single();

    if (importError) {
      alert(`Failed to create import record: ${importError.message}`);
      setImporting(false);
      return;
    }

    setImportId(importRecord.id);

    try {
      // Process import
      const finalProgress = await processBatchImport(
        csvData.data as ImportRow[],
        storeId,
        {
          duplicateStrategy,
          createAddresses,
          createContacts,
          autoDetectB2B,
          batchSize: 10,
        },
        supabase,
        setProgress
      );

      // Update import record
      await supabase
        .from('customer_imports')
        .update({
          status: finalProgress.errors.length > 0 ? 'partial' : 'completed',
          customers_created: finalProgress.customersCreated,
          customers_updated: finalProgress.customersUpdated,
          customers_skipped: finalProgress.customersSkipped,
          addresses_created: finalProgress.addressesCreated,
          contacts_created: finalProgress.contactsCreated,
          errors_count: finalProgress.errors.length,
          error_log: finalProgress.errors,
          summary: {
            totalProcessed: finalProgress.current,
            successRate: ((finalProgress.current - finalProgress.errors.length) / finalProgress.current) * 100,
          },
          completed_at: new Date().toISOString(),
        })
        .eq('id', importRecord.id);

      setProgress(finalProgress);
      setStep('complete');
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
      
      await supabase
        .from('customer_imports')
        .update({
          status: 'failed',
          error_log: [{ error: error.message }],
        })
        .eq('id', importRecord.id);
    } finally {
      setImporting(false);
    }
  }, [csvData, storeId, platform, file, fieldMapping, duplicateStrategy, createAddresses, createContacts, autoDetectB2B]);

  const renderUploadStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Database className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Customers</h2>
        <p className="text-gray-600">Upload a CSV file to import customers, addresses, and contacts</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <label className="cursor-pointer">
            <span className="text-blue-600 font-medium hover:text-blue-700">
              Choose a CSV file
            </span>
            <span className="text-gray-600"> or drag and drop</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">Supports Shopify, WooCommerce, and custom CSV formats</p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <div className="font-medium text-gray-900">Customer Data</div>
            <div className="text-gray-600 text-xs mt-1">Name, email, phone, company</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <MapPin className="w-6 h-6 text-green-600 mb-2" />
            <div className="font-medium text-gray-900">Addresses</div>
            <div className="text-gray-600 text-xs mt-1">Billing & shipping addresses</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <Briefcase className="w-6 h-6 text-purple-600 mb-2" />
            <div className="font-medium text-gray-900">B2B Contacts</div>
            <div className="text-gray-600 text-xs mt-1">Business contact persons</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMappingStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Map CSV Fields</h2>
        <p className="text-gray-600">
          Match your CSV columns to customer fields
          {platform !== 'unknown' && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {platform} format detected
            </span>
          )}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {csvData?.headers.map((header: string) => (
            <div key={header} className="flex items-center gap-4">
              <div className="flex-1 font-medium text-gray-700">{header}</div>
              <div className="flex-1">
                <select
                  value={fieldMapping.get(header) || ''}
                  onChange={(e) => {
                    const newMapping = new Map(fieldMapping);
                    if (e.target.value) {
                      newMapping.set(header, e.target.value);
                    } else {
                      newMapping.delete(header);
                    }
                    setFieldMapping(newMapping);
                  }}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" className="text-gray-900">Skip this field</option>
                  <optgroup label="Customer">
                    <option value="email">Email *</option>
                    <option value="first_name">First Name</option>
                    <option value="last_name">Last Name</option>
                    <option value="phone">Phone</option>
                    <option value="company_name">Company Name</option>
                    <option value="client_type">Account Type (organization/individual)</option>
                    <option value="website">Website</option>
                    <option value="notes">Notes / Internal Notes</option>
                    <option value="tags">Tags</option>
                    <option value="tax_exempt">Tax Exempt</option>
                    <option value="tax_number">Tax ID / Resale Number</option>
                    <option value="email_marketing">Email Marketing</option>
                  </optgroup>
                  <optgroup label="Shipping Address">
                    <option value="shipping_address_1">Shipping Address 1</option>
                    <option value="shipping_address_2">Shipping Address 2</option>
                    <option value="shipping_city">Shipping City</option>
                    <option value="shipping_state">Shipping State/Province</option>
                    <option value="shipping_postal_code">Shipping Postal Code</option>
                    <option value="shipping_country">Shipping Country</option>
                    <option value="shipping_label">Shipping Label</option>
                  </optgroup>
                  <optgroup label="Billing Address">
                    <option value="billing_address_1">Billing Address 1</option>
                    <option value="billing_address_2">Billing Address 2</option>
                    <option value="billing_city">Billing City</option>
                    <option value="billing_state">Billing State/Province</option>
                    <option value="billing_postal_code">Billing Postal Code</option>
                    <option value="billing_country">Billing Country</option>
                    <option value="billing_label">Billing Label</option>
                  </optgroup>
                  <optgroup label="Contact (B2B)">
                    <option value="contact_first_name">Contact First Name</option>
                    <option value="contact_last_name">Contact Last Name</option>
                    <option value="contact_email">Contact Email</option>
                    <option value="contact_phone">Contact Phone</option>
                    <option value="contact_role">Contact Role</option>
                  </optgroup>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            onClick={() => setStep('upload')}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            ← Back
          </button>
          <div className="text-sm text-gray-600">
            {csvData?.rowCount} rows · {fieldMapping.size} fields mapped
          </div>
          <button
            onClick={handleNextFromMapping}
            disabled={!fieldMapping.has('email')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );

  const renderValidationStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Validation Results</h2>
        <p className="text-gray-600">Review any errors or duplicates before importing</p>
      </div>

      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">{csvData?.data.length}</div>
              <div className="text-sm text-gray-600">Total Rows</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{validationErrors.length}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{duplicates.size}</div>
              <div className="text-sm text-gray-600">Duplicate Emails</div>
            </div>
          </div>
        </div>

        {/* Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Validation Errors</h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {validationErrors.slice(0, 10).map((error, idx) => (
                <div key={idx} className="text-sm text-red-800">
                  Row {error.row}: {error.message} ({error.field}: {error.value})
                </div>
              ))}
              {validationErrors.length > 10 && (
                <div className="text-sm text-red-600">
                  ...and {validationErrors.length - 10} more errors
                </div>
              )}
            </div>
          </div>
        )}

        {/* Duplicates */}
        {duplicates.size > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Duplicate Emails Found</h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Array.from(duplicates.entries()).slice(0, 5).map(([email, rows]) => (
                <div key={email} className="text-sm text-yellow-800">
                  {email} appears in rows: {rows.join(', ')}
                </div>
              ))}
              {duplicates.size > 5 && (
                <div className="text-sm text-yellow-600">
                  ...and {duplicates.size - 5} more duplicates
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success */}
        {validationErrors.length === 0 && duplicates.size === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Ready to Import</h3>
            </div>
            <p className="text-sm text-green-800 mt-2">
              All {csvData?.data.length} rows passed validation
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setStep('mapping')}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          ← Back to Mapping
        </button>
        <button
          onClick={handleNextFromValidation}
          disabled={validationErrors.length > 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );

  const renderOptionsStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Options</h2>
        <p className="text-gray-600">Configure how the import should handle your data</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Duplicate Strategy */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Duplicate Email Strategy
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="duplicate"
                value="skip"
                checked={duplicateStrategy === 'skip'}
                onChange={(e) => setDuplicateStrategy(e.target.value as any)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">Skip</div>
                <div className="text-sm text-gray-600">Don't import if email already exists</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="duplicate"
                value="update"
                checked={duplicateStrategy === 'update'}
                onChange={(e) => setDuplicateStrategy(e.target.value as any)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">Update</div>
                <div className="text-sm text-gray-600">Replace existing data with new data</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="duplicate"
                value="merge"
                checked={duplicateStrategy === 'merge'}
                onChange={(e) => setDuplicateStrategy(e.target.value as any)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">Merge</div>
                <div className="text-sm text-gray-600">Keep existing data, add new tags and notes</div>
              </div>
            </label>
          </div>
        </div>

        {/* Additional Options */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={createAddresses}
              onChange={(e) => setCreateAddresses(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <div className="font-medium text-gray-900">Create Addresses</div>
              <div className="text-sm text-gray-600">Import address data when available</div>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={createContacts}
              onChange={(e) => setCreateContacts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <div className="font-medium text-gray-900">Create B2B Contacts</div>
              <div className="text-sm text-gray-600">Create contact records for business customers</div>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={autoDetectB2B}
              onChange={(e) => setAutoDetectB2B(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <div>
              <div className="font-medium text-gray-900">Auto-detect Organizations</div>
              <div className="text-sm text-gray-600">
                Automatically set account type to "organization" when company name is present
                <span className="block text-xs text-gray-500 mt-1">
                  (Overridden by explicit Account Type field if mapped)
                </span>
              </div>
            </div>
          </label>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 text-sm">Account Type Detection</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Explicit mapping:</strong> If you mapped an "Account Type" field, those values will be used directly</li>
            <li>• <strong>Auto-detect (if enabled):</strong> Customers with company names become "organization" accounts</li>
            <li>• <strong>Default:</strong> Customers without company names are "individual" accounts</li>
            <li>• <strong>Accepted values:</strong> organization, business, company, b2b → Organization | individual, consumer, personal, b2c → Individual</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setStep('validation')}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          ← Back
        </button>
        <button
          onClick={handleStartImport}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Start Import
        </button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Importing Customers...</h2>
        <p className="text-gray-600">Please wait while we process your data</p>
      </div>

      {progress && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{progress.customersCreated}</div>
              <div className="text-sm text-gray-600">Created</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{progress.customersUpdated}</div>
              <div className="text-sm text-gray-600">Updated</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{progress.customersSkipped}</div>
              <div className="text-sm text-gray-600">Skipped</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{progress.errors.length}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </div>

          {progress.addressesCreated > 0 && (
            <div className="text-sm text-gray-600">
              📍 {progress.addressesCreated} addresses created
            </div>
          )}
          {progress.contactsCreated > 0 && (
            <div className="text-sm text-gray-600">
              👤 {progress.contactsCreated} contacts created
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCompleteStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h2>
        <p className="text-gray-600">Your customers have been imported</p>
      </div>

      {progress && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{progress.customersCreated}</div>
              <div className="text-sm text-gray-600">Customers Created</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{progress.customersUpdated}</div>
              <div className="text-sm text-gray-600">Customers Updated</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{progress.addressesCreated}</div>
              <div className="text-sm text-gray-600">Addresses Created</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{progress.contactsCreated}</div>
              <div className="text-sm text-gray-600">Contacts Created</div>
            </div>
          </div>

          {progress.errors.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-900">
                  {progress.errors.length} rows failed to import
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Export Errors
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto text-xs text-red-800 bg-red-50 p-3 rounded">
                {progress.errors.slice(0, 5).map((error, idx) => (
                  <div key={idx} className="mb-1">
                    Row {error.row}: {error.error}
                  </div>
                ))}
                {progress.errors.length > 5 && (
                  <div>...and {progress.errors.length - 5} more</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => {
            setStep('upload');
            setFile(null);
            setCSVData(null);
            setProgress(null);
            setFieldMapping(new Map());
          }}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Import Another File
        </button>
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Customers
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {['upload', 'mapping', 'validation', 'options', 'processing', 'complete'].map((s, idx) => (
              <React.Fragment key={s}>
                {idx > 0 && <div className="w-12 h-0.5 bg-gray-300" />}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s
                      ? 'bg-blue-600 text-white'
                      : ['upload', 'mapping', 'validation', 'options', 'processing', 'complete'].indexOf(step) >
                        idx
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        {step === 'upload' && renderUploadStep()}
        {step === 'mapping' && renderMappingStep()}
        {step === 'validation' && renderValidationStep()}
        {step === 'options' && renderOptionsStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'complete' && renderCompleteStep()}
      </div>
    </div>
  );
}
