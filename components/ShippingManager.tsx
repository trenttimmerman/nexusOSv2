import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShippingZone, ShippingRate } from '../types';
import { Plus, Trash2, Truck, Globe, Package, DollarSign, Loader2, ChevronRight, ChevronDown } from 'lucide-react';

interface ShippingManagerProps {
  storeId: string | null;
}

export const ShippingManager: React.FC<ShippingManagerProps> = ({ storeId }) => {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [rates, setRates] = useState<Record<string, ShippingRate[]>>({});
  const [loading, setLoading] = useState(true);
  const [isCreatingZone, setIsCreatingZone] = useState(false);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  
  // Zone Form
  const [zoneName, setZoneName] = useState('');
  const [zoneCountries, setZoneCountries] = useState(''); // Comma separated for now

  // Rate Form
  const [isCreatingRate, setIsCreatingRate] = useState<string | null>(null); // zoneId
  const [rateName, setRateName] = useState('');
  const [rateType, setRateType] = useState<'flat' | 'weight' | 'price'>('flat');
  const [rateAmount, setRateAmount] = useState(0);
  const [rateMin, setRateMin] = useState<number | ''>('');
  const [rateMax, setRateMax] = useState<number | ''>('');

  useEffect(() => {
    if (storeId) {
      fetchZones();
    }
  }, [storeId]);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const { data: zonesData, error: zonesError } = await supabase
        .from('shipping_zones')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (zonesError) throw zonesError;
      setZones(zonesData || []);

      // Fetch rates for all zones
      if (zonesData && zonesData.length > 0) {
        const { data: ratesData, error: ratesError } = await supabase
          .from('shipping_rates')
          .select('*')
          .in('zone_id', zonesData.map(z => z.id));
        
        if (ratesError) throw ratesError;
        
        const ratesMap: Record<string, ShippingRate[]> = {};
        ratesData?.forEach(rate => {
          if (!ratesMap[rate.zone_id]) ratesMap[rate.zone_id] = [];
          ratesMap[rate.zone_id].push(rate);
        });
        setRates(ratesMap);
      }
    } catch (error) {
      console.error('Error fetching shipping data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateZone = async () => {
    if (!storeId || !zoneName) return;

    try {
      const countriesArray = zoneCountries.split(',').map(c => c.trim().toUpperCase()).filter(c => c.length > 0);
      
      const { data, error } = await supabase
        .from('shipping_zones')
        .insert({
          store_id: storeId,
          name: zoneName,
          countries: countriesArray
        })
        .select()
        .single();

      if (error) throw error;

      setZones([data, ...zones]);
      setIsCreatingZone(false);
      setZoneName('');
      setZoneCountries('');
    } catch (error: any) {
      alert('Error creating zone: ' + error.message);
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (!confirm('Delete this zone and all its rates?')) return;

    try {
      const { error } = await supabase
        .from('shipping_zones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setZones(zones.filter(z => z.id !== id));
      const newRates = { ...rates };
      delete newRates[id];
      setRates(newRates);
    } catch (error) {
      console.error('Error deleting zone:', error);
    }
  };

  const handleCreateRate = async (zoneId: string) => {
    if (!rateName) return;

    try {
      const { data, error } = await supabase
        .from('shipping_rates')
        .insert({
          zone_id: zoneId,
          name: rateName,
          type: rateType,
          amount: rateAmount,
          min_value: rateMin === '' ? null : Number(rateMin),
          max_value: rateMax === '' ? null : Number(rateMax)
        })
        .select()
        .single();

      if (error) throw error;

      setRates(prev => ({
        ...prev,
        [zoneId]: [...(prev[zoneId] || []), data]
      }));
      setIsCreatingRate(null);
      resetRateForm();
    } catch (error: any) {
      alert('Error creating rate: ' + error.message);
    }
  };

  const handleDeleteRate = async (zoneId: string, rateId: string) => {
    if (!confirm('Delete this rate?')) return;

    try {
      const { error } = await supabase
        .from('shipping_rates')
        .delete()
        .eq('id', rateId);

      if (error) throw error;
      
      setRates(prev => ({
        ...prev,
        [zoneId]: prev[zoneId].filter(r => r.id !== rateId)
      }));
    } catch (error) {
      console.error('Error deleting rate:', error);
    }
  };

  const resetRateForm = () => {
    setRateName('');
    setRateType('flat');
    setRateAmount(0);
    setRateMin('');
    setRateMax('');
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-neutral-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Shipping Zones</h2>
          <p className="text-neutral-400">Manage where you ship and how much it costs.</p>
        </div>
        <button 
          onClick={() => setIsCreatingZone(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} /> New Zone
        </button>
      </div>

      {isCreatingZone && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-white mb-4">Create Shipping Zone</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Zone Name</label>
              <input 
                value={zoneName}
                onChange={e => setZoneName(e.target.value)}
                placeholder="e.g. North America"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Countries (ISO Codes)</label>
              <input 
                value={zoneCountries}
                onChange={e => setZoneCountries(e.target.value)}
                placeholder="e.g. US, CA, MX"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsCreatingZone(false)} className="px-4 py-2 text-neutral-400 hover:text-white">Cancel</button>
            <button onClick={handleCreateZone} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">Create Zone</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {zones.map(zone => (
          <div key={zone.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between bg-neutral-800/30">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}>
                {expandedZone === zone.id ? <ChevronDown size={20} className="text-neutral-500" /> : <ChevronRight size={20} className="text-neutral-500" />}
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Globe size={16} className="text-blue-500" />
                    {zone.name}
                  </h3>
                  <p className="text-xs text-neutral-500">{zone.countries.length > 0 ? zone.countries.join(', ') : 'Rest of World'}</p>
                </div>
              </div>
              <button onClick={() => handleDeleteZone(zone.id)} className="text-neutral-500 hover:text-red-500 p-2">
                <Trash2 size={18} />
              </button>
            </div>

            {expandedZone === zone.id && (
              <div className="p-4 border-t border-neutral-800 bg-neutral-950/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Shipping Rates</h4>
                  <button 
                    onClick={() => setIsCreatingRate(zone.id)}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Rate
                  </button>
                </div>

                {isCreatingRate === zone.id && (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <input 
                        value={rateName}
                        onChange={e => setRateName(e.target.value)}
                        placeholder="Rate Name"
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-sm text-white"
                      />
                      <select 
                        value={rateType}
                        onChange={e => setRateType(e.target.value as any)}
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-sm text-white"
                      >
                        <option value="flat">Flat Rate</option>
                        <option value="weight">Based on Weight</option>
                        <option value="price">Based on Price</option>
                      </select>
                      <input 
                        type="number"
                        value={rateAmount}
                        onChange={e => setRateAmount(Number(e.target.value))}
                        placeholder="Amount"
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-sm text-white"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="number"
                          value={rateMin}
                          onChange={e => setRateMin(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Min"
                          className="w-1/2 bg-neutral-950 border border-neutral-800 rounded p-2 text-sm text-white"
                        />
                        <input 
                          type="number"
                          value={rateMax}
                          onChange={e => setRateMax(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Max"
                          className="w-1/2 bg-neutral-950 border border-neutral-800 rounded p-2 text-sm text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsCreatingRate(null)} className="text-xs text-neutral-500 hover:text-white">Cancel</button>
                      <button onClick={() => handleCreateRate(zone.id)} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded">Save Rate</button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {(rates[zone.id] || []).map(rate => (
                    <div key={rate.id} className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-neutral-800">
                      <div className="flex items-center gap-3">
                        <Truck size={16} className="text-neutral-500" />
                        <div>
                          <div className="font-bold text-white text-sm">{rate.name}</div>
                          <div className="text-xs text-neutral-500">
                            {rate.type === 'flat' && 'Flat Rate'}
                            {rate.type === 'weight' && `Weight: ${rate.min_value || 0} - ${rate.max_value || '∞'} kg`}
                            {rate.type === 'price' && `Price: $${rate.min_value || 0} - $${rate.max_value || '∞'}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-mono text-white">${rate.amount.toFixed(2)}</div>
                        <button onClick={() => handleDeleteRate(zone.id, rate.id)} className="text-neutral-600 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!rates[zone.id] || rates[zone.id].length === 0) && (
                    <div className="text-center py-4 text-neutral-600 text-sm italic">No rates defined for this zone.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {zones.length === 0 && (
          <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 border-dashed rounded-xl">
            <Globe size={48} className="mx-auto text-neutral-700 mb-4" />
            <h3 className="text-lg font-bold text-white">No Shipping Zones</h3>
            <p className="text-neutral-500 mb-4">Create a zone to start selling worldwide.</p>
            <button 
              onClick={() => setIsCreatingZone(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Create First Zone
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
