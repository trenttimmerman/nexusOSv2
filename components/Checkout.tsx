import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, ShoppingBag, Loader2, Tag, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../context/DataContext';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PaymentForm, CreditCard as SquareCreditCard, ApplePay, GooglePay } from 'react-square-web-payments-sdk';
import { Discount, ShippingRate, ShippingZone } from '../types';

// Stripe Form Component
const StripePaymentForm = ({ amount, onProcessPayment, isProcessing }: { amount: number, onProcessPayment: () => void, isProcessing: boolean }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // In a real app, we would create a PaymentIntent on the server here
    // and confirm it with stripe.confirmCardPayment
    // For now, we'll simulate the process and trigger the order creation
    
    // const cardElement = elements.getElement(CardElement);
    
    // Simulate processing delay
    onProcessPayment();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-neutral-200 rounded-lg bg-white">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? <Loader2 className="animate-spin" /> : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export const Checkout: React.FC = () => {
  const { cart: items, cartTotal, clearCart } = useCart();
  const { storeId, config } = useData();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [existingCustomerId, setExistingCustomerId] = useState<string | null>(null);
  
  // Stripe State
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'CA' // Default to Canada
  });

  // Discount & Shipping State
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);
  
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  // Fetch Shipping Rates when Country changes
  useEffect(() => {
    const fetchShippingRates = async () => {
      if (!storeId) return;
      setIsLoadingShipping(true);
      setShippingRates([]);
      setSelectedShippingRate(null);

      try {
        // 1. Find matching zone
        const { data: zones } = await supabase
          .from('shipping_zones')
          .select('*')
          .eq('store_id', storeId);

        if (!zones) return;

        // Find specific country match first, then fallback to "Rest of World" (empty countries array)
        let matchedZone = zones.find(z => z.countries && z.countries.includes(customerDetails.country));
        if (!matchedZone) {
          matchedZone = zones.find(z => !z.countries || z.countries.length === 0);
        }

        if (matchedZone) {
          // 2. Fetch rates for this zone
          const { data: rates } = await supabase
            .from('shipping_rates')
            .select('*')
            .eq('zone_id', matchedZone.id);

          if (rates) {
            // Filter rates based on cart total/weight
            const validRates = rates.filter(rate => {
              if (rate.type === 'price') {
                const min = rate.min_value || 0;
                const max = rate.max_value || Infinity;
                return cartTotal >= min && cartTotal <= max;
              }
              // For weight, we'd need cart weight. Assuming valid for now or skipping if weight-based.
              // Let's include them but maybe we should have a default weight?
              return true; 
            });
            setShippingRates(validRates);
            if (validRates.length > 0) {
              setSelectedShippingRate(validRates[0]); // Default to first option
            }
          }
        }
      } catch (err) {
        console.error('Error fetching shipping rates:', err);
      } finally {
        setIsLoadingShipping(false);
      }
    };

    fetchShippingRates();
  }, [storeId, customerDetails.country, cartTotal]);

  const handleApplyDiscount = async () => {
    if (!discountCode || !storeId) return;
    setIsCheckingDiscount(true);
    setDiscountError(null);

    try {
      const { data, error } = await supabase.rpc('validate_discount', {
        p_code: discountCode.toUpperCase(),
        p_store_id: storeId
      });

      if (error) throw error;

      if (data) {
        // Check minimum order amount
        if (cartTotal < data.min_order_amount) {
          setDiscountError(`Minimum order amount is $${data.min_order_amount}`);
          setAppliedDiscount(null);
        } else {
          setAppliedDiscount(data as Discount);
          setDiscountCode(''); // Clear input on success
        }
      } else {
        setDiscountError('Invalid or expired discount code');
        setAppliedDiscount(null);
      }
    } catch (err: any) {
      console.error('Discount validation error:', err);
      setDiscountError('Failed to validate discount');
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountError(null);
  };

  // Calculate Totals
  const discountAmount = appliedDiscount 
    ? (appliedDiscount.type === 'percentage' 
        ? cartTotal * (appliedDiscount.value / 100) 
        : appliedDiscount.value)
    : 0;
  
  // Ensure discount doesn't exceed total
  const actualDiscount = Math.min(discountAmount, cartTotal);
  const subtotalAfterDiscount = Math.max(0, cartTotal - actualDiscount);
  const shippingCost = selectedShippingRate ? selectedShippingRate.amount : 0;

  // Tax Calculation Logic
  const calculateTaxes = (subtotal: number, country: string, state: string) => {
    if (!config.taxRegions) return { totalTax: 0, breakdown: [] };

    const applicableTaxes = config.taxRegions.filter(region => {
      // Match Country
      if (region.country_code !== country) return false;
      
      // Match Region (Wildcard or Specific)
      if (region.region_code === '*') return true;
      if (region.region_code === state) return true;
      
      return false;
    });

    const breakdown = applicableTaxes.map(tax => ({
      name: tax.name,
      rate: tax.rate,
      amount: subtotal * (tax.rate / 100)
    }));

    const totalTax = breakdown.reduce((sum, tax) => sum + tax.amount, 0);
    
    return { totalTax, breakdown };
  };

  const { totalTax, breakdown: taxBreakdown } = calculateTaxes(subtotalAfterDiscount, customerDetails.country, customerDetails.state);
  const orderTotal = subtotalAfterDiscount + totalTax + shippingCost;

  useEffect(() => {
    if (config.paymentProvider === 'stripe' && config.stripePublishableKey) {
      setStripePromise(loadStripe(config.stripePublishableKey));
    }
  }, [config.paymentProvider, config.stripePublishableKey]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch customer profile linked to this auth user
        const { data: customer } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .maybeSingle(); // Use maybeSingle to avoid error if not found
        
        if (customer) {
          setExistingCustomerId(customer.id);
          setCustomerDetails(prev => ({
            ...prev,
            firstName: customer.first_name || '',
            lastName: customer.last_name || '',
            email: customer.email || session.user.email || '',
          }));
        } else {
            // Pre-fill email from auth if no customer record yet
            setCustomerDetails(prev => ({
                ...prev,
                email: session.user.email || ''
            }));
        }
      }
    };
    checkUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!storeId) {
      alert('Store configuration error: No Store ID found. Please contact support.');
      return;
    }

    if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
        alert('Please fill in all required shipping information.');
        setStep('shipping');
        return;
    }

    setIsProcessing(true);

    try {
      let customerId = existingCustomerId;

      // 1. Create Customer if not exists
      if (!customerId) {
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .insert({
            store_id: storeId,
            auth_user_id: user?.id || null, // Link to auth user if logged in
            email: customerDetails.email,
            first_name: customerDetails.firstName,
            last_name: customerDetails.lastName,
            phone: '' 
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = customer.id;
      }

          // 2. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          store_id: storeId,
          customer_id: customerId,
          total_amount: orderTotal, // Calculated total
          status: 'pending',
          payment_status: 'paid',
          shipping_address_line1: customerDetails.address,
          shipping_city: customerDetails.city,
          shipping_state: customerDetails.state,
          shipping_postal_code: customerDetails.postalCode,
          shipping_country: customerDetails.country,
          customer_email: customerDetails.email
        })
        .select()
        .single();      if (orderError) throw orderError;

      // 3. Create Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
        variant_id: item.selectedVariantId || null,
        variant_title: item.selectedVariantTitle || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4. Decrement Stock (Inventory Sync)
      // Note: In a production environment, this should be done via a database trigger or RPC function
      // to ensure atomicity and prevent race conditions.
      // We are using a custom RPC function 'decrement_stock' if available, or falling back to client-side update (insecure but functional for prototype).
      
      for (const item of items) {
        const { error: rpcError } = await supabase.rpc('decrement_stock', { 
          product_id: item.id, 
          quantity_to_decrement: item.quantity,
          variant_id: item.selectedVariantId || null
        });

        if (rpcError) {
          console.warn(`Failed to decrement stock via RPC for item ${item.id}. Attempting direct update...`, rpcError);
          // Fallback: Direct update (Only works if RLS allows public updates, which is risky)
          // We will skip this fallback to avoid security risks, assuming the RPC migration will be applied.
        }
      }

      // 5. Send Order Confirmation Email
      const { error: emailError } = await supabase.functions.invoke('send-order-confirmation', {
        body: { order_id: order.id }
      });

      if (emailError) {
        console.warn('Failed to send order confirmation email:', emailError);
        // Don't block the user flow for email failure
      }

      setOrderId(order.id);
      setStep('confirmation');
      clearCart();

    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Failed to place order: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="text-neutral-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Your cart is empty</h2>
          <p className="text-neutral-500">Add some items to your cart to proceed to checkout.</p>
          <button 
            onClick={() => navigate('/store')}
            className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="text-green-600" size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Order Confirmed!</h2>
            <p className="text-neutral-500">Thank you for your purchase. Your order #{orderId ? orderId.slice(0, 8) : 'NX-0000'} has been received.</p>
          </div>
          <div className="border-t border-neutral-100 pt-6 space-y-3">
            <button 
              onClick={() => navigate('/account')}
              className="w-full py-3 border border-neutral-200 rounded-xl font-bold hover:bg-neutral-50 transition-colors"
            >
              View Order Status
            </button>
            <button 
              onClick={() => navigate('/store')}
              className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/store')} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Checkout</h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
            <ShieldCheck size={16} className="text-green-600" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Section */}
          <div className={`bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden ${step === 'payment' ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="p-6 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-lg font-bold">Shipping Information</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Email Address</label>
                <input name="email" value={customerDetails.email} onChange={handleInputChange} type="email" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors" placeholder="jane@example.com" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">First Name</label>
                <input name="firstName" value={customerDetails.firstName} onChange={handleInputChange} type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors" placeholder="Jane" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Last Name</label>
                <input name="lastName" value={customerDetails.lastName} onChange={handleInputChange} type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors" placeholder="Doe" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Address</label>
                <input name="address" value={customerDetails.address} onChange={handleInputChange} type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors" placeholder="123 Nexus Blvd" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">City</label>
                <input name="city" value={customerDetails.city} onChange={handleInputChange} type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors" placeholder="Toronto" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Province / State Code</label>
                <input name="state" value={customerDetails.state} onChange={handleInputChange} type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors" placeholder="ON" maxLength={2} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Postal Code</label>
                <input name="postalCode" value={customerDetails.postalCode} onChange={handleInputChange} type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors" placeholder="M5V 2T6" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">Country Code</label>
                <input name="country" value={customerDetails.country} onChange={handleInputChange} type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors" placeholder="CA" maxLength={2} />
              </div>

              {/* Shipping Method Selection */}
              <div className="col-span-2 mt-4 pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Truck size={16} /> Shipping Method</h3>
                {isLoadingShipping ? (
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Loader2 size={14} className="animate-spin" /> Calculating rates...
                  </div>
                ) : shippingRates.length > 0 ? (
                  <div className="space-y-2">
                    {shippingRates.map(rate => (
                      <label key={rate.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${selectedShippingRate?.id === rate.id ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="shippingRate" 
                            checked={selectedShippingRate?.id === rate.id}
                            onChange={() => setSelectedShippingRate(rate)}
                            className="accent-black"
                          />
                          <div>
                            <div className="font-bold text-sm">{rate.name}</div>
                            <div className="text-xs text-neutral-500 capitalize">{rate.type} Based</div>
                          </div>
                        </div>
                        <div className="font-bold text-sm">${rate.amount.toFixed(2)}</div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500 italic">
                    Enter your shipping address to see available rates.
                  </div>
                )}
              </div>

              {step === 'shipping' && (
                <div className="col-span-2 mt-4">
                  <button 
                    onClick={() => setStep('payment')}
                    className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Payment <Truck size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className={`bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden ${step === 'shipping' ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="p-6 border-b border-neutral-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-lg font-bold">Payment Method</h2>
            </div>
            <div className="p-6 space-y-4">
              
              {config.paymentProvider === 'stripe' && stripePromise && (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm 
                    amount={orderTotal} 
                    onProcessPayment={handlePlaceOrder} 
                    isProcessing={isProcessing} 
                  />
                </Elements>
              )}

              {config.paymentProvider === 'paypal' && config.paypalClientId && (
                <PayPalScriptProvider options={{ clientId: config.paypalClientId }}>
                  <PayPalButtons 
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              currency_code: config.currency || "USD",
                              value: orderTotal.toFixed(2),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        await actions.order.capture();
                        handlePlaceOrder();
                      }
                    }}
                  />
                </PayPalScriptProvider>
              )}

              {config.paymentProvider === 'square' && config.squareApplicationId && config.squareLocationId && (
                 <div className="p-4 border border-neutral-200 rounded-lg bg-white">
                    <PaymentForm
                      applicationId={config.squareApplicationId}
                      locationId={config.squareLocationId}
                      cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                        console.log('Square Token:', token);
                        // In a real app, send token to backend to charge
                        await handlePlaceOrder();
                      }}
                    >
                      <SquareCreditCard 
                        buttonProps={{
                          css: {
                            backgroundColor: '#000000',
                            fontSize: '16px',
                            color: '#ffffff',
                            '&:hover': {
                              backgroundColor: '#333333',
                            },
                          }
                        }}
                      />
                      
                      {(config.enableApplePay || config.enableGooglePay) && (
                        <div className="mt-4 pt-4 border-t border-neutral-100">
                          <p className="text-xs font-bold text-neutral-500 uppercase mb-2">Digital Wallets</p>
                          <div className="grid grid-cols-2 gap-2">
                             {config.enableApplePay && <ApplePay />}
                             {config.enableGooglePay && <GooglePay />}
                          </div>
                        </div>
                      )}
                    </PaymentForm>
                 </div>
              )}

              {(!config.paymentProvider || config.paymentProvider === 'manual') && (
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-600">
                    This store is configured for manual payments. Please proceed to place your order.
                  </div>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : `Place Order ($${orderTotal.toFixed(2)})`}
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div className="pt-4">
                  <button 
                    onClick={() => setStep('shipping')}
                    className="text-sm text-neutral-500 hover:text-black font-bold"
                  >
                    &larr; Back to Shipping
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 border-t border-neutral-100 pt-6">
              {/* Discount Code Input */}
              <div className="mb-4">
                {appliedDiscount ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-green-600" />
                      <div>
                        <div className="text-sm font-bold text-green-700">{appliedDiscount.code}</div>
                        <div className="text-xs text-green-600">
                          {appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}% Off` : `$${appliedDiscount.value} Off`}
                        </div>
                      </div>
                    </div>
                    <button onClick={removeDiscount} className="text-xs font-bold text-green-700 hover:underline">Remove</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Discount code"
                        className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                      />
                      <button 
                        onClick={handleApplyDiscount}
                        disabled={!discountCode || isCheckingDiscount}
                        className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg hover:bg-neutral-800 disabled:opacity-50"
                      >
                        {isCheckingDiscount ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                    {discountError && (
                      <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
                        <AlertCircle size={12} /> {discountError}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-${actualDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-neutral-600">
                <span>Shipping</span>
                <span>{selectedShippingRate ? `$${selectedShippingRate.amount.toFixed(2)}` : 'Calculated at next step'}</span>
              </div>
              
              {/* Tax Breakdown */}
              {taxBreakdown.length > 0 ? (
                taxBreakdown.map((tax, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-neutral-600">
                    <span>{tax.name} ({tax.rate}%)</span>
                    <span>${tax.amount.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Taxes</span>
                  <span>${totalTax.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold pt-3 border-t border-neutral-100">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
