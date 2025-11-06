"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ForgotPasswordFormData {
  email: string;
}

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
    reset: resetForgotPassword,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login form submitted:', data);
    setIsLoading(true);
    
    try {
      console.log('Calling login function...');
      const success = await login(data.email, data.password);
      console.log('Login result:', success);
      
      if (success) {
        const id = toast.success("Login successfully");
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          toast.dismiss(id);
          router.push("/dashboard");
        }, 1500);
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      // Call the API to reset password
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }

      toast.success("Password reset instructions sent to your email!");
      setShowForgotPassword(false);
      resetForgotPassword();
      
    } catch (error) {
      console.error("Forgot password failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#f0efeb] flex items-center justify-center p-4 custom-font"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Login Form Card */}
        <motion.div 
          className="bg-[#fffefe] shadow-lg rounded-xl p-8 border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Logo and Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="mx-auto w-16 h-16 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <Image
                src="/image.png"
                alt="Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold text-gray-900 mb-2 custom-font"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Welcome back
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-sm custom-font"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Please enter your details to login
            </motion.p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* Email Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2 custom-font">
                Email
              </label>
              <motion.input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`w-full px-3 py-2.5 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors custom-font ${
                  errors.email
                    ? "border-red-300"
                    : "border-gray-300"
                } bg-white text-gray-900 placeholder-gray-400`}
                placeholder="admin@gharsamma.com"
                disabled={isLoading}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    className="mt-1 text-sm text-red-600 custom-font"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-lg font-medium text-gray-700 custom-font">
                  Password
                </label>
                <motion.button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-lg text-blue-600 hover:text-blue-500 font-medium custom-font"
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Forgot password?
                </motion.button>
              </div>
              <div className="relative">
                <motion.input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors custom-font ${
                    errors.password
                      ? "border-red-300"
                      : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-400`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    const passwordInput = document.getElementById('password') as HTMLInputElement;
                    if (passwordInput) {
                      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </motion.button>
        </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    className="mt-1 text-sm text-red-600 custom-font"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember Me */}
            <motion.div 
              className="flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <motion.input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 custom-font">
                Remember me
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white disabled:bg-gray-100 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed text-sm border border-gray-300 custom-font"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center custom-font">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Login"
              )}
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-gray-100 rounded-xl p-8 w-full max-w-md border border-gray-200"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <motion.h2 
                className="text-xl font-bold text-gray-900 mb-2 custom-font"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Reset Password
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-sm mb-6 custom-font"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Enter your email address and we'll send you instructions to reset your password.
              </motion.p>
            
            <form onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)} className="space-y-4">
              <div>
                <label htmlFor="forgotPasswordEmail" className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                  Email
                </label>
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  {...registerForgotPassword("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors custom-font ${
                    forgotPasswordErrors.email
                      ? "border-red-300"
                      : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-400`}
                    placeholder="admin@gharsamma.com"
                  disabled={isLoading}
                />
                {forgotPasswordErrors.email && (
                  <p className="mt-1 text-sm text-red-600 custom-font">{forgotPasswordErrors.email.message}</p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    resetForgotPassword();
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium custom-font"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm border border-gray-300 custom-font"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#ffffff',
            color: '#111111',
          },
          success: {
            duration: 1500,
            iconTheme: {
              primary: '#16a34a',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 2000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </motion.div>
  );
}