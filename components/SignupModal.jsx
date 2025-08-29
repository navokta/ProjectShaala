'use client';

import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CameraIcon,
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
    bio: '',
    headline: '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState('/placeholder-avatar.jpg'); // fallback avatar
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Dynamic gradient background
  const [gradient, setGradient] = useState(190);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradient((prev) => (prev >= 360 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate validation
    if (!formData.name || !formData.email || !formData.password || !formData.username) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      console.log('User signed up:', { ...formData, profilePic });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Render Header */}
      <Header />

      {/* Full-screen animated background */}
      <div
        className="min-h-screen pt-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: `linear-gradient(${gradient}deg, #6366f1, #8b5cf6, #ec4899, #f59e0b)` }}
      >
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Cursor glow effect */}
        <div
          className="fixed pointer-events-none w-96 h-96 rounded-full bg-indigo-400/20 blur-xl transition-transform duration-300 z-10"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transform: 'scale(0.5)',
            opacity: 0.8,
          }}
        />

        {/* Signup Card Container */}
        <div className="max-w-lg w-full relative z-20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-50 to-purple-100 text-transparent bg-clip-text mb-3 mt-4"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
              Join Us
            </h1>
            <p className="text-blue-100/90 text-sm md:text-base leading-relaxed">
              Create your account and start your journey
            </p>
          </div>

          {/* Signup Card */}
          <div
            className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/40 
                       rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-3xl"
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255,255,255,0.1)',
            }}
          >
            <div className="p-8">
              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-100 text-sm rounded-xl backdrop-blur-sm">
                  <span className="flex items-center">
                    ⚠️ <span className="ml-2">{error}</span>
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 border border-white/30 
                                 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                                 transition text-sm placeholder:font-light tracking-wide shadow-sm hover:shadow-md"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 border border-white/30 
                                 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                                 transition text-sm placeholder:font-light tracking-wide shadow-sm hover:shadow-md"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 border border-white/30 
                                 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                                 transition text-sm placeholder:font-light tracking-wide shadow-sm hover:shadow-md"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <AtSymbolIcon className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 border border-white/30 
                                 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                                 transition text-sm placeholder:font-light tracking-wide shadow-sm hover:shadow-md"
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="block w-full pl-12 pr-14 py-4 rounded-2xl bg-white/20 border border-white/30 
                                 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                                 transition text-sm placeholder:font-light tracking-wide shadow-sm hover:shadow-md"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-200 hover:text-white transition"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 border border-white/30 
                                 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                                 transition text-sm placeholder:font-light tracking-wide shadow-sm hover:shadow-md"
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                </div>

                {/* Headline */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">Headline</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <PencilIcon className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 border border-white/30 
                                 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                                 transition text-sm placeholder:font-light tracking-wide shadow-sm hover:shadow-md"
                      placeholder="Designer, Developer, Creator"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="block w-full pl-4 pr-4 py-3 rounded-2xl bg-white/20 border border-white/30 
                               text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                               transition text-sm placeholder:font-light tracking-wide shadow-sm hover:shadow-md resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Profile Picture Upload */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-md"
                      />
                      <div className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-1 shadow-md">
                        <CameraIcon className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <label className="flex-1 cursor-pointer">
                      <span className="sr-only">Choose profile photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <span className="text-sm text-blue-200 hover:text-white transition">
                        Click to upload or drag and drop
                      </span>
                    </label>
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-4 px-6 rounded-2xl 
                             bg-gradient-to-r from-white/20 to-blue-500/30 hover:from-white/30 hover:to-blue-500/40
                             text-white font-semibold text-sm tracking-wide
                             border border-white/30 backdrop-blur-md
                             shadow-lg hover:shadow-2xl
                             focus:outline-none focus:ring-2 focus:ring-white/50
                             transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                      <span>Sign Up</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-xs text-blue-200 uppercase tracking-wider font-medium">or continue with</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 rounded-2xl 
                             bg-white/10 border border-white/20 text-white text-sm font-medium
                             hover:bg-white/20 hover:shadow-lg hover:scale-105
                             transition-all duration-300 backdrop-blur-md group"
                  onClick={() => console.log('Google signup')}
                >
                  <FaGoogle className="h-5 w-5 text-red-300 group-hover:scale-110 transition" />
                  <span className="ml-2">Google</span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 rounded-2xl 
                             bg-white/10 border border-white/20 text-white text-sm font-medium
                             hover:bg-white/20 hover:shadow-lg hover:scale-105
                             transition-all duration-300 backdrop-blur-md group"
                  onClick={() => console.log('GitHub signup')}
                >
                  <FaGithub className="h-5 w-5 text-gray-300 group-hover:scale-110 transition" />
                  <span className="ml-2">GitHub</span>
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-xs text-blue-200">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-white hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative bottom glow */}
          <div className="text-center mt-6">
            <p className="text-white/60 text-xs">
              Secure • Fast • Beautiful
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupModal;