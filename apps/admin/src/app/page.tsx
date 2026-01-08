"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

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
        toast.success("Login successfully");
        // Redirect immediately - state is already updated
        router.push("/dashboard");
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
      // Call the API to reset password using axios
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.post(`${apiUrl}/api/v1/admin/forgot-password`, {
        email: data.email,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to send reset email');
      }

      toast.success("Password reset instructions sent to your email!");
      setShowForgotPassword(false);
      resetForgotPassword();
      
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0efeb] flex items-center justify-center p-4 custom-font">
      <div className="w-full max-w-md">
        <div className="bg-[#fffefe] shadow-lg rounded-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="mx-auto w-64 h-16 mb-6">
              <Image
                src="/Colored JPEG.jpg"
                alt="Logo"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 custom-font">
              Welcome back
            </h1>
            <p className="text-gray-600 text-sm custom-font">
              Please enter your details to login
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2 custom-font">
                Email
              </label>
              {/* Removed focus styles from input */}
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`w-full px-3 py-2.5 border rounded-lg text-lg custom-font ${
                  errors.email
                    ? "border-red-300"
                    : "border-gray-300"
                } bg-white text-gray-900 placeholder-gray-400`}
                placeholder="admin@gharsamma.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 custom-font">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-lg font-medium text-gray-700 custom-font">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-lg text-[#EB6426] hover:text-[#d0521e] font-medium custom-font"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                {/* Removed focus styles from input */}
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-lg custom-font ${
                    errors.password
                      ? "border-red-300"
                      : "border-gray-300"
                  } bg-white text-gray-900 placeholder-gray-400`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    const passwordInput = document.getElementById('password') as HTMLInputElement;
                    if (passwordInput) {
                      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                    }
                  }}
                >
                  <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 custom-font">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 custom-font">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#EB6426] text-white disabled:bg-gray-100 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm border border-gray-300 custom-font"
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
            </button>
          </form>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-100 rounded-xl p-8 w-full max-w-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2 custom-font">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm mb-6 custom-font">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          
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
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm custom-font ${
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
                  className="flex-1 bg-[#EB6426] hover:bg-[#d0521e] disabled:bg-gray-100 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm border border-[#EB6426] custom-font"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
}