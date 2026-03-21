// components/Auth/SignupModal.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
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
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { FaGoogle, FaGithub } from "react-icons/fa";

const SignupModal = () => {
  const router = useRouter();
  const { signup } = useAuth();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    username: "",
    address: "",
    headline: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Verification States (NEW)
  const [verificationSent, setVerificationSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (formData.phone.trim()) {
      const phoneRegex =
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(formData.phone))
        newErrors.phone = "Enter a valid phone number";
    }
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (!usernameRegex.test(formData.username)) {
      newErrors.username =
        "Username must be 3-20 characters (letters, numbers, underscore)";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  // ✅ NEW: Send Verification Email Function
  const sendVerificationEmail = async (email) => {
    try {
      console.log("📤 Sending verification email to:", email);
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification email");
      }

      console.log("✅ Verification email sent:", data.message);
      return { success: true, message: data.message };
    } catch (error) {
      console.error("❌ Verification email error:", error);
      throw error;
    }
  };

  // ✅ NEW: Handle Resend Verification
  const handleResendVerification = async () => {
    if (!formData.email && !verificationSent) return;

    setIsResending(true);
    setVerificationMessage("");

    try {
      const emailToSend =
        formData.email ||
        JSON.parse(localStorage.getItem("lastSignupEmail") || "null");

      if (!emailToSend) {
        throw new Error("Email not found. Please sign up again.");
      }

      await sendVerificationEmail(emailToSend);
      setVerificationMessage("✅ Verification email resent! Check your inbox.");

      // Auto-clear message after 5 seconds
      setTimeout(() => setVerificationMessage(""), 5000);
    } catch (error) {
      setVerificationMessage(`❌ ${error.message}`);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    try {
      // 1. Create user account
      const userData = await signup(formData);
      console.log("✅ User created:", userData);

      // 2. Save email for resend functionality
      localStorage.setItem("lastSignupEmail", JSON.stringify(formData.email));

      // 3. ✅ Send verification email
      await sendVerificationEmail(formData.email);

      // 4. Show verification screen instead of redirecting
      setVerificationSent(true);
    } catch (error) {
      console.error("❌ Signup error:", error);
      setErrors({
        form: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (field) => {
    const validationErrors = validateForm();
    if (validationErrors[field])
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    else setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ✅ NEW: Verification Email Sent Screen
  if (verificationSent) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-md w-full">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
              </div>

              {/* Heading */}
              <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-3">
                Check Your Email 📧
              </h1>

              <p className="font-sans text-gray-600 mb-6">
                We've sent a verification link to
              </p>

              {/* Email Display */}
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-6">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <span className="font-sans text-sm font-medium text-gray-900">
                  {formData.email}
                </span>
              </div>

              {/* Instructions */}
              <div className="text-left p-5 bg-gray-50 border border-gray-200 rounded-xl mb-6">
                <p className="font-sans text-sm font-semibold text-gray-800 mb-3">
                  <strong>Next Steps:</strong>
                </p>
                <ol className="font-sans text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Open the email from ProjectShaala</li>
                  <li>Click on the "Verify Email Address" button</li>
                  <li>You'll be redirected to confirm your account</li>
                  <li>Start using ProjectShaala instantly!</li>
                </ol>
              </div>

              {/* Message Display */}
              {verificationMessage && (
                <div
                  className={`mb-4 p-3 rounded-xl text-sm font-sans ${
                    verificationMessage.includes("✅")
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {verificationMessage}
                </div>
              )}

              {/* Resend Button */}
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 font-poppins font-medium text-sm hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <ArrowPathIcon
                  className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
                />
                {isResending ? "Sending..." : "Didn't receive email? Resend"}
              </button>

              {/* Security Note */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="font-sans text-xs text-gray-500">
                  🔒 For security, this link will expire in 24 hours.
                </p>
              </div>

              {/* Back to Login */}
              <div className="mt-6">
                <Link
                  href="/login"
                  className="font-sans text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Already have an account? Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Original Signup Form (unchanged structure, just wrapped in <> </>)
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl text-gray-900 mb-3 tracking-tight">
              Join Us
            </h1>
            <p className="font-sans text-gray-600 text-sm md:text-base">
              Create your account and start your journey
            </p>
          </div>

          {/* Signup Card */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              {errors.form && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-sans">
                  ⚠️ {errors.form}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
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
                        onBlur={() => handleBlur("name")}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm font-sans"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 font-sans">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
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
                        onBlur={() => handleBlur("email")}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm font-sans"
                        placeholder="you@company.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-sans">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone (optional) */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                      Phone{" "}
                      <span className="text-gray-500 text-xs">(optional)</span>
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
                        onBlur={() => handleBlur("phone")}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm font-sans"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 font-sans">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
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
                        onBlur={() => handleBlur("username")}
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm font-sans"
                        placeholder="johndoe"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-xs text-red-600 font-sans">
                        {errors.username}
                      </p>
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
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur("password")}
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
                      <p className="mt-1 text-xs text-red-600 font-sans">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Address (optional) */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                      Address{" "}
                      <span className="text-gray-500 text-xs">(optional)</span>
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
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm font-sans"
                        placeholder="123 Main St, City, Country"
                      />
                    </div>
                  </div>

                  {/* Headline (optional) */}
                  <div>
                    <label className="block font-sans text-sm font-medium text-gray-700 mb-2">
                      Headline{" "}
                      <span className="text-gray-500 text-xs">(optional)</span>
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
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition text-sm shadow-sm font-sans"
                        placeholder="Designer, Developer, Creator"
                      />
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

              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs text-gray-500 uppercase tracking-wider font-sans">
                  or continue with
                </span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-300 font-sans"
                  onClick={() => (window.location.href = "/api/auth/google")}
                >
                  <FaGoogle className="h-5 w-5 mr-2" />
                  Google
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center py-3 px-4 rounded-2xl bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-300 font-sans"
                  onClick={() => (window.location.href = "/api/auth/github")}
                >
                  <FaGithub className="h-5 w-5 mr-2" />
                  GitHub
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 font-sans">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-gray-900 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-400 text-xs font-sans">
              Secure • Professional • Minimal
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupModal;
