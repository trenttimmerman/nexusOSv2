import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Store,
  Mail,
  Calendar,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  UserCog,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  TrendingUp,
  Clock,
  AlertTriangle,
  Crown,
  Zap,
  Building2,
  Activity
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Client {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  settings?: any;
  owner?: {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
    created_at?: string;
  };
  subscription?: {
    plan_id: string;
    status: string;
    current_period_end: string;
    current_period_start?: string;
    cancel_at_period_end?: boolean;
  };
  stats?: {
    products: number;
    orders: number;
    revenue: number;
    customers: number;
  };
  storeConfig?: {
    name?: string;
    currency?: string;
    store_address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
    notification_settings?: {
      email?: string;
      phone?: string;
    };
    shipping_provider?: string;
    tax_regions?: any[];
  };
}

interface ClientFilters {
  search: string;
  status: 'all' | 'active' | 'trialing' | 'suspended' | 'canceled';
  plan: 'all' | 'free' | 'starter' | 'pro' | 'enterprise';
  sortBy: 'created' | 'name' | 'revenue' | 'orders';
  sortOrder: 'asc' | 'desc';
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ClientManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'users'>('tenants');
  const [clients, setClients] = useState<Client[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    status: 'all',
    plan: 'all',
    sortBy: 'created',
    sortOrder: 'desc'
  });

  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    trialingClients: 0,
    totalRevenue: 0,
    totalOrders: 0
  });

  // Load clients
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      // Get all stores with their owners
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (storesError) throw storesError;

      // Get all profiles to map owners
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*');

      // Get all subscriptions
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*');

      // Get store configs
      const { data: storeConfigs } = await supabase
        .from('store_config')
        .select('*');

      // Get products count per store
      const { data: products } = await supabase
        .from('products')
        .select('store_id');

      // Get orders per store
      const { data: orders } = await supabase
        .from('orders')
        .select('store_id, total');

      // Get customers per store
      const { data: customers } = await supabase
        .from('customers')
        .select('store_id');

      // Get auth user details for owners
      const { data: { users } } = await supabase.auth.admin.listUsers();

      // Build client objects
      const clientsData: Client[] = (stores || []).map(store => {
        // Find owner profile - any profile with this store_id and owner role
        const ownerProfile = profiles?.find(p => p.store_id === store.id && (p.role === 'owner' || p.role === 'admin' || p.role === 'superuser'));
        
        // Find auth user for owner
        const authUser = ownerProfile ? users?.find(u => u.id === ownerProfile.id) : undefined;
        
        // Find subscription
        const subscription = subscriptions?.find(s => s.store_id === store.id);
        
        // Find store config
        const storeConfig = storeConfigs?.find(c => c.store_id === store.id);
        
        // Calculate stats
        const storeProducts = products?.filter(p => p.store_id === store.id) || [];
        const storeOrders = orders?.filter(o => o.store_id === store.id) || [];
        const storeCustomers = customers?.filter(c => c.store_id === store.id) || [];
        const totalRevenue = storeOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        return {
          id: store.id,
          name: store.name,
          slug: store.slug,
          created_at: store.created_at,
          settings: store.settings,
          owner: ownerProfile && authUser ? {
            id: ownerProfile.id,
            email: authUser.email || 'N/A',
            full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name,
            phone: authUser.user_metadata?.phone || authUser.phone,
            created_at: authUser.created_at
          } : undefined,
          subscription: subscription ? {
            plan_id: subscription.plan_id,
            status: subscription.status,
            current_period_end: subscription.current_period_end,
            current_period_start: subscription.current_period_start,
            cancel_at_period_end: subscription.cancel_at_period_end
          } : undefined,
          stats: {
            products: storeProducts.length,
            orders: storeOrders.length,
            revenue: totalRevenue,
            customers: storeCustomers.length
          },
          storeConfig: storeConfig ? {
            name: storeConfig.name,
            currency: storeConfig.currency,
            store_address: storeConfig.store_address,
            notification_settings: storeConfig.notification_settings,
            shipping_provider: storeConfig.shipping_provider,
            tax_regions: storeConfig.tax_regions
          } : undefined
        };
      });

      setClients(clientsData);

      // Calculate totals
      const activeCount = clientsData.filter(c => c.subscription?.status === 'active').length;
      const trialingCount = clientsData.filter(c => c.subscription?.status === 'trialing').length;
      const totalRev = clientsData.reduce((sum, c) => sum + (c.stats?.revenue || 0), 0);
      const totalOrd = clientsData.reduce((sum, c) => sum + (c.stats?.orders || 0), 0);

      setStats({
        totalClients: clientsData.length,
        activeClients: activeCount,
        trialingClients: trialingCount,
        totalRevenue: totalRev,
        totalOrders: totalOrd
      });

    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users from Supabase Auth
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      console.log('[ClientManagement] Fetching users via API...');
      const response = await fetch('/api/admin/list-users');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }
      
      const { users } = await response.json();
      console.log('[ClientManagement] Successfully fetched users:', users?.length || 0);
      setAllUsers(users || []);
    } catch (error: any) {
      console.error('[ClientManagement] Error fetching users:', error);
      alert(`Failed to fetch users: ${error.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  // Delete user from Supabase Auth
  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setActionLoading(userId);
    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      
      // Refresh user list
      await fetchAllUsers();
      
      alert('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(`Failed to delete user: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesName = client.name.toLowerCase().includes(search);
        const matchesEmail = client.owner?.email.toLowerCase().includes(search);
        const matchesSlug = client.slug.toLowerCase().includes(search);
        if (!matchesName && !matchesEmail && !matchesSlug) return false;
      }
      
      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'suspended') {
          if (client.subscription?.status !== 'canceled') return false;
        } else if (client.subscription?.status !== filters.status) {
          return false;
        }
      }
      
      // Plan filter
      if (filters.plan !== 'all' && client.subscription?.plan_id !== filters.plan) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'revenue':
          comparison = (a.stats?.revenue || 0) - (b.stats?.revenue || 0);
          break;
        case 'orders':
          comparison = (a.stats?.orders || 0) - (b.stats?.orders || 0);
          break;
        case 'created':
        default:
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

  // Actions
  const handleSuspendClient = async (clientId: string) => {
    setActionLoading(clientId);
    try {
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('store_id', clientId);
      await loadClients();
    } catch (error) {
      console.error('Error suspending client:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivateClient = async (clientId: string) => {
    setActionLoading(clientId);
    try {
      await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('store_id', clientId);
      await loadClients();
    } catch (error) {
      console.error('Error activating client:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }
    
    setActionLoading(clientId);
    try {
      // Delete in order: subscriptions, store_config, profiles, products, pages, orders, customers, then store
      await supabase.from('subscriptions').delete().eq('store_id', clientId);
      await supabase.from('store_config').delete().eq('store_id', clientId);
      await supabase.from('products').delete().eq('store_id', clientId);
      await supabase.from('pages').delete().eq('store_id', clientId);
      await supabase.from('orders').delete().eq('store_id', clientId);
      await supabase.from('customers').delete().eq('store_id', clientId);
      await supabase.from('profiles').delete().eq('store_id', clientId);
      await supabase.from('stores').delete().eq('id', clientId);
      
      await loadClients();
      setShowClientModal(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client. Check console for details.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleImpersonate = (client: Client) => {
    // Open client's admin in new tab
    window.open(`/admin?store=${client.id}`, '_blank');
  };

  const handleViewStorefront = (client: Client) => {
    window.open(`/s/${client.slug}`, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Active</span>;
      case 'trialing':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Trial</span>;
      case 'canceled':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Suspended</span>;
      case 'past_due':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Past Due</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Unknown</span>;
    }
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'enterprise':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full flex items-center gap-1"><Crown size={12} /> Enterprise</span>;
      case 'pro':
        return <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-1"><Zap size={12} /> Pro</span>;
      case 'starter':
        return <span className="px-2 py-1 text-xs font-medium bg-cyan-100 text-cyan-700 rounded-full">Starter</span>;
      case 'free':
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Free</span>;
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            Platform Admin
          </h1>
          <p className="text-gray-500 mt-1">Manage all stores, clients, and users on the platform</p>
        </div>
        <button
          onClick={activeTab === 'tenants' ? loadClients : fetchAllUsers}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'tenants'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Store size={18} />
              Tenants ({clients.length})
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('users');
              if (allUsers.length === 0) fetchAllUsers();
            }}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              All Users ({allUsers.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Stats Cards - Only show on Tenants tab */}
      {activeTab === 'tenants' && (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeClients}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Trialing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.trialingClients}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Filters - Only show on Tenants tab */}
      {activeTab === 'tenants' && (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or slug..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Plan Filter */}
          <select
            value={filters.plan}
            onChange={(e) => setFilters({ ...filters, plan: e.target.value as any })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>

          {/* Sort */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({ ...filters, sortBy: sortBy as any, sortOrder: sortOrder as any });
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="revenue-desc">Highest Revenue</option>
            <option value="orders-desc">Most Orders</option>
          </select>
        </div>
      </div>
      )}

      {/* Tenants List */}
      {activeTab === 'tenants' && (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    No clients found matching your filters
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-500">/s/{client.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {client.owner ? (
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{client.owner.email}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No owner</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {getPlanBadge(client.subscription?.plan_id)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(client.subscription?.status)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{client.stats?.products || 0}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{client.stats?.orders || 0}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(client.stats?.revenue || 0)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500">{formatDate(client.created_at)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewStorefront(client)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Storefront"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setShowClientModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleImpersonate(client)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Impersonate"
                        >
                          <UserCog size={16} />
                        </button>
                        {client.subscription?.status === 'canceled' ? (
                          <button
                            onClick={() => handleActivateClient(client.id)}
                            disabled={actionLoading === client.id}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Activate"
                          >
                            <CheckCircle size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspendClient(client.id)}
                            disabled={actionLoading === client.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Suspend"
                          >
                            <Ban size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* All Users List */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : allUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Sign In</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{user.email}</span>
                          {user.email_confirmed_at && (
                            <CheckCircle size={14} className="text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {user.user_metadata?.full_name || user.user_metadata?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {user.user_metadata?.phone || user.phone || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(user.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {user.id.slice(0, 8)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(user.id)}
                            className="text-gray-400 hover:text-indigo-600"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {actionLoading === user.id ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Client Detail Modal */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedClient.name}</h2>
                  <p className="text-sm text-gray-500">/s/{selectedClient.slug}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowClientModal(false);
                  setSelectedClient(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Package className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedClient.stats?.products || 0}</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <ShoppingCart className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedClient.stats?.orders || 0}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedClient.stats?.revenue || 0)}</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedClient.stats?.customers || 0}</p>
                  <p className="text-xs text-gray-500">Customers</p>
                </div>
              </div>

              {/* Owner Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Owner Information
                </h3>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-medium">{selectedClient.owner?.email || 'N/A'}</span>
                  </div>
                  
                  {selectedClient.owner?.full_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Full Name</span>
                      <span className="text-sm font-medium">{selectedClient.owner.full_name}</span>
                    </div>
                  )}
                  
                  {selectedClient.owner?.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="text-sm font-medium">{selectedClient.owner.phone}</span>
                    </div>
                  )}
                  
                  {selectedClient.owner?.created_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Account Created</span>
                      <span className="text-sm font-medium">{formatDate(selectedClient.owner.created_at)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">User ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-200 px-2 py-1 rounded">{selectedClient.owner?.id.slice(0, 16)}...</code>
                      <button onClick={() => copyToClipboard(selectedClient.owner?.id || '')} className="text-gray-400 hover:text-indigo-600">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Business Details
                </h3>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Store ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-200 px-2 py-1 rounded">{selectedClient.id.slice(0, 16)}...</code>
                      <button onClick={() => copyToClipboard(selectedClient.id)} className="text-gray-400 hover:text-indigo-600">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Business Name</span>
                    <span className="text-sm font-medium">{selectedClient.storeConfig?.name || selectedClient.name}</span>
                  </div>
                  
                  {selectedClient.storeConfig?.currency && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Currency</span>
                      <span className="text-sm font-medium">{selectedClient.storeConfig.currency}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Created</span>
                    <span className="text-sm font-medium">{formatDate(selectedClient.created_at)}</span>
                  </div>
                  
                  {selectedClient.storeConfig?.notification_settings?.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Business Email</span>
                      <span className="text-sm font-medium">{selectedClient.storeConfig.notification_settings.email}</span>
                    </div>
                  )}
                  
                  {selectedClient.storeConfig?.notification_settings?.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Business Phone</span>
                      <span className="text-sm font-medium">{selectedClient.storeConfig.notification_settings.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {selectedClient.storeConfig?.store_address && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Business Address
                  </h3>
                  
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    {selectedClient.storeConfig.store_address.line1 && (
                      <p className="text-sm text-gray-900">{selectedClient.storeConfig.store_address.line1}</p>
                    )}
                    {selectedClient.storeConfig.store_address.line2 && (
                      <p className="text-sm text-gray-900">{selectedClient.storeConfig.store_address.line2}</p>
                    )}
                    {(selectedClient.storeConfig.store_address.city || selectedClient.storeConfig.store_address.state || selectedClient.storeConfig.store_address.postal_code) && (
                      <p className="text-sm text-gray-900">
                        {[selectedClient.storeConfig.store_address.city, selectedClient.storeConfig.store_address.state, selectedClient.storeConfig.store_address.postal_code].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {selectedClient.storeConfig.store_address.country && (
                      <p className="text-sm text-gray-900">{selectedClient.storeConfig.store_address.country}</p>
                    )}
                    {!selectedClient.storeConfig.store_address.line1 && (
                      <p className="text-sm text-gray-400 italic">No address on file</p>
                    )}
                  </div>
                </div>
              )}

              {/* Subscription & Payment */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Subscription & Payment
                </h3>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Plan</span>
                    {getPlanBadge(selectedClient.subscription?.plan_id)}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    {getStatusBadge(selectedClient.subscription?.status)}
                  </div>
                  
                  {selectedClient.subscription?.current_period_start && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Period Start</span>
                      <span className="text-sm font-medium">{formatDate(selectedClient.subscription.current_period_start)}</span>
                    </div>
                  )}
                  
                  {selectedClient.subscription?.current_period_end && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Period End</span>
                      <span className="text-sm font-medium">{formatDate(selectedClient.subscription.current_period_end)}</span>
                    </div>
                  )}
                  
                  {selectedClient.subscription?.cancel_at_period_end !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Auto-Renewal</span>
                      <span className="text-sm font-medium">
                        {selectedClient.subscription.cancel_at_period_end ? (
                          <span className="text-red-600">Cancelled</span>
                        ) : (
                          <span className="text-green-600">Active</span>
                        )}
                      </span>
                    </div>
                  )}
                  
                  {selectedClient.storeConfig?.shipping_provider && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Shipping Provider</span>
                      <span className="text-sm font-medium capitalize">{selectedClient.storeConfig.shipping_provider}</span>
                    </div>
                  )}
                  
                  {selectedClient.storeConfig?.tax_regions && selectedClient.storeConfig.tax_regions.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Tax Regions</span>
                      <span className="text-sm font-medium">{selectedClient.storeConfig.tax_regions.length} configured</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Actions</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleViewStorefront(selectedClient)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors font-medium"
                  >
                    <ExternalLink size={18} />
                    View Storefront
                  </button>
                  
                  <button
                    onClick={() => handleImpersonate(selectedClient)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors font-medium"
                  >
                    <UserCog size={18} />
                    Impersonate
                  </button>
                  
                  {selectedClient.subscription?.status === 'canceled' ? (
                    <button
                      onClick={() => handleActivateClient(selectedClient.id)}
                      disabled={actionLoading === selectedClient.id}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors font-medium disabled:opacity-50"
                    >
                      <CheckCircle size={18} />
                      Activate Client
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspendClient(selectedClient.id)}
                      disabled={actionLoading === selectedClient.id}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-colors font-medium disabled:opacity-50"
                    >
                      <Ban size={18} />
                      Suspend Client
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteClient(selectedClient.id)}
                    disabled={actionLoading === selectedClient.id}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                    Delete Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
