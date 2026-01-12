import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import OrderImport from './OrderImport';

const Orders: React.FC = () => {
  const [showImport, setShowImport] = useState(false);
  const [storeId, setStoreId] = useState<string>('');

  React.useEffect(() => {
    // Get store_id from the current user's profile
    const fetchStoreId = async () => {
      const { data: { user } } = await (await import('../lib/supabaseClient')).supabase.auth.getUser();
      if (user) {
        const { data: profile } = await (await import('../lib/supabaseClient')).supabase
          .from('profiles')
          .select('store_id')
          .eq('id', user.id)
          .single();
        if (profile) {
          setStoreId(profile.store_id);
        }
      }
    };
    fetchStoreId();
  }, []);

  if (showImport) {
    return (
      <div className="p-6">
        <button
          onClick={() => setShowImport(false)}
          className="mb-4 px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Orders
        </button>
        <OrderImport
          storeId={storeId}
          onComplete={() => setShowImport(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Orders</h2>
        <button
          onClick={() => setShowImport(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload size={18} />
          Import Orders
        </button>
      </div>
      <div className="dash-glass-card rounded-2xl p-6">
        <p className="text-gray-400">Order management interface placeholder.</p>
        <p className="text-gray-500 text-sm mt-2">Click "Import Orders" to add bulk orders from CSV</p>
      </div>
    </div>
  );
};

export default Orders;
