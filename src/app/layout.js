"use client";

import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 700); // duration of loader

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gradient-to-br from-[#1a1a1a] via-[#3d2b1f] to-[#c9a35e] text-white min-h-screen">

        {/* 🌍 GLOBAL TEXT LOADER */}
        <AnimatePresence>
          {loading && (
            // <motion.div
            //   className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            //   initial={{ opacity: 0 }}
            //   animate={{ opacity: 1 }}
            //   exit={{ opacity: 0 }}
            //   transition={{ duration: 0.25 }}
            // >
            //  <motion.span
            //   className="text-2xl md:text-3xl font-semibold tracking-widest text-[#f8d46a]"
            //   animate={{ opacity: [0.3, 1, 0.3] }}
            //   transition={{
            //     duration: 2.5,
            //     repeat: Infinity,
            //     ease: "easeInOut",
            //   }}
            // >
            //   Loading...<br /> <span className="dots">AR Foundation</span>
            // </motion.span>

            // </motion.div>
            <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="loader-premium horizontal">
          {/* LOGO */}
          <img
            src="/turst-logo (2).webp"   // ← replace with your logo path
            alt="AR Foundation Logo"
            className="loader-logo w-60"
          />

          {/* LOADING TEXT */}
          <span className="loader-loading">
            <span className="dots"></span>
          </span>

          {/* BRAND NAME */}
          <span className="loader-text">AR Foundation</span>

          {/* WAVE */}
          <span className="loader-wave"></span>
        </div>

        </motion.div>

          )}
        </AnimatePresence>

        <Header />

        <main className="min-h-screen pt-24 lg:pt-30">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
