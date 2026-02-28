'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  LockClosedIcon,
  MapPinIcon,
  PencilIcon,
  AtSymbolIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

const SignupModal = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    username: '',
    address: '',
    headline: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Enter a valid phone number';
      }
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters (letters, numbers, underscore)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      console.log('User signed up:', formData);
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field) => {
    const validationErrors = validateForm();
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <Header />

      {/* Clean white background */}
      <div className="min-h-screen pt-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
              Join Us
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Create your account and start your journey
            </p>
          </div>

          {/* Signup Card */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Form-level error */}
              {errors.form && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                  ⚠️ {errors.form}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm"
                        placeholder="you@company.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={() => handleBlur('username')}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm"
                        placeholder="johndoe"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="block w-full pl-12 pr-14 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm"
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
                      <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Address (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm"
                        placeholder="123 Main St, City, Country"
                      />
                    </div>
                  </div>

                  {/* Headline (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Headline <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <PencilIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="headline"
                        value={formData.headline}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm"
                        placeholder="Designer, Developer, Creator"
                      />
                    </div>
                  </div>

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-4 px-6 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm tracking-wide border border-gray-700 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-3"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                        <span>Sign Up</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs text-gray-500 uppercase tracking-wider">or continue with</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-300"
                  onClick={() => console.log('Google signup')}
                >
                  <FaGoogle className="h-5 w-5 mr-2" />
                  Google
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-300"
                  onClick={() => console.log('GitHub signup')}
                >
                  <FaGithub className="h-5 w-5 mr-2" />
                  GitHub
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-xs text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-gray-900 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-xs">Secure • Professional • Minimal</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupModal;