// src/app/donate/page.js
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import copy from "react-useanimations/lib/copy";
import { FaUniversity, FaPhone, FaHandHoldingHeart, FaCreditCard } from "react-icons/fa";

// Separate component that uses useSearchParams
function DonateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramName = searchParams?.get("name") ?? "";
  const paramPhone = searchParams?.get("phone") ?? "";

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // bank copy state
  const [copiedField, setCopiedField] = useState("");

  // bank details (replace with real values)
  const BANK = {
    accountName: "AR Foundation",
    accountNumber: "1234567890",
    ifsc: "SBIN0000123",
    bankName: "State Bank of India",
    branch: "Guntur",
    upiId: "arfoundation@sbi",
  };

  // prefill once on mount
  useEffect(() => {
    if (paramName) setName(paramName);
    if (paramPhone) setPhone(paramPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validatePhone(p) {
    return typeof p === "string" && p.replace(/[^0-9+]/g, "").length >= 7;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!validatePhone(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    setSubmitted(true);

    // Build query params
    const params = new URLSearchParams();
    params.set("name", name.trim());
    params.set("phone", phone.trim());
    if (amount && String(amount).trim()) params.set("amount", String(amount).trim());

    // Redirect to QR page
    router.push(`/donate/qr?${params.toString()}`);
  }

  function copyToClipboard(text, fieldName) {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(""), 2000);
      },
      () => {
        alert("Could not copy. Please copy manually.");
      }
    );
  }

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <UseAnimations animation={heart} size={70} strokeColor="#f8d46a" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 animated-text text-glow">
            Support Our Mission
          </h1>

          <p className="text-lg text-[#f5f5f1] max-w-2xl mx-auto leading-relaxed">
            Thank you for supporting AR Foundation. Your generosity helps us create lasting change in communities across India.
          </p>
        </motion.div>

        {/* Grid: form + bank card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT: Donate form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20">
                  <FaHandHoldingHeart className="text-3xl text-[#f8d46a]" />
                </div>
                <h2 className="text-2xl font-bold text-[#f7e7b7]">Donate via QR</h2>
              </div>

<div>
  
</div>
                <motion.a
                  href="/contact"
                  className="px-6 py-3 rounded-full border-2 border-[#c9a35e] text-[#f7e7b7] font-bold hover:bg-[#c9a35e]/20 transition-all duration-300 text-center flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPhone />
                  <span>Need Help?</span>
                </motion.a>
            </form>
          </motion.div>

          {/* RIGHT: Bank details card */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20">
                <FaUniversity className="text-3xl text-[#f8d46a]" />
              </div>
              <h2 className="text-2xl font-bold text-[#f7e7b7]">Bank Details</h2>
            </div>

            <div className="space-y-4">
              {/* Account Name */}
              <motion.div
                className="p-4 rounded-xl bg-black/30 border border-[#c9a35e]/20 hover:border-[#f8d46a]/40 transition-all duration-300"
                whileHover={{ x: 3 }}
              >
                <div className="text-xs text-[#d5c08a] mb-1">Account Name</div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-[#f5f5f1]">{BANK.accountName}</div>
                  <motion.button
                    onClick={() => copyToClipboard(BANK.accountName, "accountName")}
                    className="p-2 hover:bg-[#c9a35e]/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedField === "accountName" ? (
                      <span className="text-green-400 text-sm">✓</span>
                    ) : (
                      <UseAnimations animation={copy} size={20} strokeColor="#c9a35e" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Account Number */}
              <motion.div
                className="p-4 rounded-xl bg-black/30 border border-[#c9a35e]/20 hover:border-[#f8d46a]/40 transition-all duration-300"
                whileHover={{ x: 3 }}
              >
                <div className="text-xs text-[#d5c08a] mb-1">Account Number</div>
                <div className="flex items-center justify-between">
                  <div className="font-mono font-semibold text-[#f5f5f1]">{BANK.accountNumber}</div>
                  <motion.button
                    onClick={() => copyToClipboard(BANK.accountNumber, "accountNumber")}
                    className="p-2 hover:bg-[#c9a35e]/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedField === "accountNumber" ? (
                      <span className="text-green-400 text-sm">✓</span>
                    ) : (
                      <UseAnimations animation={copy} size={20} strokeColor="#c9a35e" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* IFSC Code */}
              <motion.div
                className="p-4 rounded-xl bg-black/30 border border-[#c9a35e]/20 hover:border-[#f8d46a]/40 transition-all duration-300"
                whileHover={{ x: 3 }}
              >
                <div className="text-xs text-[#d5c08a] mb-1">IFSC Code</div>
                <div className="flex items-center justify-between">
                  <div className="font-mono font-semibold text-[#f5f5f1]">{BANK.ifsc}</div>
                  <motion.button
                    onClick={() => copyToClipboard(BANK.ifsc, "ifsc")}
                    className="p-2 hover:bg-[#c9a35e]/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedField === "ifsc" ? (
                      <span className="text-green-400 text-sm">✓</span>
                    ) : (
                      <UseAnimations animation={copy} size={20} strokeColor="#c9a35e" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Bank / Branch */}
              <div className="p-4 rounded-xl bg-black/30 border border-[#c9a35e]/20">
                <div className="text-xs text-[#d5c08a] mb-1">Bank / Branch</div>
                <div className="font-semibold text-[#f5f5f1]">
                  {BANK.bankName} — {BANK.branch}
                </div>
              </div>

              {/* UPI ID */}
              <motion.div
                className="p-4 rounded-xl bg-linear-to-br from-[#c9a35e]/10 to-[#f8d46a]/10 border-2 border-[#f8d46a]/40"
                whileHover={{ x: 3 }}
              >
                <div className="text-xs text-[#f8d46a] mb-1">UPI ID</div>
                <div className="flex items-center justify-between">
                  <div className="font-mono font-semibold text-[#f5f5f1]">{BANK.upiId}</div>
                  <motion.button
                    onClick={() => copyToClipboard(BANK.upiId, "upiId")}
                    className="p-2 hover:bg-[#f8d46a]/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedField === "upiId" ? (
                      <span className="text-green-400 text-sm">✓</span>
                    ) : (
                      <UseAnimations animation={copy} size={20} strokeColor="#f8d46a" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </div>
      </section>
    </div>
  );
}

// Main component with Suspense wrapper
export default function Donate() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#f8d46a] text-xl">Loading...</div>
      </div>
    }>
      <DonateContent />
    </Suspense>
  );
}
