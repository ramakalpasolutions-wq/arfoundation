// src/app/contact/page.js
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import mail from "react-useanimations/lib/mail";
import loading2 from "react-useanimations/lib/loading2";
import checkBox from "react-useanimations/lib/checkBox";
import alertCircle from "react-useanimations/lib/alertCircle";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" }); // 'loading', 'success', 'error'

  function handleChange(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending your message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus({ 
        type: "success", 
        message: data.message || "Message sent successfully! We'll get back to you soon." 
      });
      setForm({ name: "", email: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 5000);
    } catch (error) {
      setStatus({ 
        type: "error", 
        message: error.message || "Failed to send message. Please try again." 
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setStatus({ type: "", message: "" });
      }, 5000);
    }
  }

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: "Email",
      value: "arfoundation1978@gmail.com",
      link: "mailto:arfoundation1978@gmail.com",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaPhone,
      label: "Phone",
      value: "+91 9000483399",
      link: "tel:+919000483399",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FaMapMarkerAlt,
      label: "Address",
      value: "82-5-430,Sampath nagar 5th line,Guntur,522004",
      link: "#",
      color: "from-orange-500 to-red-500",
    },
    
  ];

  return (
    <div className="min-h-screen  py-8 sm:py-12">
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            <UseAnimations animation={mail} size={80} strokeColor="#f8d46a" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animated-text text-glow">
            Contact Us
          </h1>

          <p className="text-lg md:text-xl text-[#f5f5f1] max-w-2xl mx-auto leading-relaxed">
            Reach out for partnership, volunteering, or questions. We will respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#f7e7b7] mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.label 
                className="block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-sm font-semibold text-[#d5c08a] mb-2 block">
                  Name *
                </span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  suppressHydrationWarning
                  className="w-full rounded-xl bg-black/30 border-2 border-[#c9a35e]/30 px-4 py-3 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
                  placeholder="Your name"
                />
              </motion.label>

              <motion.label 
                className="block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-sm font-semibold text-[#d5c08a] mb-2 block">
                  Email *
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  suppressHydrationWarning
                  className="w-full rounded-xl bg-black/30 border-2 border-[#c9a35e]/30 px-4 py-3 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
                  placeholder="you@example.com"
                />
              </motion.label>

              <motion.label 
                className="block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-sm font-semibold text-[#d5c08a] mb-2 block">
                  Message *
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  suppressHydrationWarning
                  className="w-full rounded-xl bg-black/30 border-2 border-[#c9a35e]/30 px-4 py-3 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300 resize-none"
                  placeholder="How can we help you?"
                />
              </motion.label>

              {/* Status Messages */}
              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                      status.type === "success"
                        ? "bg-green-500/20 border border-green-500/50 text-green-200"
                        : status.type === "error"
                        ? "bg-red-500/20 border border-red-500/50 text-red-200"
                        : "bg-blue-500/20 border border-blue-500/50 text-blue-200"
                    }`}
                  >
                    {status.type === "loading" && (
                      <UseAnimations animation={loading2} size={24} strokeColor="#60a5fa" />
                    )}
                    {status.type === "success" && (
                      <UseAnimations animation={checkBox} size={24} strokeColor="#34d399" />
                    )}
                    {status.type === "error" && (
                      <UseAnimations animation={alertCircle} size={24} strokeColor="#f87171" />
                    )}
                    <span className="text-sm font-medium">{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  type="submit"
                  disabled={status.type === "loading"}
                  className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-[#c9a35e] to-[#f8d46a] text-black font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: status.type === "loading" ? 1 : 1.05 }}
                  whileTap={{ scale: status.type === "loading" ? 1 : 0.95 }}
                  suppressHydrationWarning
                >
                  {status.type === "loading" ? (
                    <>
                      <UseAnimations animation={loading2} size={24} strokeColor="#000" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <UseAnimations animation={mail} size={24} strokeColor="#000" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                <motion.a
                  href="/donate"
                  className="px-6 py-3 rounded-full border-2 border-[#c9a35e] text-[#f7e7b7] font-bold text-lg hover:bg-[#c9a35e]/20 transition-all duration-300 text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Donate
                </motion.a>
              </div>
            </form>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#f7e7b7] mb-6">
              Get in Touch
            </h2>

            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="glass-card p-5 flex items-center gap-4 group hover-lift"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${info.color} blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
                    <div className="relative p-3 rounded-xl bg-black/30 border border-[#c9a35e]/30">
                      <Icon className="text-2xl text-[#f8d46a]" />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <div className="text-sm text-[#d5c08a] mb-1">{info.label}</div>
                    <div className="text-[#f7e7b7] font-semibold group-hover:text-[#f8d46a] transition-colors">
                      {info.value}
                    </div>
                  </div>

                               </motion.a>
              );
            })}

            {/* Map/Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card p-6 mt-6"
            >
              <h3 className="text-xl font-bold text-[#f7e7b7] mb-4">
                Why Contact Us?
              </h3>
              <ul className="space-y-3 text-[#f5f5f1]">
                <motion.li 
                  className="flex items-start gap-3"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-[#f8d46a] text-xl">✓</span>
                  <span>Partnership opportunities</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-3"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-[#f8d46a] text-xl">✓</span>
                  <span>Volunteer programs</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-3"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-[#f8d46a] text-xl">✓</span>
                  <span>Donation inquiries</span>
                </motion.li>
                <motion.li 
                  className="flex items-start gap-3"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-[#f8d46a] text-xl">✓</span>
                  <span>General questions</span>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div
            className="absolute top-20 right-10 w-72 h-72 bg-[#f8d46a]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
      </section>
    </div>
  );
}
