'use client';

import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

const LoginModal = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (formData.identifier && formData.password.length >= 6) {
        // Success
      } else {
        throw new Error('Invalid email or password.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Render Header at the top */}
      <div>
      <Header />
      </div>

      {/* Full-screen animated background with proper offset */}
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

        {/* Login Card Container */}
        <div className="max-w-md w-full relative z-20">
          {/* Header Text */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-50 to-purple-100 text-transparent bg-clip-text mb-3 mt-4"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
              Welcome Back
            </h1>
            <p className="text-blue-100/90 text-sm md:text-base leading-relaxed">
              Sign in to unlock your creative workspace
            </p>
          </div>

          {/* Login Card */}
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
                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">
                    Email or Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-blue-200 group-focus-within:text-indigo-300 transition" />
                    </div>
                    <input
                      id="identifier"
                      name="identifier"
                      type="text"
                      autoComplete="username"
                      required
                      value={formData.identifier}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/20 border border-white/30 
                                 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                                 focus:border-transparent transition-all duration-300 text-sm
                                 placeholder:font-light tracking-wide shadow-sm hover:shadow-md"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-blue-100 mb-2 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-blue-200 group-focus-within:text-indigo-300 transition" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-14 py-4 rounded-2xl bg-white/20 border border-white/30 
                                 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 
                                 focus:border-transparent transition-all duration-300 text-sm
                                 placeholder:font-light tracking-wide shadow-sm hover:shadow-md"
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
                  <div className="flex justify-end mt-2">
                    <Link href="/forgot-password" className="text-xs text-blue-200 hover:text-white transition">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
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
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                      <span>Log In</span>
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
                  onClick={() => console.log('Google login')}
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
                  onClick={() => console.log('GitHub login')}
                >
                  <FaGithub className="h-5 w-5 text-gray-300 group-hover:scale-110 transition" />
                  <span className="ml-2">GitHub</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-xs text-blue-200">
                Don’t have an account?{' '}
                <Link href="/signup" className="font-semibold text-white hover:underline">
                  Create one
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

export default LoginModal;