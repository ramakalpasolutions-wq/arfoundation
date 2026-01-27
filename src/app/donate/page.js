// src/app/donate/page.js
"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import copy from "react-useanimations/lib/copy";
import { FaUniversity, FaPhone, FaHandHoldingHeart } from "react-icons/fa";

/* ---------------------------------------
   Inner component (client logic)
---------------------------------------- */
function DonateContent() {
  const searchParams = useSearchParams();
  const paramName = searchParams?.get("name") ?? "";
  const paramPhone = searchParams?.get("phone") ?? "";

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // copy state
  const [copiedField, setCopiedField] = useState("");

  // bank details
  const BANK = {
    accountName: "AR Foundation",
    accountNumber: "50200073935044",
    ifsc: "HDFC0004799",
    bankName: "HDFC BANK",
    branch: "Guntur",
    // upiId: "arfoundation@sbi",
  };

  // Prefill from query params
  useEffect(() => {
    if (paramName) setName(paramName);
    if (paramPhone) setPhone(paramPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validatePhone(p) {
    return typeof p === "string" && p.replace(/[^0-9]/g, "").length >= 7;
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

    alert(
      `Thank you ${name}! 🙏\n\nPlease scan the QR code on this page or use the bank details to complete your donation.`
    );
  }

  function copyToClipboard(text, field) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    });
  }

  return (
    <div className="min-h-screen py-10">
      <section className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <UseAnimations animation={heart} size={70} strokeColor="#f8d46a" />
          <h1 className="text-4xl md:text-6xl font-bold text-glow mt-4">
            Support Our Mission
          </h1>
          <p className="text-[#f5f5f1] max-w-2xl mx-auto mt-4">
            Your generosity helps AR Foundation create lasting change across
            communities in India.
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Donate + QR */}
          <form
            onSubmit={handleSubmit}
            className="glass-card p-6 md:p-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <FaHandHoldingHeart className="text-3xl text-[#f8d46a]" />
              <h2 className="text-2xl font-bold text-[#f7e7b7]">
                Donate via QR
              </h2>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center">
              <div className="relative p-4 rounded-2xl bg-black/40 border border-[#c9a35e]/30">
                <img
                  src="/turst-logo.webp" // replace with actual QR image
                  alt="Donate QR"
                  className="w-64 h-64 bg-white p-2 rounded-xl"
                />
              </div>
              <p className="mt-3 text-sm text-[#d5c08a] text-center">
                Scan using any UPI app to donate securely
              </p>
            </div>

          

            <a
              href="/contact"
              className="flex items-center justify-center gap-2 text-[#f8d46a] hover:underline"
            >
              <FaPhone /> Need Help?
            </a>
          </form>

          {/* RIGHT: Bank Details */}
          <aside className="glass-card p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FaUniversity className="text-3xl text-[#f8d46a]" />
              <h2 className="text-2xl font-bold text-[#f7e7b7]">
                Bank Details
              </h2>
            </div>

            {[
              ["Account Name", BANK.accountName, "accountName"],
              ["Account Number", BANK.accountNumber, "accountNumber"],
              ["IFSC Code", BANK.ifsc, "ifsc"],
              ["UPI ID", BANK.upiId, "upiId"],
            ].map(([label, value, key]) => (
              <div
                key={key}
                className="p-4 rounded-xl bg-black/30 border border-[#c9a35e]/20 flex justify-between items-center"
              >
                <div>
                  <div className="text-xs text-[#d5c08a]">{label}</div>
                  <div className="font-mono text-[#f5f5f1]">{value}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(value, key)}
                  className="p-2"
                >
                  {copiedField === key ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <UseAnimations
                      animation={copy}
                      size={20}
                      strokeColor="#f8d46a"
                    />
                  )}
                </button>
              </div>
            ))}

            <div className="text-sm text-[#d5c08a]">
              {BANK.bankName} — {BANK.branch}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------
   REQUIRED default export with Suspense
---------------------------------------- */
export default function DonatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#f8d46a]">
          Loading donation page...
        </div>
      }
    >
      <DonateContent />
    </Suspense>
  );
}
