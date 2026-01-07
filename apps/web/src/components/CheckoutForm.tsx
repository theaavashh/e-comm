'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define validation schema using Zod
const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Email is invalid'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['cod', 'card', 'paypal']),
});

type FormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  productId?: string | null;
  quantity?: number;
  variant?: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ productId, quantity = 1, variant = 0 }) => {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nepal',
      shippingMethod: 'standard',
      paymentMethod: 'cod',
    },
  });

  const [loading, setLoading] = useState(false);

  // Watch payment method to conditionally show PayPal interface
  const paymentMethod = watch('paymentMethod');

  // If productId is provided, we're buying a single product directly
  const directProduct = productId ? { id: productId, quantity, variant } : null;
  const itemsToCheckout = directProduct ? [directProduct] : cartItems || [];

  useEffect(() => {
    if (itemsToCheckout && itemsToCheckout.length === 0) {
      router.push('/cart');
    }
  }, [itemsToCheckout, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      // In a real application, you would send the order data to your backend
      // For now, we'll simulate the checkout process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart after successful checkout
      if (!directProduct) {
        clearCart();
      }
      
      // Redirect to success page
      router.push('/checkout/success');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (itemsToCheckout.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">There are no items in your cart to checkout.</p>
          <button 
            onClick={() => router.push('/products')}
            className="bg-[#EB6426] hover:bg-[#d65a1f] text-white py-2 px-4 rounded-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipping Information Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="firstName"
                        className={`w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="lastName"
                        className={`w-full px-3 py-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      id="email"
                      className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      id="phone"
                      className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      id="address"
                      className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  )}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="city"
                        className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="state"
                        className={`w-full px-3 py-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code *
                  </label>
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="zipCode"
                        className={`w-full px-3 py-2 border rounded-md ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    )}
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="country"
                      className={`w-full px-3 py-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Country</option>
                      <option value="Nepal">Nepal</option>
                      <option value="USA">United States</option>
                      <option value="India">India</option>
                      <option value="China">China</option>
                    </select>
                  )}
                />
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Shipping Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <Controller
                      name="shippingMethod"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="radio"
                          {...field}
                          value="standard"
                          checked={field.value === 'standard'}
                          className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
                        />
                      )}
                    />
                    <span className="ml-2 text-gray-700">Standard Shipping (3-5 business days)</span>
                    <span className="ml-auto text-gray-700">$5.00</span>
                  </label>
                  <label className="flex items-center">
                    <Controller
                      name="shippingMethod"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="radio"
                          {...field}
                          value="express"
                          checked={field.value === 'express'}
                          className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
                        />
                      )}
                    />
                    <span className="ml-2 text-gray-700">Express Shipping (1-2 business days)</span>
                    <span className="ml-auto text-gray-700">$15.00</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="radio"
                          {...field}
                          value="cod"
                          checked={field.value === 'cod'}
                          className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
                        />
                      )}
                    />
                    <span className="ml-2 text-gray-700">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center">
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="radio"
                          {...field}
                          value="card"
                          checked={field.value === 'card'}
                          className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
                        />
                      )}
                    />
                    <span className="ml-2 text-gray-700">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center">
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="radio"
                          {...field}
                          value="paypal"
                          checked={field.value === 'paypal'}
                          className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
                        />
                      )}
                    />
                    <span className="ml-2 text-gray-700">PayPal</span>
                  </label>
                </div>
              </div>
              
              {/* PayPal Interface - shown only when PayPal is selected */}
              {paymentMethod === 'paypal' && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-lg font-medium text-blue-800 mb-3">PayPal Payment</h4>
                  <div className="flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200">
                    <div className="text-center">
                      <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8">
                          <path fill="#0070ba" d="M7.2 18c-.7 0-1.3-.1-1.8-.3-.5-.2-.9-.5-1.2-.9-.3-.4-.5-.9-.6-1.4-.1-.5-.1-1.1-.1-1.7V6.3c0-.6 0-1.2.1-1.7.1-.5.3-1 .6-1.4.3-.4.7-.7 1.2-.9.5-.2 1.1-.3 1.8-.3H15c.7 0 1.3.1 1.8.3.5.2 1 .5 1.2.9.3.4.5.9.6 1.4.1.5.1 1.1.1 1.7v2.3h-2.3V7.7c0-.5 0-1-.1-1.4-.1-.4-.3-.8-.6-1.1-.3-.3-.7-.5-1.1-.6-.4-.1-.9-.1-1.4-.1H9c-.5 0-1 .1-1.4.1-.4.1-.8.3-1.1.6-.3.3-.5.7-.6 1.1-.1.4-.1.9-.1 1.4v6.6c0 .5 0 1 .1 1.4.1.4.3.8.6 1.1.3.3.7.5 1.1.6.4.1.9.1 1.4.1h5.2c.5 0 1-.1 1.4-.1.4-.1.8-.3 1.1-.6.3-.3.5-.7.6-1.1.1-.4.1-.9.1-1.4V13H9.5v2.3c0 .5 0 1 .1 1.4.1.4.3.8.6 1.1.3.3.7.5 1.1.6.4.1.9.1 1.4.1h.6c.5 0 1-.1 1.4-.1.4-.1.8-.3 1.1-.6.3-.3.5-.7.6-1.1.1-.4.1-.9.1-1.4v-1.2H7.2z"/>
                          <path fill="#003087" d="M21 6.3v2.3c0 .5 0 1-.1 1.4-.1.4-.3.8-.6 1.1-.3.3-.7.5-1.1.6-.4.1-.9.1-1.4.1H15v-2.3h2.7c.5 0 1-.1 1.4-.1.4-.1.8-.3 1.1-.6.3-.3.5-.7.6-1.1.1-.4.1-.9.1-1.4V6.3c0-.6 0-1.2-.1-1.7-.1-.5-.3-1-.6-1.4-.3-.4-.7-.7-1.2-.9-.5-.2-1.1-.3-1.8-.3h-7.2c-.7 0-1.3.1-1.8.3-.5.2-.9.5-1.2.9-.3.4-.5.9-.6 1.4-.1.5-.1 1.1-.1 1.7v.6h2.3v-.6c0-.5 0-1 .1-1.4.1-.4.3-.8.6-1.1.3-.3.7-.5 1.1-.6.4-.1.9-.1 1.4-.1h5.2c.5 0 1 .1 1.4.1.4.1.8.3 1.1.6.3.3.5.7.6 1.1.1.4.1.9.1 1.4v.6z"/>
                        </svg>
                      </div>
                      <p className="text-gray-700 mb-4">Securely pay with your PayPal account</p>
                      <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium"
                        onClick={() => alert('PayPal payment processing would happen here')}
                      >
                        Pay with PayPal
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#EB6426] hover:bg-[#d65a1f] text-white py-3 px-4 rounded-md font-medium disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {itemsToCheckout.map((item: any, index: number) => (
                <div key={item.id || index} className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name || `Product ${index + 1}`}</h3>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity || quantity}</p>
                  </div>
                  <div className="text-gray-800 font-medium">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : (item.price || '0.00')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">
                  {watch('shippingMethod') === 'standard' ? '$5.00' : '$15.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800">$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${(cartTotal + (watch('shippingMethod') === 'standard' ? 5 : 15)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;