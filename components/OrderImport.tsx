import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Download, Settings, ShoppingBag, Package } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { parseOrderCSV, detectPlatform, suggestMapping, SHOPIFY_ORDER_MAPPING } from '../lib/orderImportParser';
import { validateImportData, detectDuplicates } from '../lib/orderImportValidator';
import { processBatchImport, ImportProgress, ImportRow } from '../lib/orderImportProcessor';

interface OrderImportProps {
  storeId: string;
  onComplete?: () => void;
}

type ImportStep = 'upload' | 'mapping' | 'validation' | 'options' | 'processing' | 'complete';

export default function OrderImport({ storeId, onComplete }: OrderImportProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCSVData] = useState<any>(null);
  const [platform, setPlatform] = useState<string>('unknown');
  const [fieldMapping, setFieldMapping] = useState<Map<string, string>>(new Map());
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<Map<string, number[]>>(new Map());
  
  // Import options
  const [duplicateStrategy, setDuplicateStrategy] = useState<'skip' | 'update' | 'merge'>('skip');
  const [createCustomers, setCreateCustomers] = useState(true);
  const [matchProducts, setMatchProducts] = useState(true);
  
  // Progress
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    try {
      setFile(uploadedFile);
      const parsed = await parseOrderCSV(uploadedFile);
      setCSVData(parsed);
      
      const detectedPlatform = detectPlatform(parsed.headers);
      setPlatform(detectedPlatform);
      
      // Auto-map fields
      if (detectedPlatform === 'shopify') {
        const shopifyMap = new Map(
          SHOPIFY_ORDER_MAPPING.map(m => [m.sourceField, m.targetField])
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
        if (value !== undefined && value !== null && value !== '') {
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
    
    setStep('validation');
  }, [csvData, fieldMapping]);

  const handleNextFromValidation = () => {
    setStep('options');
  };

  const handleStartImport = async () => {
    setImporting(true);
    setStep('processing');
    
    try {
      const transformedData = csvData.data.map((row: any) => {
        const transformed: any = {};
        for (const [sourceField, targetField] of fieldMapping.entries()) {
          const value = row[sourceField];
          if (value !== undefined && value !== null && value !== '') {
            transformed[targetField] = value;
          }
        }
        return transformed;
      });
      
      // Filter out invalid rows
      const validRows = transformedData.filter((_: any, index: number) => {
        return !validationErrors.some(err => err.row === index + 1);
      });
      
      const result = await processBatchImport(
        validRows,
        storeId,
        {
          duplicateStrategy,
          createCustomers,
          matchProducts,
        },
        supabase,
        setProgress
      );
      
      setProgress(result);
      setStep('complete');
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setCSVData(null);
    setFieldMapping(new Map());
    setValidationErrors([]);
    setDuplicates(new Map());
    setProgress(null);
  };

  return (
    <div className="p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['upload', 'mapping', 'validation', 'options', 'processing'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === s ? 'bg-blue-600 text-white' : 
                ['upload', 'mapping', 'validation', 'options'].indexOf(step) > idx ? 'bg-green-600 text-white' : 
                'bg-gray-200 text-gray-600'
              }`}>
                {['upload', 'mapping', 'validation', 'options'].indexOf(step) > idx ? '✓' : idx + 1}
              </div>
              {idx < 4 && (
                <div className={`h-1 w-16 ${
                  ['upload', 'mapping', 'validation', 'options'].indexOf(step) > idx ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm font-medium text-gray-600">
          <span>Upload</span>
          <span>Mapping</span>
          <span>Validation</span>
          <span>Options</span>
          <span>Import</span>
        </div>
      </div>

      {/* Step Content */}
      {step === 'upload' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <ShoppingBag size={48} className="mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Orders</h2>
            <p className="text-gray-600">Upload a CSV file containing your order data</p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">Choose a file</span>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">CSV files only</p>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Supported Formats:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Shopify order exports</li>
              <li>• WooCommerce order exports</li>
              <li>• Square order exports</li>
              <li>• Custom CSV with order data</li>
            </ul>
          </div>
        </div>
      )}

      {step === 'mapping' && csvData && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Map Fields</h2>
          <p className="text-gray-600 mb-6">
            Detected platform: <span className="font-semibold text-blue-600">{platform}</span>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CSV Column</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Maps To</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sample Data</th>
                </tr>
              </thead>
              <tbody>
                {csvData.headers.map((header: string) => (
                  <tr key={header} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium">{header}</td>
                    <td className="px-4 py-3">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Skip --</option>
                        <option value="order_number">Order Number</option>
                        <option value="customer_email">Customer Email</option>
                        <option value="total_amount">Total Amount</option>
                        <option value="currency">Currency</option>
                        <option value="payment_status">Payment Status</option>
                        <option value="fulfillment_status">Fulfillment Status</option>
                        <option value="created_at">Order Date</option>
                        <option value="item_name">Item Name</option>
                        <option value="item_quantity">Item Quantity</option>
                        <option value="item_price">Item Price</option>
                        <option value="item_sku">Item SKU</option>
                        <option value="notes">Notes</option>
                        <option value="tags">Tags</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">
                      {csvData.data[0]?.[header] || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNextFromMapping}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue to Validation
            </button>
          </div>
        </div>
      )}

      {step === 'validation' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Validation Results</h2>
          
          {validationErrors.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">All rows are valid!</h3>
                  <p className="text-sm text-green-700">Ready to import {csvData.data.length} orders</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={24} className="text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Validation Errors Found</h3>
                  <p className="text-sm text-yellow-700">{validationErrors.length} error(s) in {csvData.data.length} rows</p>
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {validationErrors.slice(0, 10).map((error, idx) => (
                  <div key={idx} className="text-sm text-yellow-800 mb-1">
                    Row {error.row}: {error.message} ({error.field})
                  </div>
                ))}
                {validationErrors.length > 10 && (
                  <div className="text-sm text-yellow-700 mt-2">
                    ... and {validationErrors.length - 10} more errors
                  </div>
                )}
              </div>
            </div>
          )}

          {duplicates.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Duplicate Order Numbers Detected</h3>
              <p className="text-sm text-blue-700 mb-4">
                {duplicates.size} order number(s) appear multiple times in your CSV
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setStep('mapping')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Back
            </button>
            <button
              onClick={handleNextFromValidation}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 'options' && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Import Options</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Duplicate Handling</label>
              <div className="space-y-2">
                {[
                  { value: 'skip', label: 'Skip Duplicates', desc: 'Leave existing orders unchanged' },
                  { value: 'update', label: 'Update Duplicates', desc: 'Overwrite existing data (not recommended)' },
                  { value: 'merge', label: 'Merge Data', desc: 'Combine old and new data (not recommended)' },
                ].map((option) => (
                  <label key={option.value} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      checked={duplicateStrategy === option.value}
                      onChange={() => setDuplicateStrategy(option.value as any)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="createCustomers"
                checked={createCustomers}
                onChange={(e) => setCreateCustomers(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="createCustomers" className="flex-1 cursor-pointer">
                <div className="font-medium text-gray-900">Create Missing Customers</div>
                <div className="text-sm text-gray-600">Automatically create customer records from email addresses</div>
              </label>
            </div>

            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="matchProducts"
                checked={matchProducts}
                onChange={(e) => setMatchProducts(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="matchProducts" className="flex-1 cursor-pointer">
                <div className="font-medium text-gray-900">Match Products by SKU</div>
                <div className="text-sm text-gray-600">Link order items to existing products when SKUs match</div>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={() => setStep('validation')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Back
            </button>
            <button
              onClick={handleStartImport}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Import
            </button>
          </div>
        </div>
      )}

      {step === 'processing' && progress && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Importing Orders...</h2>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-700">Orders Created</div>
              <div className="text-2xl font-bold text-green-900">{progress.ordersCreated}</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-700">Items Created</div>
              <div className="text-2xl font-bold text-blue-900">{progress.itemsCreated}</div>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-700">Skipped</div>
              <div className="text-2xl font-bold text-gray-900">{progress.ordersSkipped}</div>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-700">Errors</div>
              <div className="text-2xl font-bold text-red-900">{progress.errors.length}</div>
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && progress && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-700">Orders Created</div>
              <div className="text-2xl font-bold text-green-900">{progress.ordersCreated}</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-700">Items Created</div>
              <div className="text-2xl font-bold text-blue-900">{progress.itemsCreated}</div>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-700">Skipped</div>
              <div className="text-2xl font-bold text-gray-900">{progress.ordersSkipped}</div>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-700">Errors</div>
              <div className="text-2xl font-bold text-red-900">{progress.errors.length}</div>
            </div>
          </div>

          {progress.errors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Errors:</h3>
              <div className="max-h-40 overflow-y-auto text-sm text-red-800 space-y-1">
                {progress.errors.slice(0, 10).map((error, idx) => (
                  <div key={idx}>Row {error.row}: {error.error}</div>
                ))}
                {progress.errors.length > 10 && (
                  <div className="text-red-700 mt-2">... and {progress.errors.length - 10} more</div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Import More
            </button>
            <button
              onClick={onComplete}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
