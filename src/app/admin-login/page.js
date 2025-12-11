// src/app/admin-login/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import lock from "react-useanimations/lib/lock";
import loading2 from "react-useanimations/lib/loading2";
import { FaUser, FaLock, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [isMounted, setIsMounted] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    setCredentials({ username: "AR Foundation", password: "" });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API delay for better UX
    setTimeout(() => {
      if (credentials.username === "AR Foundation" && credentials.password === "ARF@2025") {
        localStorage.setItem("isAdmin", "true");
        router.push("/admin/dashboard");
      } else {
        setError("Invalid username or password");
        setShake(true);
        setIsLoading(false);
        setTimeout(() => setShake(false), 500);
      }
    }, 1000);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]">
        <div className="glass-card p-8 text-center">
          <UseAnimations animation={loading2} size={56} strokeColor="#f8d46a" />
          <div className="mt-4 text-[#f5f5f1]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-[#f8d46a]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#c9a35e]/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 md:p-10 backdrop-blur-xl border-2 border-[#c9a35e]/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-block mb-4"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20">
                <FaShieldAlt className="text-5xl text-[#f8d46a]" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-[#f7e7b7] mb-2">Admin Portal</h1>
            <div className="text-sm text-[#d5c08a]">AR Foundation Management System</div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
              >
                <div className="text-sm text-red-400 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-[#d5c08a] mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a35e]">
                  <FaUser className="text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => {
                    setCredentials({ ...credentials, username: e.target.value });
                    setError("");
                  }}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-[#d5c08a] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a35e]">
                  <FaLock className="text-lg" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => {
                    setCredentials({ ...credentials, password: e.target.value });
                    setError("");
                  }}
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c9a35e] hover:text-[#f8d46a] transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r mt-9 from-[#c9a35e] to-[#f8d46a] text-black font-bold text-lg shadow-2xl hover:shadow-[#f8d46a]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <UseAnimations animation={loading2} size={24} strokeColor="#000000ff" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <FaShieldAlt className="text-xl" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Security Notice - FIXED: Changed <p> to <div> */}
          {/* <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <div className="text-xs text-blue-200 text-center flex items-center justify-center gap-2">
              <UseAnimations animation={lock} size={20} strokeColor="#60a5fa" />
              <span>Secure admin access only</span>
            </div>
          </div> */}

          {/* Footer */}
          <div className="mt-6 text-center">
            <motion.a
              href="/"
              className="text-sm text-[#d5c08a] hover:text-[#f8d46a] transition-colors inline-flex items-center gap-2 mt-1"
              whileHover={{ x: -3 }}
            >
              <span>←</span>
              <span>Back to Website</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Floating Info Cards */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <motion.div
            className="glass-card p-4 text-center"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl mb-2">🔐</div>
            <div className="text-xs text-[#d5c08a]">Secure Access</div>
          </motion.div>

          <motion.div
            className="glass-card p-4 text-center"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-xs text-[#d5c08a]">Full Control</div>
          </motion.div>
        </motion.div> */}
      </motion.div>
    </div>
  );
}
