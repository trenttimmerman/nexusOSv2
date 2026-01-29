import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../context/DataContext';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_status: string;
  items: OrderItem[];
  tracking_number?: string;
  carrier?: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  variant_title?: string;
  product?: {
    name: string;
    image: string;
    slug?: string;
  };
}

export const CustomerProfile: React.FC = () => {
  const { signOut } = useData();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Get Customer Record
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();
        
        setCustomer(customerData);

        if (customerData) {
          // 2. Get Orders
          const { data: ordersData } = await supabase
            .from('orders')
            .select(`
              *,
              items:order_items(
                *,
                product:products(
                  name,
                  image
                )
              )
            `)
            .eq('customer_id', customerData.id)
            .order('created_at', { ascending: false });
            
          if (ordersData) {
            setOrders(ordersData);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Account</h1>
          <p className="text-neutral-600 mt-1">
            Welcome back, {customer?.first_name || 'Customer'}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Order History
          </h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            No orders found. Time to go shopping!
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">
                      Order #{order.id.slice(0, 8)}
                    </div>
                    <div className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      ${order.total_amount.toFixed(2)}
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {order.status === 'fulfilled' && order.tracking_number && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Shipped via {order.carrier}</span>
                    </div>
                    <div className="text-sm font-mono text-green-700">
                      {order.tracking_number}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 text-sm">
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                        {item.product?.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900">
                          {item.product?.name || 'Unknown Product'}
                        </div>
                        {item.variant_title && (
                            <div className="text-xs text-neutral-500">
                                {item.variant_title}
                            </div>
                        )}
                        <div className="text-neutral-500">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">
                        ${item.price_at_purchase.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    fulfilled: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  
  const icons = {
    pending: Clock,
    paid: CheckCircle, // Using CheckCircle for paid as well for now
    fulfilled: CheckCircle,
    cancelled: XCircle,
  };

  const Icon = icons[status as keyof typeof icons] || Clock;
  const style = styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      <Icon className="w-3 h-3" />
      {status && status.length > 0 ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
};
