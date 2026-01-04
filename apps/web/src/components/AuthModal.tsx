'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { data: session, status } = useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  
  console.log('AuthModal isOpen:', isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpStep, setSignUpStep] = useState(1); // Multi-step for sign up: 1 - Basic Info, 2 - Email Verification, 3 - Password
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
      toast.success('Successfully signed in with Google!');
      onClose();
    } catch (error) {
      toast.error('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      
      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Successfully signed in!');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (signUpStep === 1) {
      // Validate step 1 inputs before moving to step 2
      if (!formData.name || !formData.phone || !formData.email) {
        toast.error('Please fill in all required fields');
        return;
      }
      setSignUpStep(2);
      return;
    }
    
    if (signUpStep === 3) {
      // Final step - validate password and submit
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
      
      if (signUpStep === 2) {
        // Send verification email
        const emailResponse = await fetch(`${API_BASE_URL}/api/v1/auth/send-verification-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        });
        
        if (!emailResponse.ok) {
          const error = await emailResponse.json();
          toast.error(error.message || 'Failed to send verification email');
          setIsLoading(false);
          return;
        }
        
        toast.success('Verification code sent to your email!');
        setSignUpStep(3); // Move to password step after successful email send
        setIsLoading(false);
      } else if (signUpStep === 3) {
        // Final registration
        // Verify email with code first
        const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            code: verificationCode,
          }),
        });
        
        if (!verifyResponse.ok) {
          const error = await verifyResponse.json();
          toast.error(error.message || 'Invalid verification code');
          setIsLoading(false);
          return;
        }
        
        // Email verified, now register
        const registerResponse = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            username: formData.name.toLowerCase().replace(/\s+/g, '_'),
            password: formData.password,
            firstName: formData.name.split(' ')[0] || formData.name,
            lastName: formData.name.split(' ').slice(1).join(' ') || '',
            phone: formData.phone,
          }),
        });
        
        if (registerResponse.ok) {
          const data = await registerResponse.json();
          if (data.success && data.data.accessToken) {
            // Store tokens
            localStorage.setItem('accessToken', data.data.accessToken);
            if (data.data.refreshToken) {
              localStorage.setItem('refreshToken', data.data.refreshToken);
            }
            toast.success('Account created successfully! You are now logged in.');
            onClose();
            window.location.reload();
          }
        } else {
          const error = await registerResponse.json();
          toast.error(error.message || 'Failed to create account');
        }
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Failed to process request');
      setIsLoading(false);
    }
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Successfully signed out');
    onClose();
  };

  if (status === 'loading') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-end z-[9999]"
          >
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#F0F2F5] rounded-xl p-8 text-center max-w-md w-full mx-4 ml-auto"
            >
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (session) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-end z-[9999]"
            onClick={onClose}
          >
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#F0F2F5] rounded-xl max-w-md w-full mx-4 relative ml-auto flex flex-col h-[70vh] max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 flex-grow overflow-y-auto">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold custom-font text-gray-900 mb-2">Welcome back!</h2>
                  <p className="text-gray-600 custom-font mb-6">
                    You are signed in as <span className="font-medium">{session.user?.email}</span>
                  </p>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium custom-font hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-end z-[9999]"
          onClick={onClose}
        >
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#F0F2F5] rounded-xl max-w-md w-full mx-4 relative ml-auto flex flex-col h-[70vh] max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="p-8 flex-grow overflow-y-auto max-h-full">
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold custom-font text-gray-900 mb-2">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-gray-600 custom-font text-base">
                {isSignUp ? 'Join us today!' : 'Welcome back!'}
              </p>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-[#F0F2F5] border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Sign {isSignUp ? 'up' : 'in'} with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#F0F2F5] text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            {signUpStep === 2 && isSignUp ? (
              <form onSubmit={(e) => { e.preventDefault(); handleEmailSignUp(); }}>
                <div className="mb-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 custom-font">Check Your Email</h3>
                  <p className="text-gray-600 custom-font text-sm">
                    We sent a verification code to <br />
                    <span className="font-medium text-gray-900">{formData.email}</span>
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Didn't receive the code? Check your spam folder or{' '}
                    <button
                      type="button"
                      onClick={handleEmailSignUp}
                      className="text-blue-600 hover:underline"
                    >
                      resend
                    </button>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full text-white py-3.5 px-6 rounded-xl font-medium custom-font hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: '#0077b6' }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    'Verify Email'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={isSignUp ? (e) => { e.preventDefault(); handleEmailSignUp(); } : handleEmailSignIn}>
              {isSignUp && signUpStep === 1 && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <div></div> {/* Empty div for spacing */}
                    <button
                      type="button"
                      onClick={handleEmailSignUp}
                      disabled={!formData.name || !formData.phone || !formData.email || isLoading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium custom-font hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                          Validating...
                        </>
                      ) : 'Continue'}
                    </button>
                  </div>
                </div>
              )}

              {isSignUp && signUpStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 custom-font">Check Your Email</h3>
                    <p className="text-gray-600 custom-font text-sm">
                      We sent a verification code to <br />
                      <span className="font-medium text-gray-900">{formData.email}</span>
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black text-center text-2xl tracking-widest"
                        placeholder="000000"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Didn't receive the code? Check your spam folder or{' '}
                      <button
                        type="button"
                        onClick={handleEmailSignUp}
                        className="text-blue-600 hover:underline"
                      >
                        resend
                      </button>
                    </p>
                  </div>

                  <div className="flex justify-between space-x-4">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(1)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium custom-font hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleEmailSignUp}
                      disabled={verificationCode.length !== 6 || isLoading}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium custom-font hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                          Verifying...
                        </>
                      ) : 'Continue'}
                    </button>
                  </div>
                </div>
              )}

              {isSignUp && signUpStep === 3 && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Use at least 6 characters</p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between space-x-4">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(2)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium custom-font hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || formData.password !== formData.confirmPassword || formData.password.length < 6}
                      className="flex-1 px-4 py-3 text-white rounded-xl font-medium custom-font hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: '#0077b6' }}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {!isSignUp && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                      Email Address
                    </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
                    Password
                  </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                  }}
                  className="text-sm text-blue-600 hover:underline custom-font"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-3.5 px-6 rounded-xl font-medium custom-font hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#0077b6' }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  'Sign In'
                )}
              </button>
              </>
              )}
            </form>
            )}

            {!showVerificationStep && (
              <div className="text-center mt-6">
                <p className="text-gray-600 custom-font">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
                      setVerificationCode('');
                      setSignUpStep(1); // Reset to first step when switching
                    }}
                    className="ml-2 font-medium custom-font"
                    style={{ color: '#0077b6' }}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
