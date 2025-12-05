import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Customer } from '../types';
import { 
  Users, Search, Mail, Phone, Calendar, ShoppingBag, 
  ChevronDown, Filter, Download, MoreHorizontal, Eye,
  Loader2, UserPlus, X, Trash2
} from 'lucide-react';

interface CustomersProps {
  storeId: string | null;
}

export const Customers: React.FC<CustomersProps> = ({ storeId }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  });

  useEffect(() => {
    if (storeId) {
      fetchCustomers();
    }
  }, [storeId]);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (data) {
      setCustomers(data);
    }
    setLoading(false);
  };

  const fetchCustomerOrders = async (customerId: string) => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    setCustomerOrders(data || []);
  };

  const handleSelectCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    await fetchCustomerOrders(customer.id);
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;

    const { data, error } = await supabase
      .from('customers')
      .insert({
        store_id: storeId,
        email: newCustomer.email,
        first_name: newCustomer.first_name || null,
        last_name: newCustomer.last_name || null,
        phone: newCustomer.phone || null
      })
      .select()
      .single();

    if (data) {
      setCustomers(prev => [data, ...prev]);
      setShowAddModal(false);
      setNewCustomer({ email: '', first_name: '', last_name: '', phone: '' });
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This cannot be undone.')) return;
    
    await supabase.from('customers').delete().eq('id', customerId);
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(null);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.first_name && c.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.last_name && c.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-neutral-500 text-sm mt-1">{customers.length} total customers</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
          >
            <UserPlus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
          <Filter size={16} />
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto mb-4 text-neutral-600" size={48} />
              <h3 className="text-lg font-bold text-white mb-2">No customers yet</h3>
              <p className="text-neutral-500 text-sm">Customers will appear here when they make their first purchase.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-neutral-800">
                <tr className="text-left text-xs font-bold text-neutral-500 uppercase">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => handleSelectCustomer(customer)}
                    className={`border-b border-neutral-800 hover:bg-neutral-800/50 cursor-pointer transition-colors ${
                      selectedCustomer?.id === customer.id ? 'bg-neutral-800/50' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {(customer.first_name?.[0] || customer.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {customer.first_name || customer.last_name 
                              ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
                              : 'Guest'}
                          </div>
                          {customer.phone && (
                            <div className="text-xs text-neutral-500">{customer.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-400">{customer.email}</td>
                    <td className="p-4 text-neutral-500 text-sm">{formatDate(customer.created_at)}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(customer.id); }}
                        className="p-2 hover:bg-red-900/20 text-neutral-500 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Customer Detail Panel */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          {selectedCustomer ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {(selectedCustomer.first_name?.[0] || selectedCustomer.email[0]).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {selectedCustomer.first_name || selectedCustomer.last_name 
                    ? `${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}`.trim()
                    : 'Guest Customer'}
                </h3>
                <p className="text-neutral-500 text-sm">Customer since {formatDate(selectedCustomer.created_at)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                  <Mail size={18} className="text-neutral-500" />
                  <span className="text-white text-sm">{selectedCustomer.email}</span>
                </div>
                {selectedCustomer.phone && (
                  <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <Phone size={18} className="text-neutral-500" />
                    <span className="text-white text-sm">{selectedCustomer.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-neutral-500 uppercase mb-3">Order History</h4>
                {customerOrders.length === 0 ? (
                  <p className="text-neutral-500 text-sm">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                        <div>
                          <div className="text-sm font-bold text-white">Order #{order.id.slice(0, 8)}</div>
                          <div className="text-xs text-neutral-500">{formatDate(order.created_at)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">${(order.total_amount / 100).toFixed(2)}</div>
                          <div className={`text-xs font-bold ${
                            order.status === 'fulfilled' ? 'text-green-400' :
                            order.status === 'paid' ? 'text-blue-400' :
                            order.status === 'cancelled' ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Eye className="mx-auto mb-4 text-neutral-600" size={48} />
              <h3 className="text-lg font-bold text-white mb-2">Select a Customer</h3>
              <p className="text-neutral-500 text-sm">Click on a customer to view their details and order history.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Customer</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                <X size={20} className="text-neutral-400" />
              </button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="customer@email.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">First Name</label>
                  <input
                    type="text"
                    value={newCustomer.first_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Last Name</label>
                  <input
                    type="text"
                    value={newCustomer.last_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 px-4 text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-neutral-800 text-white font-bold rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
