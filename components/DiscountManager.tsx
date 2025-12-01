import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Discount } from '../types';
import { Plus, Trash2, Tag, Calendar, DollarSign, Percent, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface DiscountManagerProps {
  storeId: string | null;
}

export const DiscountManager: React.FC<DiscountManagerProps> = ({ storeId }) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(10);
  const [minOrder, setMinOrder] = useState(0);
  const [usageLimit, setUsageLimit] = useState<number | ''>('');
  const [endsAt, setEndsAt] = useState('');

  useEffect(() => {
    if (storeId) {
      fetchDiscounts();
    }
  }, [storeId]);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscounts(data || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!storeId || !code) return;

    try {
      const { data, error } = await supabase
        .from('discounts')
        .insert({
          store_id: storeId,
          code: code.toUpperCase(),
          type,
          value,
          min_order_amount: minOrder,
          usage_limit: usageLimit === '' ? null : Number(usageLimit),
          ends_at: endsAt || null
        })
        .select()
        .single();

      if (error) throw error;

      setDiscounts([data, ...discounts]);
      setIsCreating(false);
      resetForm();
    } catch (error: any) {
      alert('Error creating discount: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;

    try {
      const { error } = await supabase
        .from('discounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDiscounts(discounts.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  const resetForm = () => {
    setCode('');
    setType('percentage');
    setValue(10);
    setMinOrder(0);
    setUsageLimit('');
    setEndsAt('');
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-neutral-500" /></div>;

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Discounts</h2>
          <p className="text-neutral-500">Manage coupon codes and promotions</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)} 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> Create Discount
        </button>
      </div>

      {isCreating && (
        <div className="mb-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-white mb-6">New Discount Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Code</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white font-mono focus:outline-none focus:border-blue-600"
                  placeholder="SUMMER2025"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Type</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setType('percentage')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border ${type === 'percentage' ? 'bg-blue-600/20 border-blue-600 text-blue-500' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}
                >
                  <Percent size={16} /> Percentage
                </button>
                <button 
                  onClick={() => setType('fixed')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border ${type === 'fixed' ? 'bg-green-600/20 border-green-600 text-green-500' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}
                >
                  <DollarSign size={16} /> Fixed Amount
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Value</label>
              <input 
                type="number" 
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Min Order Amount</label>
              <input 
                type="number" 
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Usage Limit (Optional)</label>
              <input 
                type="number" 
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-600"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Ends At (Optional)</label>
              <input 
                type="datetime-local" 
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={() => setIsCreating(false)} className="px-6 py-3 text-neutral-400 hover:text-white font-bold">Cancel</button>
            <button onClick={handleCreate} className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200">Create Code</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {discounts.map(discount => (
          <div key={discount.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-center justify-between group hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-white font-bold">
                {discount.type === 'percentage' ? '%' : '$'}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-white font-mono tracking-wider">{discount.code}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${discount.is_active ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>
                    {discount.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-sm text-neutral-400 flex items-center gap-4">
                  <span>{discount.type === 'percentage' ? `${discount.value}% off` : `$${discount.value} off`}</span>
                  <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                  <span>{discount.usage_count} uses</span>
                  {discount.usage_limit && (
                    <>
                      <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                      <span>Limit: {discount.usage_limit}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(discount.id)}
              className="p-3 text-neutral-600 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {discounts.length === 0 && !isCreating && (
          <div className="text-center py-24 text-neutral-500">
            <Tag size={48} className="mx-auto mb-4 opacity-20" />
            <p>No discount codes active.</p>
          </div>
        )}
      </div>
    </div>
  );
};
