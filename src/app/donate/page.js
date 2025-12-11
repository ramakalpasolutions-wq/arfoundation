// src/app/donate/page.js
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import copy from "react-useanimations/lib/copy";
import { FaUniversity, FaPhone, FaHandHoldingHeart, FaCreditCard } from "react-icons/fa";

export default function Donate() {
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
    <div className="min-h-screen  py-8 sm:py-12">
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
                <h2 className="text-2xl font-bold text-[#f7e7b7]">Donate via UPI</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d5c08a] mb-2">
                  Full Name *
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  suppressHydrationWarning
                  className="w-full rounded-xl bg-black/30 border-2 border-[#c9a35e]/30 px-4 py-3 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d5c08a] mb-2">
                  Phone Number *
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  suppressHydrationWarning
                  className="w-full rounded-xl bg-black/30 border-2 border-[#c9a35e]/30 px-4 py-3 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#d5c08a] mb-2">
                  Amount (INR)
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  type="number"
                  min="1"
                  suppressHydrationWarning
                  className="w-full rounded-xl bg-black/30 border-2 border-[#c9a35e]/30 px-4 py-3 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
                />

                {/* Quick amount buttons */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {quickAmounts.map((amt) => (
                    <motion.button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(String(amt))}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        amount === String(amt)
                          ? "bg-gradient-to-r from-[#c9a35e] to-[#f8d46a] text-black"
                          : "bg-black/30 border border-[#c9a35e]/30 text-[#f5f5f1] hover:border-[#f8d46a]/60"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ₹{amt}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  type="submit"
                  disabled={submitted}
                  className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-[#c9a35e] to-[#f8d46a] text-black font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: submitted ? 1 : 1.03, y: submitted ? 0 : -2 }}
                  whileTap={{ scale: submitted ? 1 : 0.98 }}
                  suppressHydrationWarning
                >
                  <FaCreditCard className="text-xl" />
                  <span>{submitted ? "Preparing QR..." : "Donate Now"}</span>
                </motion.button>

                <motion.a
                  href="/contact"
                  className="px-6 py-3 rounded-full border-2 border-[#c9a35e] text-[#f7e7b7] font-bold hover:bg-[#c9a35e]/20 transition-all duration-300 text-center flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPhone />
                  <span>Need Help?</span>
                </motion.a>
              </div>

              {/* <p className="text-xs text-[#d5c08a] text-center">
                Your donation details are secure and will be used only for transaction purposes.
              </p> */}
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
                className="p-4 rounded-xl bg-gradient-to-br from-[#c9a35e]/10 to-[#f8d46a]/10 border-2 border-[#f8d46a]/40"
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

            {/* <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm text-blue-200 leading-relaxed">
                💡 <strong>Tip:</strong> Use the QR code for quick UPI payment, or manually transfer using the bank details above.
              </p>
            </div> */}
          </motion.aside>
        </div>

        {/* Impact Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 glass-card p-6 md:p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-[#f7e7b7] mb-4">Your Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { amount: "₹500", impact: "Provides educational materials for 5 children" },
              { amount: "₹1000", impact: "Sponsors a medical checkup camp" },
              { amount: "₹5000", impact: "Feeds 50 families for a week" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="p-4 rounded-xl bg-black/30 border border-[#c9a35e]/20"
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <div className="text-2xl font-bold text-[#f8d46a] mb-2">{item.amount}</div>
                <div className="text-sm text-[#f5f5f1]">{item.impact}</div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </section>
    </div>
  );
}
