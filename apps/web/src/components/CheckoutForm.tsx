'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import AuthModal from './AuthModal';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  Truck,
  Shield,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  brand: string;
}

interface CheckoutFormProps {
  productId: string | null;
  quantity: number;
}

interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface FormData {
  personalDetails: PersonalDetails;
  deliveryAddress: Address;
  billingAddress: Address;
  sameAsDelivery: boolean;
}

export default function CheckoutForm({ productId, quantity }: CheckoutFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<FormData>({
    defaultValues: {
      personalDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      deliveryAddress: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nepal'
      },
      billingAddress: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nepal'
      },
      sameAsDelivery: false
    },
    mode: 'onChange'
  });

  const sameAsDelivery = watch('sameAsDelivery');
  const personalDetails = watch('personalDetails');
  const deliveryAddress = watch('deliveryAddress');
  const billingAddress = watch('billingAddress');

  useEffect(() => {
    // Simulate product loading
    const mockProduct: Product = {
      id: productId || '1',
      name: 'Premium Wireless Headphones',
      price: 2500,
      originalPrice: 3500,
      discount: 28,
      image: '/api/placeholder/400/400',
      brand: 'TechSound'
    };
    
    setProduct(mockProduct);
    setLoading(false);
  }, [productId]);

  // Update billing address when same as delivery is checked
  useEffect(() => {
    if (sameAsDelivery) {
      setValue('billingAddress', deliveryAddress);
    }
  }, [sameAsDelivery, deliveryAddress, setValue]);

  const nextStep = () => {
    if (currentStep < 4) {
      // Validate current step before proceeding
      if (currentStep === 1) {
        if (!personalDetails.firstName || !personalDetails.lastName || !personalDetails.email || !personalDetails.phone) {
          toast.error('Please fill in all personal details');
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalDetails.email)) {
          toast.error('Please enter a valid email address');
          return;
        }
      } else if (currentStep === 2) {
        if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.postalCode) {
          toast.error('Please fill in all delivery address fields');
          return;
        }
      } else if (currentStep === 3) {
        if (!sameAsDelivery && (!billingAddress.street || !billingAddress.city || !billingAddress.state || !billingAddress.postalCode)) {
          toast.error('Please fill in all billing address fields');
          return;
        }
      }
      setCurrentStep(prev => prev + 1);
      toast.success(`Step ${currentStep + 1} completed!`);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate payment processing
      toast.loading('Processing payment...', { id: 'payment' });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Payment successful! Redirecting...', { id: 'payment' });
      
      setTimeout(() => {
        router.push('/checkout/success');
      }, 1500);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, name: 'Personal Details', icon: User },
    { id: 2, name: 'Delivery Address', icon: MapPin },
    { id: 3, name: 'Billing Address', icon: MapPin },
    { id: 4, name: 'Payment', icon: CreditCard }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const subtotal = product.price * quantity;
  const shipping = subtotal > 2000 ? 0 : 200;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
        
        {/* Sign In Button */}
        {!session && (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <User className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        )}
        
        {/* User Info */}
        {session && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
              <p className="text-xs text-gray-500">{session.user?.email}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isAccessible = currentStep >= step.id;
                
                return (
                  <motion.div 
                    key={step.id} 
                    className={`bg-white rounded-xl shadow-lg transition-all duration-200 ${
                      isActive 
                        ? 'ring-2 ring-blue-500' 
                        : isCompleted 
                        ? 'opacity-75'
                        : !isAccessible
                        ? 'opacity-50'
                        : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : isCompleted 
                            ? 'bg-green-600 text-white'
                            : isAccessible
                            ? 'bg-gray-300 text-gray-600'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold transition-colors ${
                            isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {step.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Step {step.id} of 4
                          </p>
                        </div>
                      </div>
                      
                      {/* Step Content - Only show for active step */}
                      {isActive && (
                        <motion.div 
                          className="mt-6"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          {step.id === 1 && (
                            <div>
                              <div className="text-sm text-gray-600 mb-6">
                                <p>Enter your personal information to continue with the checkout process.</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                  </label>
                                  <Controller
                                    name="personalDetails.firstName"
                                    control={control}
                                    rules={{ required: 'First name is required' }}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        type="text"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                          errors.personalDetails?.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your first name"
                                      />
                                    )}
                                  />
                                  {errors.personalDetails?.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.personalDetails.firstName.message}</p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                  </label>
                                  <Controller
                                    name="personalDetails.lastName"
                                    control={control}
                                    rules={{ required: 'Last name is required' }}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        type="text"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                          errors.personalDetails?.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your last name"
                                      />
                                    )}
                                  />
                                  {errors.personalDetails?.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.personalDetails.lastName.message}</p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                  </label>
                                  <Controller
                                    name="personalDetails.email"
                                    control={control}
                                    rules={{ 
                                      required: 'Email is required',
                                      pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Please enter a valid email address'
                                      }
                                    }}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        type="email"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                          errors.personalDetails?.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your email"
                                      />
                                    )}
                                  />
                                  {errors.personalDetails?.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.personalDetails.email.message}</p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                  </label>
                                  <Controller
                                    name="personalDetails.phone"
                                    control={control}
                                    rules={{ required: 'Phone number is required' }}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        type="tel"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                          errors.personalDetails?.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your phone number"
                                      />
                                    )}
                                  />
                                  {errors.personalDetails?.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.personalDetails.phone.message}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-end mt-6">
                                <button
                                  type="button"
                                  onClick={nextStep}
                                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                          {step.id === 2 && (
                            <div>
                              <div className="text-sm text-gray-600 mb-6">
                                <p>Provide your delivery address for shipping.</p>
                              </div>
                              <div className="space-y-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address *
                                  </label>
                                  <Controller
                                    name="deliveryAddress.street"
                                    control={control}
                                    rules={{ required: 'Street address is required' }}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        type="text"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                          errors.deliveryAddress?.street ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your street address"
                                      />
                                    )}
                                  />
                                  {errors.deliveryAddress?.street && (
                                    <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.street.message}</p>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      City *
                                    </label>
                                    <Controller
                                      name="deliveryAddress.city"
                                      control={control}
                                      rules={{ required: 'City is required' }}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                            errors.deliveryAddress?.city ? 'border-red-500' : 'border-gray-300'
                                          }`}
                                          placeholder="Enter your city"
                                        />
                                      )}
                                    />
                                    {errors.deliveryAddress?.city && (
                                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.city.message}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      State/Province *
                                    </label>
                                    <Controller
                                      name="deliveryAddress.state"
                                      control={control}
                                      rules={{ required: 'State is required' }}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                            errors.deliveryAddress?.state ? 'border-red-500' : 'border-gray-300'
                                          }`}
                                          placeholder="Enter your state"
                                        />
                                      )}
                                    />
                                    {errors.deliveryAddress?.state && (
                                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.state.message}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Postal Code *
                                    </label>
                                    <Controller
                                      name="deliveryAddress.postalCode"
                                      control={control}
                                      rules={{ required: 'Postal code is required' }}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                            errors.deliveryAddress?.postalCode ? 'border-red-500' : 'border-gray-300'
                                          }`}
                                          placeholder="Enter your postal code"
                                        />
                                      )}
                                    />
                                    {errors.deliveryAddress?.postalCode && (
                                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.postalCode.message}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Country *
                                    </label>
                                    <Controller
                                      name="deliveryAddress.country"
                                      control={control}
                                      rules={{ required: 'Country is required' }}
                                      render={({ field }) => (
                                        <select
                                          {...field}
                                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                            errors.deliveryAddress?.country ? 'border-red-500' : 'border-gray-300'
                                          }`}
                                        >
                                          <option value="Nepal">Nepal</option>
                                          <option value="India">India</option>
                                          <option value="USA">USA</option>
                                          <option value="UK">UK</option>
                                        </select>
                                      )}
                                    />
                                    {errors.deliveryAddress?.country && (
                                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.country.message}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between mt-6">
                                <button
                                  type="button"
                                  onClick={prevStep}
                                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                  Previous
                                </button>
                                <button
                                  type="button"
                                  onClick={nextStep}
                                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                          {step.id === 3 && (
                            <div>
                              <div className="text-sm text-gray-600 mb-6">
                                <p>Enter billing information or use same as delivery address.</p>
                              </div>
                              {/* Same as Delivery Checkbox */}
                              <div className="mb-6">
                                <Controller
                                  name="sameAsDelivery"
                                  control={control}
                                  render={({ field }) => (
                                    <label className="flex items-center">
                                      <input
                                        {...field}
                                        type="checkbox"
                                        checked={field.value}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">
                                        Same as delivery address
                                      </span>
                                    </label>
                                  )}
                                />
                              </div>

                              {!sameAsDelivery && (
                                <div className="space-y-6">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Street Address *
                                    </label>
                                    <Controller
                                      name="billingAddress.street"
                                      control={control}
                                      rules={{ required: !sameAsDelivery ? 'Street address is required' : false }}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                            errors.billingAddress?.street ? 'border-red-500' : 'border-gray-300'
                                          }`}
                                          placeholder="Enter your street address"
                                        />
                                      )}
                                    />
                                    {errors.billingAddress?.street && (
                                      <p className="text-red-500 text-sm mt-1">{errors.billingAddress.street.message}</p>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                      </label>
                                      <Controller
                                        name="billingAddress.city"
                                        control={control}
                                        rules={{ required: !sameAsDelivery ? 'City is required' : false }}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="text"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                              errors.billingAddress?.city ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your city"
                                          />
                                        )}
                                      />
                                      {errors.billingAddress?.city && (
                                        <p className="text-red-500 text-sm mt-1">{errors.billingAddress.city.message}</p>
                                      )}
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State/Province *
                                      </label>
                                      <Controller
                                        name="billingAddress.state"
                                        control={control}
                                        rules={{ required: !sameAsDelivery ? 'State is required' : false }}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="text"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                              errors.billingAddress?.state ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your state"
                                          />
                                        )}
                                      />
                                      {errors.billingAddress?.state && (
                                        <p className="text-red-500 text-sm mt-1">{errors.billingAddress.state.message}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code *
                                      </label>
                                      <Controller
                                        name="billingAddress.postalCode"
                                        control={control}
                                        rules={{ required: !sameAsDelivery ? 'Postal code is required' : false }}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            type="text"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                              errors.billingAddress?.postalCode ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your postal code"
                                          />
                                        )}
                                      />
                                      {errors.billingAddress?.postalCode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.billingAddress.postalCode.message}</p>
                                      )}
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country *
                                      </label>
                                      <Controller
                                        name="billingAddress.country"
                                        control={control}
                                        rules={{ required: !sameAsDelivery ? 'Country is required' : false }}
                                        render={({ field }) => (
                                          <select
                                            {...field}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-colors ${
                                              errors.billingAddress?.country ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                          >
                                            <option value="Nepal">Nepal</option>
                                            <option value="India">India</option>
                                            <option value="USA">USA</option>
                                            <option value="UK">UK</option>
                                          </select>
                                        )}
                                      />
                                      {errors.billingAddress?.country && (
                                        <p className="text-red-500 text-sm mt-1">{errors.billingAddress.country.message}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="flex justify-between mt-6">
                                <button
                                  type="button"
                                  onClick={prevStep}
                                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                  Previous
                                </button>
                                <button
                                  type="button"
                                  onClick={nextStep}
                                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                          {step.id === 4 && (
                            <div>
                              <div className="text-sm text-gray-600 mb-6">
                                <p>Complete your payment securely with Paddle.</p>
                              </div>
                              <div className="text-center">
                                <div className="mb-6">
                                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard className="w-8 h-8 text-blue-600" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Secure Payment with Paddle
                                  </h3>
                                  <p className="text-gray-600">
                                    Your payment will be processed securely through Paddle
                                  </p>
                                </div>
                                
                                <button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                      Processing Payment...
                                    </>
                                  ) : (
                                    'Proceed to Payment'
                                  )}
                                </button>
                              </div>
                              <div className="flex justify-between mt-6">
                                <button
                                  type="button"
                                  onClick={prevStep}
                                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                  Previous
                                </button>
                                <button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                      Processing...
                                    </>
                                  ) : (
                                    'Complete Order'
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Product */}
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-semibold text-gray-900">NPR {product.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 line-through">NPR {product.originalPrice.toLocaleString()}</span>
                    <span className="text-sm text-green-600 font-medium">{product.discount}% off</span>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Quantity</span>
                <span className="text-sm font-medium text-gray-900">{quantity}</span>
              </div>

              {/* Pricing */}
              <div className="space-y-2 py-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm font-medium text-gray-900">
                    {shipping === 0 ? 'Free' : `NPR ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>NPR {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Free shipping on orders over NPR 2,000</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Secure payment with Paddle</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span>7 days return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}