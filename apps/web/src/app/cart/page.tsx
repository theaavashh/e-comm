'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

export default function CartPage() {
  const { cartItems, cartItemCount, cartTotal, updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (cartItemCount === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 custom-font">Shopping Cart</h1>
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 custom-font mb-6">Your cart is empty.</p>
          <Link 
            href="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 custom-font">Shopping Cart ({cartItemCount} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center p-6 border-b border-gray-100 last:border-b-0">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-xs text-gray-500">No Image</span></div>';
                      }
                    }}
                  />
                </div>
                
                {/* Product Info */}
                <div className="flex-1 ml-4">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 mt-1">{formatPrice(item.price)}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="mx-3 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Price and Remove */}
                <div className="flex flex-col items-end">
                  <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-4 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatPrice(cartTotal * 0.13)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(cartTotal * 1.13)}</span>
              </div>
            </div>
            
            <Link
              href="/checkout"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-center block transition-colors"
            >
              Proceed to Checkout
            </Link>
            
            <Link 
              href="/" 
              className="block text-center mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}