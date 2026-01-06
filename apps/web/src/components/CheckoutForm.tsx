'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface CheckoutFormProps {
  productId?: string | null;
  quantity?: number;
  variant?: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod: string;
  paymentMethod: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ productId, quantity = 1, variant = 0 }) => {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>({
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
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If productId is provided, we're buying a single product directly
  const directProduct = productId ? { id: productId, quantity, variant } : null;
  const itemsToCheckout = directProduct ? [directProduct] : cartItems || [];

  useEffect(() => {
    if (itemsToCheckout && itemsToCheckout.length === 0) {
      router.push('/cart');
    }
  }, [itemsToCheckout, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
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
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Country</option>
                  <option value="Nepal">Nepal</option>
                  <option value="USA">United States</option>
                  <option value="India">India</option>
                  <option value="China">China</option>
                </select>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Shipping Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
                    />
                    <span className="ml-2 text-gray-700">Standard Shipping (3-5 business days)</span>
                    <span className="ml-auto text-gray-700">$5.00</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
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
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
                    />
                    <span className="ml-2 text-gray-700">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
                    />
                    <span className="ml-2 text-gray-700">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#EB6426] focus:ring-[#EB6426]"
                    />
                    <span className="ml-2 text-gray-700">PayPal</span>
                  </label>
                </div>
              </div>
              
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
                  {formData.shippingMethod === 'standard' ? '$5.00' : '$15.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800">$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${(cartTotal + (formData.shippingMethod === 'standard' ? 5 : 15)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;