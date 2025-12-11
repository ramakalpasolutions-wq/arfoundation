// src/app/programs/page.js
"use client";

import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";
import activity from "react-useanimations/lib/activity";
import heart from "react-useanimations/lib/heart";
import alertCircle from "react-useanimations/lib/alertCircle";
import arrowDown from "react-useanimations/lib/arrowDown";
import { FaGraduationCap, FaHeartbeat, FaUtensils, FaSeedling } from "react-icons/fa";

export default function Programs() {
  const programs = [
    {
      title: "Education & Scholarships",
      desc: "After-school tutoring, scholarships, and learning resources for children and youth.",
      icon: FaGraduationCap,
      color: "from-blue-500 to-cyan-500",
      emoji: "📚",
      stats: { number: "500+", label: "Students Supported" },
    },
    {
      title: "Healthcare & Medical Camps",
      desc: "Free medical camps, health screenings, and preventive awareness programs.",
      icon: FaHeartbeat,
      color: "from-green-500 to-emerald-500",
      emoji: "⚕️",
      stats: { number: "50+", label: "Medical Camps" },
    },
    {
      title: "Food & Emergency Relief",
      desc: "Regular food distribution, disaster relief, and rehabilitation support.",
      icon: FaUtensils,
      color: "from-orange-500 to-red-500",
      emoji: "🍲",
      stats: { number: "10K+", label: "Meals Distributed" },
    },
    {
      title: "Rural Development",
      desc: "Sanitation, water, livelihood training and community infrastructure projects.",
      icon: FaSeedling,
      color: "from-purple-500 to-pink-500",
      emoji: "🏘️",
      stats: { number: "30+", label: "Communities Reached" },
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const statVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen  py-8 sm:py-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            <UseAnimations animation={activity} size={80} strokeColor="#f8d46a" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animated-text text-glow">
            Our Programs
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-[#f5f5f1] max-w-3xl mx-auto leading-relaxed"
          >
            AR Foundation runs targeted programs designed to create long-term, sustainable impact.
            Each program is community-led and monitored for transparency and measurable outcomes.
          </motion.p>
        </motion.div>

        {/* Impact Stats Banner */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-card p-6 md:p-8 mb-12 border-2 border-[#c9a35e]/30"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🎯", label: "Active Programs", value: "4" },
              { icon: "👥", label: "Lives Impacted", value: "10K+" },
              { icon: "📍", label: "Locations", value: "30+" },
              { icon: "💝", label: "Success Rate", value: "95%" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={statVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="text-center group"
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div 
                  className="text-4xl mb-2"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 3,
                    delay: idx * 0.3
                  }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-2xl md:text-3xl font-bold text-[#f8d46a] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#d5c08a]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* Programs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {programs.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.article
                key={p.title}
                variants={cardVariants}
                className="group relative overflow-hidden"
                whileHover={{ y: -8 }}
              >
                {/* Gradient background that shifts on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Animated border */}
                <div className="absolute inset-0 border-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="glass-card p-6 md:p-8 h-full relative">
                  {/* Icon Section */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className="relative"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${p.color} blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`} />
                      <div className="relative p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-[#c9a35e]/30">
                        <Icon className="text-4xl md:text-5xl text-[#f8d46a]" />
                      </div>
                    </motion.div>

                    <motion.div
                      className="text-5xl"
                      animate={{ 
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatDelay: 2,
                        delay: idx * 0.5
                      }}
                    >
                      {p.emoji}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#f7e7b7] group-hover:text-[#f8d46a] transition-colors duration-300">
                    {p.title}
                  </h3>

                  <p className="text-[#f5f5f1] text-base md:text-lg leading-relaxed mb-6">
                    {p.desc}
                  </p>

                  {/* Stats Badge */}
                  {/* <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#c9a35e]/20 to-[#f8d46a]/20 border border-[#c9a35e]/30 mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <UseAnimations animation={heart} size={20} strokeColor="#f8d46a" />
                    <div className="text-sm">
                      <span className="font-bold text-[#f8d46a]">{p.stats.number}</span>
                      <span className="text-[#d5c08a] ml-1">{p.stats.label}</span>
                    </div>
                  </motion.div> */}

                  {/* CTA Button */}
                  {/* <motion.a
                    href="/programs"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#c9a35e] to-[#f8d46a] text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-300 group/btn"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Learn More</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <UseAnimations animation={arrowDown} size={20} strokeColor="#000" />
                    </motion.div>
                  </motion.a> */}

                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f8d46a]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.article>
            );
          })}
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 md:p-12 border-2 border-[#c9a35e]/30">
            <motion.div
              className="inline-block mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <UseAnimations animation={alertCircle} size={60} strokeColor="#f8d46a" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#f7e7b7] mb-4">
              Want to Make a Difference?
            </h2>

            <p className="text-lg text-[#f5f5f1] mb-8 max-w-2xl mx-auto">
              Your support helps us expand these programs and reach more communities in need.
              Every contribution creates a lasting impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/donate"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#f8d46a] to-[#c9a35e] text-black font-bold text-lg shadow-2xl"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <UseAnimations animation={heart} size={28} strokeColor="#000" />
                <span>Donate Now</span>
              </motion.a>

              <motion.a
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-[#c9a35e] text-[#f7e7b7] font-bold text-lg hover:bg-[#c9a35e]/20 backdrop-blur-sm transition-all duration-300"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Involved</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-[#f8d46a]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#c9a35e]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.3, 1, 1.3],
              opacity: [0.3, 0.6, 0.3],
              x: [0, -50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>
      </section>
    </div>
  );
}
