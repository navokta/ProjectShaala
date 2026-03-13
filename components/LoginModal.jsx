'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const LoginModal = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = 'Email or username is required';
    else if (formData.identifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier)) {
      newErrors.identifier = 'Enter a valid email address';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    try {
      await login(formData.identifier, formData.password);
      router.push('/');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field) => {
    const validationErrors = validateForm();
    if (validationErrors[field]) setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    else setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl text-gray-900 mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="font-sans text-gray-600 text-sm md:text-base">
              Sign in to unlock your creative workspace
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              {errors.form && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                  ⚠️ {errors.form}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5">
                  {/* Email or Username */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                      Email or Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        onBlur={() => handleBlur('identifier')}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm font-sans"
                        placeholder="you@company.com or username"
                      />
                    </div>
                    {errors.identifier && (
                      <p className="mt-1 text-xs text-red-600 font-sans">{errors.identifier}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur('password')}
                        className="block w-full pl-12 pr-14 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm font-sans"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600 font-sans">{errors.password}</p>
                    )}
                    <div className="flex justify-end mt-2">
                      <Link href="/forgot-password" className="font-sans text-xs text-gray-500 hover:text-gray-700 transition">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-4 px-6 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-poppins font-semibold text-sm tracking-wide border border-gray-700 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-3"></div>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                        <span>Log In</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider and social buttons remain same */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs text-gray-500 uppercase tracking-wider font-sans">or continue with</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-300 font-sans"
                  onClick={() => console.log('Google login')}
                >
                  <FaGoogle className="h-5 w-5 mr-2" />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-300 font-sans"
                  onClick={() => console.log('GitHub login')}
                >
                  <FaGithub className="h-5 w-5 mr-2" />
                  GitHub
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 font-sans">
                Don’t have an account?{' '}
                <Link href="/signup" className="font-semibold text-gray-900 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-400 text-xs font-sans">Secure • Professional • Minimal</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;