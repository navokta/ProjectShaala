"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ Global error state for UI feedback
  const router = useRouter();

  // 🔥 Helper: Logout logic ko alag function mein daala (DRY Principle)
  const handleLogout = useCallback(
    (redirect = true) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      if (redirect) {
        router.push("/login"); // ✅ Login page pe redirect karo, home pe nahi
      }
    },
    [router],
  );

  // 🔥 Fetch user on mount (Token validation)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // ✅ Cache disable karo taaki stale data na aaye
          cache: "no-store",
        });

        if (res.status === 401 || res.status === 403) {
          console.warn("⚠️ Token invalid or expired, logging out...");
          handleLogout(false); // ✅ Redirect mat karo abhi, bas state clear karo
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();

        // ✅ Safe update: Check karo ki user object actually exist karta hai
        if (data?.user) {
          setUser(data.user);
          // Optional: User data ko bhi sync kar lo agar backend se fresh data aaya hai
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("❌ Auth fetch error:", err);
        setError("Session expired. Please login again.");
        // Critical error par safe side rehne ke liye logout
        handleLogout(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [handleLogout]);

  // 🔥 LOGIN Function
  const login = async (identifier, password) => {
    setError(null); // ✅ Pehle purani error clear karo
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ✅ Backend se aayi hui specific error message throw karo
        throw new Error(data.message || data.error || "Login failed");
      }

      // ✅ Validate response structure before storing
      if (!data.accessToken || !data.user) {
        throw new Error("Invalid response from server");
      }

      // Store tokens & user
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message);
      throw err; // ✅ Error ko upar bhejo taaki component mein show kar sako
    }
  };

  // 🔥 SIGNUP Function
  const signup = async (userData) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Signup failed");
      }

      if (!data.accessToken || !data.user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.message);
      throw err;
    }
  };

  // 🔥 LOGOUT Function (Public)
  const logout = () => {
    handleLogout(true); // ✅ True bheja to redirect karega
  };

  // ✅ Value object mein error bhi expose kiya taaki UI mein dikha sako
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
