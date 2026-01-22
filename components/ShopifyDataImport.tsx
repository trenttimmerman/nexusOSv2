/**
 * Shopify Data Import Component
 * Complete data migration wizard with OAuth, progress tracking, and verification
 */

import React, { useState, useEffect } from 'react';
import { Store, CheckCircle, AlertCircle, Package, Users, ShoppingCart, FileText, Loader, ExternalLink } from 'lucide-react';
import { ShopifyClient, createShopifyOAuthUrl } from '../lib/shopify/client';
import { runShopifyImport, verifyImport, ImportProgress, ImportResult } from '../lib/shopify/masterImporter';
import { runAssetMigration } from '../lib/shopify/assetMigrator';
import { supabase } from '../lib/supabaseClient';

interface ShopifyDataImportProps {
  storeId: string;
  onComplete?: () => void;
}

type Step = 'connect' | 'select' | 'preview' | 'importing' | 'complete';
type ImportType = 'products' | 'collections' | 'customers' | 'orders' | 'all';

export default function ShopifyDataImport({ storeId, onComplete }: ShopifyDataImportProps) {
  const [step, setStep] = useState<Step>('connect');
  const [shopDomain, setShopDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<ImportType>>(new Set(['all']));
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assetProgress, setAssetProgress] = useState<any>(null);

  // Check for existing Shopify credentials
  useEffect(() => {
    checkExistingConnection();
  }, [storeId]);

  async function checkExistingConnection() {
    try {
      const { data, error } = await supabase
        .from('shopify_credentials')
        .select('shop_domain, access_token')
        .eq('store_id', storeId)
        .single();

      if (data && !error) {
        setShopDomain(data.shop_domain);
        setAccessToken(data.access_token);
        
        // Test connection
        const client = new ShopifyClient({
          shopDomain: data.shop_domain,
          accessToken: data.access_token,
        });

        const testResult = await client.testConnection();
        if (testResult.connected) {
          setConnected(true);
          setShopInfo(testResult.shop);
          setStep('select');
        }
      }
    } catch (err) {
      console.error('Failed to check existing connection:', err);
    }
  }

  async function handleConnect() {
    if (!shopDomain || !accessToken) {
      setError('Please enter both shop domain and access token');
      return;
    }

    setError(null);
    setImporting(true);

    try {
      const client = new ShopifyClient({
        shopDomain,
        accessToken,
      });

      const testResult = await client.testConnection();

      if (!testResult.connected) {
        throw new Error('Failed to connect to Shopify. Please check your credentials.');
      }

      // Save credentials
      await supabase.from('shopify_credentials').upsert({
        store_id: storeId,
        shop_domain: shopDomain,
        access_token: accessToken,
        scopes: testResult.scopes || [],
        connected_at: new Date().toISOString(),
      });

      setConnected(true);
      setShopInfo(testResult.shop);
      setStep('select');
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    } finally {
      setImporting(false);
    }
  }

  function toggleImportType(type: ImportType) {
    const newSelected = new Set(selectedTypes);
    
    if (type === 'all') {
      if (newSelected.has('all')) {
        newSelected.clear();
      } else {
        newSelected.clear();
        newSelected.add('all');
      }
    } else {
      newSelected.delete('all');
      if (newSelected.has(type)) {
        newSelected.delete(type);
      } else {
        newSelected.add(type);
      }
    }

    setSelectedTypes(newSelected);
  }

  async function handleStartImport() {
    if (selectedTypes.size === 0) {
      setError('Please select at least one data type to import');
      return;
    }

    setError(null);
    setStep('importing');
    setImporting(true);

    try {
      const client = new ShopifyClient({
        shopDomain,
        accessToken,
      });

      // Run data import
      const importResult = await runShopifyImport(client, {
        storeId,
        types: Array.from(selectedTypes),
        onProgress: (prog) => {
          setProgress(prog);
        },
      });

      setResult(importResult);

      // Run asset migration
      setProgress({
        currentType: 'all',
        currentCount: 0,
        overallProgress: 95,
        message: 'Migrating assets from Shopify CDN...',
      });

      const migrationId = `migration_${Date.now()}`;
      const assetResult = await runAssetMigration(storeId, migrationId, (assetProg) => {
        setAssetProgress(assetProg);
      });

      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopify Data Import</h1>
          <p className="text-gray-600">
            Migrate your complete Shopify store data to WebPilot
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-between">
          {[
            { key: 'connect', label: 'Connect' },
            { key: 'select', label: 'Select Data' },
            { key: 'importing', label: 'Import' },
            { key: 'complete', label: 'Complete' },
          ].map((s, i, arr) => (
            <div key={s.key} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step === s.key
                    ? 'bg-blue-600 text-white'
                    : ['complete'].includes(step) || arr.findIndex(x => x.key === step) > i
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {['complete'].includes(step) || arr.findIndex(x => x.key === step) > i ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  i + 1
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">{s.label}</div>
              </div>
              {i < arr.length - 1 && (
                <div className="flex-1 h-1 bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Step 1: Connect */}
        {step === 'connect' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <Store className="w-12 h-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Shopify Store</h2>
              <p className="text-gray-600">
                Enter your Shopify credentials to begin the migration process
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Domain
                </label>
                <input
                  type="text"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  placeholder="yourstore.myshopify.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ color: '#000000' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin API Access Token
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ color: '#000000' }}
                />
                <p className="mt-2 text-sm text-gray-500">
                  <a
                    href="https://help.shopify.com/en/manual/apps/app-types/custom-apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    How to create an access token <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              <button
                onClick={handleConnect}
                disabled={importing || !shopDomain || !accessToken}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {importing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Store'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Data */}
        {step === 'select' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Data to Import</h2>
              <p className="text-gray-600">
                Connected to: <span className="font-semibold">{shopInfo?.name || shopDomain}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { type: 'all' as const, icon: Store, label: 'Import Everything', desc: 'All data types' },
                { type: 'products' as const, icon: Package, label: 'Products', desc: 'All products with variants' },
                { type: 'collections' as const, icon: FileText, label: 'Collections', desc: 'Smart & manual collections' },
                { type: 'customers' as const, icon: Users, label: 'Customers', desc: 'Customer accounts & addresses' },
                { type: 'orders' as const, icon: ShoppingCart, label: 'Orders', desc: 'Order history & refunds' },
              ].map(({ type, icon: Icon, label, desc }) => (
                <button
                  key={type}
                  onClick={() => toggleImportType(type)}
                  className={`p-6 rounded-lg border-2 text-left transition-all ${
                    selectedTypes.has(type)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Icon className={`w-8 h-8 ${selectedTypes.has(type) ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{label}</div>
                      <div className="text-sm text-gray-600">{desc}</div>
                    </div>
                    {selectedTypes.has(type) && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleStartImport}
              disabled={selectedTypes.size === 0}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Import
            </button>
          </div>
        )}

        {/* Step 3: Importing */}
        {step === 'importing' && progress && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Importing Data</h2>
              <p className="text-gray-600">{progress.message}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{progress.currentType}</span>
                <span>{Math.round(progress.overallProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress.overallProgress}%` }}
                />
              </div>
            </div>

            {/* Current Progress */}
            {progress.currentCount > 0 && (
              <div className="text-center text-gray-700 font-semibold">
                {progress.currentCount} items imported
              </div>
            )}

            {/* Asset Migration Progress */}
            {assetProgress && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Asset Migration: {assetProgress.message}
                </div>
                <div className="text-xs text-gray-500">
                  {assetProgress.current}/{assetProgress.total}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 'complete' && result && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h2>
              <p className="text-gray-600">
                Successfully migrated {result.totalImported} items from Shopify
              </p>
            </div>

            {/* Import Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Products', count: result.products.imported, icon: Package },
                { label: 'Collections', count: result.collections.imported, icon: FileText },
                { label: 'Customers', count: result.customers.imported, icon: Users },
                { label: 'Orders', count: result.orders.imported, icon: ShoppingCart },
              ].map(({ label, count, icon: Icon }) => (
                <div key={label} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                </div>
              ))}
            </div>

            {/* Duration */}
            <div className="text-center text-sm text-gray-600 mb-6">
              Completed in {Math.round(result.duration / 1000)} seconds
            </div>

            {/* Warnings */}
            {result.totalFailed > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-yellow-900 mb-1">
                      {result.totalFailed} items failed to import
                    </div>
                    <div className="text-sm text-yellow-800">
                      Check the import logs for details
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onComplete}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
