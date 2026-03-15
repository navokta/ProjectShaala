// components/Auth/ResetPasswordForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ResetPasswordForm({ token }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-3">
          Password Reset Successful!
        </h1>
        <p className="font-sans text-gray-600 mb-6">
          Your password has been updated. Redirecting to login...
        </p>
        <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LockClosedIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="font-sans text-gray-600 text-sm">
          Create a new strong password for your account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div>
          <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-sans text-gray-900 placeholder-gray-400 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-sans text-gray-900 placeholder-gray-400 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="font-sans text-xs font-semibold text-gray-700 mb-2">
            Password must contain:
          </p>
          <ul className="font-sans text-xs text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              One uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.password) ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              One lowercase letter
            </li>
            <li className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              One number
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="font-sans text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}
