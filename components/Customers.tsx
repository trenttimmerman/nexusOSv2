import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Customer, CustomerContact, CustomerAddress, Order } from '../types';
import { 
  Mail, Phone, Calendar, ShoppingBag, Download, Plus, Search, X, 
  ChevronDown, ChevronUp, Building2, User, MapPin, Edit2, Trash2
} from 'lucide-react';

interface CustomersProps {
  siteId: string;
}

interface CustomerWithStats extends Customer {
  order_count?: number;
  total_spent?: number;
  last_order_date?: string;
  is_subscriber?: boolean;
  contacts?: CustomerContact[];
  addresses?: CustomerAddress[];
}

export default function Customers({ siteId }: CustomersProps) {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'organizations' | 'individuals' | 'subscribers' | 'purchasers'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    client_type: 'individual' as 'organization' | 'individual',
    company_name: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    tax_exempt: false,
    tax_number: '',
    email_marketing: false,
    notes: '',
  });
  const [newContacts, setNewContacts] = useState<Omit<CustomerContact, 'id' | 'customer_id' | 'created_at' | 'updated_at'>[]>([
    { full_name: '', role: 'primary', email: '', phone: '', is_primary: true }
  ]);
  const [newAddresses, setNewAddresses] = useState<Omit<CustomerAddress, 'id' | 'customer_id' | 'created_at' | 'updated_at'>[]>([]);

  useEffect(() => {
    loadCustomers();
  }, [siteId]);

  useEffect(() => {
    applyFilters();
  }, [customers, searchTerm, filterType]);

  async function loadCustomers() {
    try {
      setLoading(true);

      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      // Fetch contacts
      const { data: contacts } = await supabase
        .from('customer_contacts')
        .select('*')
        .in('customer_id', customersData?.map(c => c.id) || []);

      // Fetch addresses
      const { data: addresses } = await supabase
        .from('customer_addresses')
        .select('*')
        .in('customer_id', customersData?.map(c => c.id) || []);

      // Fetch order stats
      const { data: orderStats } = await supabase
        .from('orders')
        .select('customer_id, total_amount, created_at')
        .eq('site_id', siteId)
        .not('customer_id', 'is', null);

      // Fetch email subscriber status
      const { data: subscribers } = await supabase
        .from('email_subscribers')
        .select('customer_id')
        .eq('site_id', siteId)
        .is('unsubscribed_at', null);

      // Group contacts and addresses by customer
      const contactsMap = new Map<string, CustomerContact[]>();
      contacts?.forEach(contact => {
        if (!contactsMap.has(contact.customer_id)) {
          contactsMap.set(contact.customer_id, []);
        }
        contactsMap.get(contact.customer_id)!.push(contact);
      });

      const addressesMap = new Map<string, CustomerAddress[]>();
      addresses?.forEach(address => {
        if (!addressesMap.has(address.customer_id)) {
          addressesMap.set(address.customer_id, []);
        }
        addressesMap.get(address.customer_id)!.push(address);
      });

      // Aggregate stats
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

      const enrichedCustomers: CustomerWithStats[] = (customersData || []).map((customer) => {
        const stats = statsMap.get(customer.id);
        return {
          ...customer,
          order_count: stats?.count || 0,
          total_spent: stats?.total || 0,
          last_order_date: stats?.lastDate,
          is_subscriber: subscriberIds.has(customer.id),
          contacts: contactsMap.get(customer.id) || [],
          addresses: addressesMap.get(customer.id) || [],
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

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.email.toLowerCase().includes(term) ||
          c.first_name?.toLowerCase().includes(term) ||
          c.last_name?.toLowerCase().includes(term) ||
          c.company_name?.toLowerCase().includes(term)
      );
    }

    if (filterType === 'organizations') {
      filtered = filtered.filter((c) => c.client_type === 'organization');
    } else if (filterType === 'individuals') {
      filtered = filtered.filter((c) => c.client_type === 'individual' || !c.client_type);
    } else if (filterType === 'subscribers') {
      filtered = filtered.filter((c) => c.is_subscriber);
    } else if (filterType === 'purchasers') {
      filtered = filtered.filter((c) => (c.order_count || 0) > 0);
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
      // Insert customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          site_id: siteId,
          ...newCustomer,
          created_via: 'manual',
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Insert contacts
      if (newContacts.length > 0 && newContacts[0].full_name) {
        const contactsToInsert = newContacts
          .filter(c => c.full_name.trim())
          .map(contact => ({
            ...contact,
            customer_id: customer.id,
          }));

        if (contactsToInsert.length > 0) {
          const { error: contactsError } = await supabase
            .from('customer_contacts')
            .insert(contactsToInsert);

          if (contactsError) throw contactsError;
        }
      }

      // Insert addresses
      if (newAddresses.length > 0) {
        const addressesToInsert = newAddresses
          .filter(a => a.address_line1.trim())
          .map(address => ({
            ...address,
            customer_id: customer.id,
          }));

        if (addressesToInsert.length > 0) {
          const { error: addressesError } = await supabase
            .from('customer_addresses')
            .insert(addressesToInsert);

          if (addressesError) throw addressesError;
        }
      }

      alert('Customer added successfully!');
      resetForm();
      loadCustomers();
    } catch (error: any) {
      alert('Error adding customer: ' + error.message);
    }
  }

  function resetForm() {
    setShowAddModal(false);
    setNewCustomer({
      client_type: 'individual',
      company_name: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      tax_exempt: false,
      tax_number: '',
      email_marketing: false,
      notes: '',
    });
    setNewContacts([{ full_name: '', role: 'primary', email: '', phone: '', is_primary: true }]);
    setNewAddresses([]);
  }

  function addContact() {
    setNewContacts([...newContacts, { full_name: '', role: '', email: '', phone: '', is_primary: false }]);
  }

  function removeContact(index: number) {
    setNewContacts(newContacts.filter((_, i) => i !== index));
  }

  function updateContact(index: number, field: string, value: any) {
    const updated = [...newContacts];
    updated[index] = { ...updated[index], [field]: value };
    setNewContacts(updated);
  }

  function addAddress() {
    setNewAddresses([...newAddresses, {
      address_type: 'both',
      label: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state_province: '',
      postal_code: '',
      country: 'CA',
      is_default: newAddresses.length === 0,
    }]);
  }

  function removeAddress(index: number) {
    setNewAddresses(newAddresses.filter((_, i) => i !== index));
  }

  function updateAddress(index: number, field: string, value: any) {
    const updated = [...newAddresses];
    updated[index] = { ...updated[index], [field]: value };
    setNewAddresses(updated);
  }

  function exportToCSV() {
    const headers = [
      'Type',
      'Company/Name',
      'Email',
      'Phone',
      'Orders',
      'Total Spent',
      'Tax Exempt',
      'Tax Number',
      'Email Subscriber',
      'Created',
    ];

    const rows = filteredCustomers.map((c) => [
      c.client_type === 'organization' ? 'Organization' : 'Individual',
      c.client_type === 'organization' ? c.company_name : `${c.first_name || ''} ${c.last_name || ''}`.trim(),
      c.email,
      c.phone || '',
      c.order_count || 0,
      `$${(c.total_spent || 0).toFixed(2)}`,
      c.tax_exempt ? 'Yes' : 'No',
      c.tax_number || '',
      c.is_subscriber ? 'Yes' : 'No',
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
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'organizations', label: 'Organizations' },
            { value: 'individuals', label: 'Individuals' },
            { value: 'subscribers', label: 'Subscribers' },
            { value: 'purchasers', label: 'Purchasers' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Orders</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Spent</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <React.Fragment key={customer.id}>
                  <tr 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleCustomerDetails(customer.id)}
                  >
                    <td className="px-4 py-3">
                      {customer.client_type === 'organization' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Building2 size={12} className="mr-1" />
                          Organization
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <User size={12} className="mr-1" />
                          Individual
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {customer.client_type === 'organization'
                            ? customer.company_name
                            : `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        {customer.tax_exempt && (
                          <span className="inline-flex items-center px-1.5 py-0.5 mt-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Tax Exempt
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {customer.phone || customer.contacts?.find(c => c.is_primary)?.phone ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          {customer.phone || customer.contacts?.find(c => c.is_primary)?.phone}
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
                      <div className="flex gap-1 flex-wrap">
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
                    <td className="px-4 py-3">
                      {selectedCustomer === customer.id ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Details */}
                  {selectedCustomer === customer.id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-3 gap-6">
                          {/* Column 1: Customer Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              {customer.client_type === 'organization' ? <Building2 size={16} /> : <User size={16} />}
                              Customer Info
                            </h4>
                            <div className="space-y-2 text-sm">
                              {customer.client_type === 'organization' && customer.company_name && (
                                <div><span className="text-gray-500">Company:</span> {customer.company_name}</div>
                              )}
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" />
                                {customer.email}
                              </div>
                              {customer.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone size={14} className="text-gray-400" />
                                  {customer.phone}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" />
                                Joined {new Date(customer.created_at).toLocaleDateString()}
                              </div>
                              {customer.tax_number && (
                                <div className="text-xs">
                                  <span className="text-gray-500">Tax ID:</span> {customer.tax_number}
                                </div>
                              )}
                              {customer.notes && (
                                <div className="mt-2 p-2 bg-white rounded border border-gray-200 text-xs text-gray-600">
                                  {customer.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Column 2: Contacts & Addresses */}
                          <div>
                            {customer.contacts && customer.contacts.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Contacts</h4>
                                <div className="space-y-2">
                                  {customer.contacts.map((contact) => (
                                    <div key={contact.id} className="p-2 bg-white rounded border border-gray-200 text-sm">
                                      <div className="font-medium">{contact.full_name}</div>
                                      {contact.role && (
                                        <div className="text-xs text-gray-500 capitalize">{contact.role}</div>
                                      )}
                                      {contact.email && <div className="text-xs text-gray-600">{contact.email}</div>}
                                      {contact.phone && <div className="text-xs text-gray-600">{contact.phone}</div>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {customer.addresses && customer.addresses.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  <MapPin size={16} />
                                  Addresses
                                </h4>
                                <div className="space-y-2">
                                  {customer.addresses.map((address) => (
                                    <div key={address.id} className="p-2 bg-white rounded border border-gray-200 text-sm">
                                      {address.label && (
                                        <div className="font-medium text-xs text-gray-700 mb-1">{address.label}</div>
                                      )}
                                      <div className="text-xs text-gray-600">
                                        {address.address_line1}
                                        {address.address_line2 && <>, {address.address_line2}</>}
                                        <br />
                                        {address.city && `${address.city}, `}
                                        {address.state_province} {address.postal_code}
                                        {address.country && address.country !== 'CA' && <>, {address.country}</>}
                                      </div>
                                      {address.address_type && (
                                        <div className="mt-1">
                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                            {address.address_type}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Column 3: Order History */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <ShoppingBag size={16} />
                              Order History ({customerOrders.length})
                            </h4>
                            {customerOrders.length > 0 ? (
                              <div className="space-y-2">
                                {customerOrders.slice(0, 5).map((order) => (
                                  <div
                                    key={order.id}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                  >
                                    <div>
                                      <div className="font-medium text-sm">#{order.id.slice(0, 8)}</div>
                                      <div className="text-xs text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
                                      <div
                                        className={`text-xs capitalize ${
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
                            ) : (
                              <div className="text-sm text-gray-500">No orders yet</div>
                            )}
                          </div>
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
      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add New Customer</h3>
                <p className="text-sm text-gray-500">Fill in the details below to add a new customer to your records</p>
              </div>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={newCustomer.client_type === 'organization'}
                      onChange={() => setNewCustomer({ ...newCustomer, client_type: 'organization' })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Organization</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={newCustomer.client_type === 'individual'}
                      onChange={() => setNewCustomer({ ...newCustomer, client_type: 'individual' })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Consumer / Individual</span>
                  </label>
                </div>
              </div>

              {/* Company Name (for organizations) */}
              {newCustomer.client_type === 'organization' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCustomer.company_name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, company_name: e.target.value })}
                    placeholder="e.g., Sunrise Solutions Inc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Individual Name (for individuals) */}
              {newCustomer.client_type === 'individual' && (
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
              )}

              {/* Primary Email */}
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

              {/* Primary Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tax Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-gray-900">Tax Information</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-gray-900">Tax Exempt</div>
                    <div className="text-xs text-gray-500">Is this {newCustomer.client_type === 'organization' ? 'organization' : 'customer'} exempt from sales tax?</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCustomer.tax_exempt}
                      onChange={(e) => setNewCustomer({ ...newCustomer, tax_exempt: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={newCustomer.tax_number}
                    onChange={(e) => setNewCustomer({ ...newCustomer, tax_number: e.target.value })}
                    placeholder="Enter GST number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Contacts</h4>
                  <button
                    onClick={addContact}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Contact
                  </button>
                </div>
                {newContacts.map((contact, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Contact {index + 1}</span>
                      {newContacts.length > 1 && (
                        <button
                          onClick={() => removeContact(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={contact.full_name}
                          onChange={(e) => updateContact(index, 'full_name', e.target.value)}
                          placeholder="e.g., Jane Smith"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                        <select
                          value={contact.role || ''}
                          onChange={(e) => updateContact(index, 'role', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="primary">Primary</option>
                          <option value="billing">Billing</option>
                          <option value="shipping">Shipping</option>
                          <option value="technical">Technical</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={contact.email || ''}
                          onChange={(e) => updateContact(index, 'email', e.target.value)}
                          placeholder="contact-email@company.com"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone (Optional)</label>
                        <input
                          type="tel"
                          value={contact.phone || ''}
                          onChange={(e) => updateContact(index, 'phone', e.target.value)}
                          placeholder="e.g., 234 567 8901"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Addresses */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Addresses</h4>
                  <button
                    onClick={addAddress}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Address
                  </button>
                </div>
                {newAddresses.map((address, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Address {index + 1}</span>
                      <button
                        onClick={() => removeAddress(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                        <input
                          type="text"
                          value={address.label || ''}
                          onChange={(e) => updateAddress(index, 'label', e.target.value)}
                          placeholder="e.g., Headquarters"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={address.address_type || 'both'}
                          onChange={(e) => updateAddress(index, 'address_type', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="both">Both</option>
                          <option value="billing">Billing</option>
                          <option value="shipping">Shipping</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 1</label>
                        <input
                          type="text"
                          value={address.address_line1}
                          onChange={(e) => updateAddress(index, 'address_line1', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input
                          type="text"
                          value={address.address_line2 || ''}
                          onChange={(e) => updateAddress(index, 'address_line2', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={address.city || ''}
                          onChange={(e) => updateAddress(index, 'city', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Province</label>
                        <input
                          type="text"
                          value={address.state_province || ''}
                          onChange={(e) => updateAddress(index, 'state_province', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={address.postal_code || ''}
                          onChange={(e) => updateAddress(index, 'postal_code', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={address.country || 'CA'}
                          onChange={(e) => updateAddress(index, 'country', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Email Marketing */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="email_marketing"
                  checked={newCustomer.email_marketing}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email_marketing: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="email_marketing" className="text-sm text-gray-700">
                  Subscribe to email marketing
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any additional notes about this customer..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={resetForm}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={!newCustomer.email || (newCustomer.client_type === 'organization' && !newCustomer.company_name)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
