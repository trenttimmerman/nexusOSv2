import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Order } from '../types';
import { Package, Clock, CheckCircle, XCircle, Search, Filter, ChevronDown, Eye } from 'lucide-react';

interface OrderManagerProps {
  storeId: string | null;
}

export const OrderManager: React.FC<OrderManagerProps> = ({ storeId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isFulfillModalOpen, setIsFulfillModalOpen] = useState(false);
  const [fulfillmentData, setFulfillmentData] = useState({
    trackingNumber: '',
    carrier: 'Canada Post',
    notifyCustomer: true
  });

  useEffect(() => {
    fetchOrders();
  }, [storeId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          customer:customers(email, first_name, last_name),
          items:order_items(
            *,
            product:products(name, image)
          )
        `)
        .order('created_at', { ascending: false });

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFulfillOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      const updates = {
        status: 'fulfilled',
        tracking_number: fulfillmentData.trackingNumber,
        carrier: fulfillmentData.carrier,
        shipped_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Optimistic update
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, ...updates } : o));
      setSelectedOrder({ ...selectedOrder, ...updates });
      setIsFulfillModalOpen(false);
      
      // TODO: Trigger email notification if notifyCustomer is true
      if (fulfillmentData.notifyCustomer) {
          await supabase.functions.invoke('send-shipping-update', {
              body: { order_id: selectedOrder.id }
          });
      }

    } catch (error) {
      console.error('Error fulfilling order:', error);
      alert('Failed to fulfill order');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (newStatus === 'fulfilled') {
        setIsFulfillModalOpen(true);
        return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order as any).customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'fulfilled': return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-900/30 text-red-400 border-red-500/30';
      default: return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Order Management</h2>
          <p className="text-neutral-500">Track and fulfill customer orders</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchOrders} className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
            <Clock size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer Email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none"
          />
        </div>
        <div className="relative">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-neutral-900 border border-neutral-800 rounded-xl pl-4 pr-10 py-3 text-white focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex">
        {/* Order List */}
        <div className={`${selectedOrder ? 'w-1/2 border-r border-neutral-800' : 'w-full'} flex flex-col`}>
          <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 font-bold text-xs text-neutral-500 uppercase flex justify-between">
            <span>Order Details</span>
            <span>Total</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-neutral-500">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">No orders found matching your criteria.</div>
            ) : (
              filteredOrders.map(order => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 border-b border-neutral-800 cursor-pointer transition-colors hover:bg-white/5 ${selectedOrder?.id === order.id ? 'bg-blue-900/10 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-mono text-xs text-neutral-400 mb-1">#{order.id.slice(0, 8)}</div>
                      <div className="font-bold text-white">{(order as any).customer?.email || 'Guest Customer'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">${order.total_amount.toFixed(2)}</div>
                      <div className="text-xs text-neutral-500">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${order.payment_status === 'paid' ? 'bg-green-900/30 text-green-400 border-green-500/30' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Detail View */}
        {selectedOrder && (
          <div className="w-1/2 flex flex-col bg-neutral-900/50 animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Order #{selectedOrder.id.slice(0, 8)}</h3>
                <p className="text-sm text-neutral-400">Placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-500 hover:text-white"><XCircle size={24} /></button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-8">
              {/* Status Actions */}
              <div className="bg-black/30 rounded-xl p-4 border border-neutral-800">
                <label className="text-xs font-bold text-neutral-500 uppercase block mb-3">Update Status</label>
                <div className="flex gap-2">
                  {['pending', 'paid', 'fulfilled', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${selectedOrder.status === status ? getStatusColor(status) : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Package size={16} /> Customer</h4>
                <div className="bg-neutral-800/50 rounded-lg p-4 text-sm space-y-1">
                  <div className="text-white font-medium">{(selectedOrder as any).customer?.first_name} {(selectedOrder as any).customer?.last_name}</div>
                  <div className="text-neutral-400">{(selectedOrder as any).customer?.email}</div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Package size={16} /> Items</h4>
                <div className="space-y-2">
                  {(selectedOrder as any).items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center bg-neutral-800/50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.product?.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded object-cover bg-neutral-700" />
                        )}
                        <div>
                          <div className="text-white text-sm font-medium">{item.product?.name || 'Unknown Product'}</div>
                          {item.variant_title && <div className="text-neutral-500 text-xs">{item.variant_title}</div>}
                          <div className="text-neutral-500 text-xs">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-white font-mono">${item.price_at_purchase?.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-neutral-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Subtotal</span>
                  <span>${selectedOrder.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2">
                  <span>Total</span>
                  <span>${selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Fulfillment Details */}
              {selectedOrder.status === 'fulfilled' && selectedOrder.tracking_number && (
                  <div className="bg-green-900/20 border border-green-900/50 rounded-xl p-4 mt-4">
                      <h4 className="text-green-500 font-bold text-sm mb-2 flex items-center gap-2"><CheckCircle size={16}/> Fulfilled</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                              <div className="text-neutral-500 text-xs uppercase font-bold">Carrier</div>
                              <div className="text-white">{selectedOrder.carrier}</div>
                          </div>
                          <div>
                              <div className="text-neutral-500 text-xs uppercase font-bold">Tracking #</div>
                              <div className="text-white font-mono">{selectedOrder.tracking_number}</div>
                          </div>
                          <div className="col-span-2">
                              <div className="text-neutral-500 text-xs uppercase font-bold">Shipped At</div>
                              <div className="text-white">{selectedOrder.shipped_at ? new Date(selectedOrder.shipped_at).toLocaleString() : '-'}</div>
                          </div>
                      </div>
                  </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fulfillment Modal */}
      {isFulfillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Fulfill Order</h3>
                    <button onClick={() => setIsFulfillModalOpen(false)} className="text-neutral-500 hover:text-white"><XCircle size={24}/></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Carrier</label>
                        <select 
                            value={fulfillmentData.carrier}
                            onChange={(e) => setFulfillmentData({ ...fulfillmentData, carrier: e.target.value })}
                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none appearance-none"
                        >
                            <option value="Canada Post">Canada Post</option>
                            <option value="UPS">UPS</option>
                            <option value="FedEx">FedEx</option>
                            <option value="DHL">DHL</option>
                            <option value="Purolator">Purolator</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Tracking Number</label>
                        <input 
                            value={fulfillmentData.trackingNumber}
                            onChange={(e) => setFulfillmentData({ ...fulfillmentData, trackingNumber: e.target.value })}
                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white font-mono focus:border-blue-500 outline-none"
                            placeholder="e.g. 1Z999AA10123456784"
                        />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-black rounded-lg border border-neutral-800">
                        <input 
                            type="checkbox"
                            checked={fulfillmentData.notifyCustomer}
                            onChange={(e) => setFulfillmentData({ ...fulfillmentData, notifyCustomer: e.target.checked })}
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm text-white font-medium">Send shipping update email</label>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={() => setIsFulfillModalOpen(false)}
                        className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleFulfillOrder}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
                    >
                        Mark Fulfilled
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
