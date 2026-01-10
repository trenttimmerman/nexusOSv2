import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Customer, Order } from '../types';
import { Mail, Phone, Calendar, ShoppingBag, Download, Plus, Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface CustomersProps {
  siteId: string;
}

interface CustomerWithStats extends Customer {
  order_count?: number;
  total_spent?: number;
  last_order_date?: string;
  is_subscriber?: boolean;
}

export default function Customers({ siteId }: CustomersProps) {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'subscribers' | 'purchasers' | 'accounts'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    email_marketing: false,
  });

  useEffect(() => {
    loadCustomers();
  }, [siteId]);

  useEffect(() => {
    applyFilters();
  }, [customers, searchTerm, filterType]);

  async function loadCustomers() {
    try {
      setLoading(true);

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      // Fetch order stats for each customer
      const { data: orderStats, error: orderError } = await supabase
        .from('orders')
        .select('customer_id, total_amount, created_at')
        .eq('site_id', siteId)
        .not('customer_id', 'is', null);

      if (orderError) throw orderError;

      // Fetch email subscriber status
      const { data: subscribers, error: subError } = await supabase
        .from('email_subscribers')
        .select('customer_id')
        .eq('site_id', siteId)
        .is('unsubscribed_at', null);

      if (subError) throw subError;

      // Aggregate stats by customer
      const statsMap = new Map<string, { count: number; total: number; lastDate: string }>();
      orderStats?.forEach((order) => {
        const existing = statsMap.get(order.customer_id) || { count: 0, total: 0, lastDate: '' };
        existing.count += 1;
        existing.total += parseFloat(order.total_amount || 0);
        if (!existing.lastDate || order.created_at > existing.lastDate) {
          existing.lastDate = order.created_at;
        }
        statsMap.set(order.customer_id, existing);
      });

      const subscriberIds = new Set(subscribers?.map((s) => s.customer_id) || []);

      // Combine data
      const enrichedCustomers: CustomerWithStats[] = (customersData || []).map((customer) => {
        const stats = statsMap.get(customer.id);
        return {
          ...customer,
          order_count: stats?.count || 0,
          total_spent: stats?.total || 0,
          last_order_date: stats?.lastDate,
          is_subscriber: subscriberIds.has(customer.id),
        };
      });

      setCustomers(enrichedCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...customers];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.email.toLowerCase().includes(term) ||
          c.first_name?.toLowerCase().includes(term) ||
          c.last_name?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filterType === 'subscribers') {
      filtered = filtered.filter((c) => c.is_subscriber);
    } else if (filterType === 'purchasers') {
      filtered = filtered.filter((c) => (c.order_count || 0) > 0);
    } else if (filterType === 'accounts') {
      filtered = filtered.filter((c) => c.auth_user_id);
    }

    setFilteredCustomers(filtered);
  }

  async function loadCustomerOrders(customerId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomerOrders(data || []);
    } catch (error) {
      console.error('Error loading customer orders:', error);
    }
  }

  async function handleAddCustomer() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          site_id: siteId,
          ...newCustomer,
          created_via: 'manual',
        })
        .select()
        .single();

      if (error) throw error;

      alert('Customer added successfully!');
      setShowAddModal(false);
      setNewCustomer({ email: '', first_name: '', last_name: '', phone: '', email_marketing: false });
      loadCustomers();
    } catch (error: any) {
      alert('Error adding customer: ' + error.message);
    }
  }

  function exportToCSV() {
    const headers = [
      'Email',
      'First Name',
      'Last Name',
      'Phone',
      'Orders',
      'Total Spent',
      'Last Order',
      'Email Subscriber',
      'Has Account',
      'Created',
    ];

    const rows = filteredCustomers.map((c) => [
      c.email,
      c.first_name || '',
      c.last_name || '',
      c.phone || '',
      c.order_count || 0,
      `$${(c.total_spent || 0).toFixed(2)}`,
      c.last_order_date ? new Date(c.last_order_date).toLocaleDateString() : '',
      c.is_subscriber ? 'Yes' : 'No',
      c.auth_user_id ? 'Yes' : 'No',
      new Date(c.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleCustomerDetails(customerId: string) {
    if (selectedCustomer === customerId) {
      setSelectedCustomer(null);
      setCustomerOrders([]);
    } else {
      setSelectedCustomer(customerId);
      loadCustomerOrders(customerId);
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center py-12 text-gray-500">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customers</h2>
          <p className="text-gray-600">Total: {filteredCustomers.length} customers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('subscribers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'subscribers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Subscribers
          </button>
          <button
            onClick={() => setFilterType('purchasers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'purchasers'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Purchasers
          </button>
          <button
            onClick={() => setFilterType('accounts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'accounts'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Accounts
          </button>
        </div>
      </div>

      {/* Customer Table */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No customers found{searchTerm || filterType !== 'all' ? ' matching your filters' : ''}.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Orders</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Spent</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <React.Fragment key={customer.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleCustomerDetails(customer.id)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {customer.first_name || customer.last_name
                            ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
                            : 'No name'}
                        </div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {customer.phone ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          {customer.phone}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 font-medium">{customer.order_count || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 font-medium">
                        ${(customer.total_spent || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {customer.is_subscriber && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Mail size={12} className="mr-1" />
                            Subscriber
                          </span>
                        )}
                        {customer.auth_user_id && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Account
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {selectedCustomer === customer.id ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Customer Details */}
                  {selectedCustomer === customer.id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Customer Info</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail size={14} className="text-gray-400" />
                                  <span>{customer.email}</span>
                                </div>
                                {customer.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-gray-400" />
                                    <span>{customer.phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-gray-400" />
                                  <span>Joined {new Date(customer.created_at).toLocaleDateString()}</span>
                                </div>
                                {customer.created_via && (
                                  <div className="text-xs text-gray-500">
                                    Created via: {customer.created_via}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Marketing</h4>
                              <div className="space-y-1 text-sm">
                                <div>
                                  Email Marketing:{' '}
                                  <span
                                    className={
                                      customer.email_marketing ? 'text-green-600' : 'text-gray-500'
                                    }
                                  >
                                    {customer.email_marketing ? 'Subscribed' : 'Not subscribed'}
                                  </span>
                                </div>
                                {customer.is_subscriber && (
                                  <div className="text-green-600">Active email subscriber</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Order History */}
                          {customerOrders.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <ShoppingBag size={16} />
                                Order History ({customerOrders.length})
                              </h4>
                              <div className="space-y-2">
                                {customerOrders.map((order) => (
                                  <div
                                    key={order.id}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                  >
                                    <div>
                                      <div className="font-medium text-sm">
                                        Order #{order.id.slice(0, 8)}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
                                      <div
                                        className={`text-xs ${
                                          order.status === 'fulfilled'
                                            ? 'text-green-600'
                                            : order.status === 'cancelled'
                                            ? 'text-red-600'
                                            : 'text-yellow-600'
                                        }`}
                                      >
                                        {order.status}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Customer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={newCustomer.first_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newCustomer.last_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="email_marketing"
                  checked={newCustomer.email_marketing}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email_marketing: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="email_marketing" className="text-sm text-gray-700">
                  Subscribe to email marketing
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={!newCustomer.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
