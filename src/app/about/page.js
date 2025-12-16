// src/app/about/page.js
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import infinity from "react-useanimations/lib/infinity";
import plusToX from "react-useanimations/lib/plusToX";
import arrowDown from "react-useanimations/lib/arrowDown";
import { FaImages, FaArrowRight, FaHandHoldingHeart, FaUsers, FaEye, FaBullseye, FaStar, FaAward } from "react-icons/fa";

export default function About() {
  const [visionOpen, setVisionOpen] = useState(true);
  const [missionOpen, setMissionOpen] = useState(false);

const coreValues = [
    {
      icon: FaHandHoldingHeart,
      title: "Compassion",
      desc: "We serve with genuine empathy, dignity, and unwavering commitment to those in need.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: FaUsers,
      title: "Impact Driven",
      desc: "Focused on creating measurable, sustainable change through impact-based programs.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaStar,
      title: "Transparency",
      desc: "Maintaining complete openness with full accountability in every operation and decision.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: FaAward,
      title: "Excellence",
      desc: "Delivering world-class programs with innovation, efficiency, and highest standards.",
      color: "from-green-500 to-emerald-500",
    },
  ];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* HEADING */}
       
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animated-text text-glow">
            About AR Foundation
          </h1>

          <p className="text-lg md:text-xl text-[#f5f5f1] max-w-3xl mx-auto leading-relaxed mb-4">
            Empowering communities through compassion, education, and sustainable development
          </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card p-6 md:p-8 mb-12 border-2 border-[#c9a35e]/30"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-[#f5f5f1] text-base md:text-lg leading-relaxed mb-4">
              <strong className="text-[#f8d46a]">AR Foundation</strong> is a registered non-profit organization dedicated to creating lasting positive change in the lives of underprivileged communities across India. Since our establishment, we have been committed to uplifting those in need through comprehensive programs spanning education, healthcare, food security, and social welfare.
            </p>

            <p className="text-[#f5f5f1] text-base md:text-lg leading-relaxed mb-4">
              Our journey began with a simple yet powerful vision: <span className="text-[#f8d46a] font-semibold">to build a society where every individual has access to basic human rights—education, healthcare, dignity, and opportunity</span>. Today, we work tirelessly across rural and urban areas, implementing sustainable programs that address immediate needs while fostering long-term community development.
            </p>

            <p className="text-[#f5f5f1] text-base md:text-lg leading-relaxed">
              Through partnerships with local communities, government bodies, and dedicated volunteers, AR Foundation continues to expand its reach, touching thousands of lives and creating ripples of positive change that extend far beyond our direct interventions.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Mobile Accordion */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setVisionOpen((s) => !s)}
                className="w-full glass-card p-5 flex items-center justify-between group"
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <FaEye className="text-3xl text-[#f8d46a]" />
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-[#f7e7b7]">Our Vision</h3>
                    <p className="text-xs text-[#d5c08a] mt-1">
                      Tap to {visionOpen ? "collapse" : "expand"}
                    </p>
                  </div>
                </div>
                <UseAnimations
                  animation={plusToX}
                  size={28}
                  strokeColor="#f8d46a"
                  reverse={visionOpen}
                />
              </motion.button>

              <AnimatePresence>
                {visionOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 glass-card p-5 space-y-3 border-l-4 border-[#f8d46a]">
                      <p className="text-[#f5f5f1] text-sm leading-relaxed">
                        To build a <strong className="text-[#f8d46a]">compassionate and empowered society</strong> where every individual—irrespective of economic or social background—has access to quality education, comprehensive healthcare, personal security, and human dignity.
                      </p>
                      <p className="text-[#f5f5f1] text-sm leading-relaxed">
                        Our vision extends beyond immediate relief; we aim to create <strong className="text-[#f8d46a]">self-reliant communities</strong> that can sustain their own growth and prosperity for generations to come.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Card */}
            <div className="hidden lg:block h-full">
              <motion.div
                className="glass-card p-8 h-full group hover-lift"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="p-4 rounded-2xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20"
                    whileHover={{ rotate: 180, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FaEye className="text-4xl text-[#f8d46a]" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-[#f7e7b7] group-hover:text-[#f8d46a] transition-colors">
                    Our Vision
                  </h3>
                </div>
                <div className="space-y-4 text-[#f5f5f1]">
                  <p className="leading-relaxed">
                    To build a <strong className="text-[#f8d46a]">compassionate and empowered society</strong> where every individual—irrespective of economic or social background—has access to quality education, comprehensive healthcare, personal security, and human dignity.
                  </p>
                  <p className="leading-relaxed">
                    Our vision extends beyond immediate relief; we aim to create <strong className="text-[#f8d46a]">self-reliant communities</strong> that can sustain their own growth and prosperity for generations to come.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* MISSION CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Mobile Accordion */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setMissionOpen((s) => !s)}
                className="w-full glass-card p-5 flex items-center justify-between group"
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <FaBullseye className="text-3xl text-[#f8d46a]" />
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-[#f7e7b7]">Our Mission</h3>
                    <p className="text-xs text-[#d5c08a] mt-1">
                      Tap to {missionOpen ? "collapse" : "expand"}
                    </p>
                  </div>
                </div>
                <UseAnimations
                  animation={plusToX}
                  size={28}
                  strokeColor="#f8d46a"
                  reverse={missionOpen}
                />
              </motion.button>

              <AnimatePresence>
                {missionOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 glass-card p-5 space-y-2 border-l-4 border-[#f8d46a]">
                      {[
                        "Deliver accessible healthcare through medical camps, free checkups, and health awareness programs",
                        "Empower youth through education scholarships, skill development, and mentorship programs",
                        "Provide essential support including nutritious food, clothing, and emergency relief services",
                        "Foster community growth through cultural initiatives, sports programs, and youth engagement",
                        "Drive rural development via sanitation projects, clean water access, and environmental conservation",
                        "Uphold the highest standards of transparency, accountability, and ethical conduct in all operations",
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-3 text-[#f5f5f1] text-sm"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <span className="text-[#f8d46a] text-lg mt-0.5">✓</span>
                          <span className="leading-relaxed">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Card */}
            <div className="hidden lg:block h-full">
              <motion.div
                className="glass-card p-8 h-full group hover-lift"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="p-4 rounded-2xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20"
                    whileHover={{ rotate: 180, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FaBullseye className="text-4xl text-[#f8d46a]" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-[#f7e7b7] group-hover:text-[#f8d46a] transition-colors">
                    Our Mission
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    "Deliver accessible healthcare through medical camps, free checkups, and health awareness programs",
                    "Empower youth through education scholarships, skill development, and mentorship programs",
                    "Provide essential support including nutritious food, clothing, and emergency relief services",
                    "Foster community growth through cultural initiatives, sports programs, and youth engagement",
                    "Drive rural development via sanitation projects, clean water access, and environmental conservation",
                    "Uphold the highest standards of transparency, accountability, and ethical conduct in all operations",
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-start gap-3 text-[#f5f5f1]"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-[#f8d46a] text-xl mt-0.5">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* CORE VALUES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f7e7b7] mb-4">
              Our Core Values
            </h2>
            <p className="text-[#f5f5f1] max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="glass-card p-6 group hover-lift text-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                  />
                  <motion.div
                    className="inline-block p-4 rounded-2xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20 mb-4"
                    whileHover={{ rotate: 180, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon className="text-4xl text-[#f8d46a]" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#f7e7b7] mb-3 group-hover:text-[#f8d46a] transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-[#f5f5f1] text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* GALLERY SECTION (Replacing Milestones) */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f7e7b7] mb-4">
              Our Journey in Pictures
            </h2>
            <p className="text-[#f5f5f1] max-w-2xl mx-auto">
              Capturing moments of change and impact
            </p>
          </div> */}

          {/* <div className="glass-card p-6 md:p-8"> */}
            {/* <div className="space-y-6"> */}
              {/* Photo Grid */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { src: "/images/gallery-1.jpg", alt: "Community Event 1" },
                  { src: "/images/gallery-2.jpg", alt: "Education Program" },
                  { src: "/images/gallery-3.jpg", alt: "Healthcare Initiative" },
                  { src: "/images/gallery-4.jpg", alt: "Cultural Celebration" },
                ].map((photo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + idx * 0.1, type: "spring" }}
                    className="relative overflow-hidden rounded-xl group cursor-pointer border-2 border-[#c9a35e]/20 hover:border-[#f8d46a]/60 transition-all duration-300"
                    whileHover={{ y: -8 }}
                  >
                    <div className="aspect-square bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                    </div> */}
                    {/* Overlay */}
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                      <span className="text-white text-xs md:text-sm font-semibold text-center">
                        {photo.alt}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div> */}

              {/* View Gallery Button */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center pt-4"
              >
                <motion.a
                  href="/gallery"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#c9a35e] to-[#f8d46a] text-black font-bold text-lg shadow-2xl hover:shadow-[#f8d46a]/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaImages className="text-xl" />
                  <span>Explore Full Gallery</span>
                  <FaArrowRight className="text-lg" />
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div> */}

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="glass-card p-8 md:p-12 text-center border-2 border-[#c9a35e]/30"
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <UseAnimations animation={infinity} size={60} strokeColor="#f8d46a" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-[#f7e7b7] mb-4">
            Join Our Mission
          </h2>

          <p className="text-lg text-[#f5f5f1] mb-8 max-w-2xl mx-auto">
            Together, we can create lasting change. Every contribution, every volunteer hour, and every act of kindness brings us closer to our vision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/donate"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#f8d46a] to-[#c9a35e] text-black font-bold text-lg shadow-2xl"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <UseAnimations animation={heart} size={28} strokeColor="#000" />
              <span>Support Us</span>
            </motion.a>

            <motion.a
              href="/contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-[#c9a35e] text-[#f7e7b7] font-bold text-lg hover:bg-[#c9a35e]/20 backdrop-blur-sm transition-all duration-300"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <span>Get Involved</span>
              <UseAnimations animation={arrowDown} size={24} strokeColor="#f7e7b7" />
            </motion.a>
          </div>
        </motion.div>

        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-[#f8d46a]/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#c9a35e]/5 rounded-full blur-3xl"
            animate={{
              scale: [1.15, 1, 1.15],
              opacity: [0.3, 0.5, 0.3],
              x: [0, -30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 18, repeat: Infinity }}
          />
        </div>
      </section>
    </div>
  );
}
