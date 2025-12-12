"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import UseAnimations from "react-useanimations";
import activity from "react-useanimations/lib/activity";
import { FaHandHoldingHeart, FaUserMd, FaUtensils, FaGraduationCap } from "react-icons/fa";

// safe image URL helper — returns null if no usable URL
function getImgUrlSafe(img) {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img;
  return img.optimized || img.original || img.thumb || null;
}

function PhotoCarousel({ slides, interval = 3000, desktopHeight = "65vh", showIndicators = true }) {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);
  const timerRef = useRef(null);
  const [height, setHeight] = useState(desktopHeight);

  useEffect(() => {
    function applyHeight() {
      const w = window.innerWidth;
      if (w < 640) setHeight("45vh");
      else if (w < 1024) setHeight("55vh");
      else setHeight(desktopHeight);
    }
    applyHeight();
    window.addEventListener("resize", applyHeight);
    return () => window.removeEventListener("resize", applyHeight);
  }, [desktopHeight]);

  const safeSlides = Array.isArray(slides)
    ? slides
      .map((s) => {
        if (typeof s === "string") return s;
        const url = getImgUrlSafe(s);
        return url;
      })
      .filter(Boolean)
    : [];

  useEffect(() => {
    if (running) startTimer();
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, running, safeSlides.length]);

  function startTimer() {
    stopTimer();
    if (!running || safeSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((s) => (s + 1) % safeSlides.length);
    }, interval);
  }

  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function pause() {
    setRunning(false);
    setTimeout(() => setRunning(true), 1000);
  }

  function prev() {
    if (safeSlides.length === 0) return;
    setIndex((s) => (s - 1 + safeSlides.length) % safeSlides.length);
    pause();
  }
  function next() {
    if (safeSlides.length === 0) return;
    setIndex((s) => (s + 1) % safeSlides.length);
    pause();
  }
  function goTo(i) {
    setIndex(i);
    pause();
  }

  if (!safeSlides || safeSlides.length === 0) return null;

  return (
    <motion.section
      className="relative w-full overflow-hidden select-none rounded-3xl shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Gradient overlay for better text readability */}
      <div className="absolute  inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-[5] pointer-events-none rounded-3xl" />

      <div className="relative w-full" style={{ height }}>
        {safeSlides.map((src, i) => {
          return (
            <motion.div
              key={`${src || "slide"}-${i}`}
              className={`absolute inset-0 flex items-center justify-center ${index === i ? "z-10" : "z-0"}`}
              style={{ pointerEvents: "none" }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === i ? 1 : 0
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {src ? (
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-contain"  // ✅ This shows the full image
                  draggable={false}
                />
              ) : null}
            </motion.div>
          );
        })}
      </div>


      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-8 pointer-events-none z-20">
        <motion.button
          className="pointer-events-auto bg-gradient-to-r from-[#c9a35e]/80 to-[#f8d46a]/80 backdrop-blur-md text-white p-4 rounded-full shadow-2xl border border-white/20"
          onClick={prev}
          aria-label="previous"
          whileHover={{ scale: 1.15, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <motion.button
          className="pointer-events-auto bg-gradient-to-r from-[#f8d46a]/80 to-[#c9a35e]/80 backdrop-blur-md text-white p-4 rounded-full shadow-2xl border border-white/20"
          onClick={next}
          aria-label="next"
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Animated Indicators */}
      {showIndicators && (
        <div className="absolute left-0 right-0 bottom-8 flex justify-center gap-3 px-4 z-20">
          {safeSlides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all backdrop-blur-sm ${index === i
                ? "w-12 h-3 bg-gradient-to-r from-[#c9a35e] to-[#f8d46a]"
                : "w-3 h-3 bg-white/40 hover:bg-white/60"
                }`}
              aria-label={`go-to-${i + 1}`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              animate={{ scale: index === i ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

export default function Home() {
  const localFallback = [
    "/mnt/data/b375b71c-66e4-4f0a-abab-3898b8ecec22.png",
    "/mnt/data/caaf9965-4a8f-47cf-b417-aa7208ce3578.png",
  ];

  const [slides, setSlides] = useState(localFallback);
  const [galleryForHome, setGalleryForHome] = useState({});
  const [selectedYoutube, setSelectedYoutube] = useState(null);

  // Refs for scroll animations
  const heroTextRef = useRef(null);
  const programsRef = useRef(null);
  const youtubeRef = useRef(null);
  const statsRef = useRef(null);

  const isHeroTextInView = useInView(heroTextRef, { once: true, margin: "-50px" });
  const isProgramsInView = useInView(programsRef, { once: true, margin: "-100px" });
  const isYoutubeInView = useInView(youtubeRef, { once: true, margin: "-50px" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  useEffect(() => {
    let mounted = true;

    async function loadGalleryData() {
      try {
        const res = await fetch("/api/event-photos");
        const text = await res.text().catch(() => "");
        let body;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          body = null;
        }

        if (!res.ok) {
          console.warn("Failed to fetch gallery:", body || text);
          return;
        }

        const rawSliderArr = (body && (body.slider || body.home_slider || [])) || [];

        const mapped = rawSliderArr
          .map((item) => {
            const url = getImgUrlSafe(item);
            return url;
          })
          .filter((u) => typeof u === "string" && u.trim().length > 0);

        if (mounted && mapped.length > 0) setSlides(mapped);

        if (mounted) {
          let rawGallery = body.gallery ?? body ?? {};
          if (typeof rawGallery !== "object") rawGallery = {};

          const copy = { ...rawGallery };

          // remove only slider keys but DO NOT clear other folders
          for (const key of ["home_slider", "homeSlider", "home-slider", "slider"]) {
            if (key in copy) delete copy[key];
          }

          // keep YouTube folders
          setGalleryForHome(copy);

        }
      } catch (e) {
        console.warn("Could not load home_slider, using fallback slides", e);
      }
    }

    loadGalleryData();
    return () => {
      mounted = false;
    };
  }, []);

  const allYoutubeItems =
    Object.values(galleryForHome || {})
      .flat()
      .filter(item => item?.youtube && item?.url)
      .map(item => item.url);


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const programs = [
    {
      title: "Education Support",
      desc: "Helping children continue their education with resources and scholarships.",
      icon: FaGraduationCap,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Healthcare Camps",
      desc: "Free medical checkups and health awareness drives in rural areas.",
      icon: FaUserMd,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Food Distribution",
      desc: "Providing nutritious meals to families in need.",
      icon: FaUtensils,
      color: "from-orange-500 to-red-500"
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO: sliding images */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <PhotoCarousel slides={slides} desktopHeight="65vh" />
      </div>

      {/* Hero Text Section with Floating Elements */}
      <motion.section
        ref={heroTextRef}
        className="py-12 sm:py-16 relative"
        initial="hidden"
        animate={isHeroTextInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-[#f8d46a]/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#c9a35e]/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 relative z-10">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-[#f7e7b7] leading-tight"
            variants={itemVariants}
          >
            AR Foundation
          </motion.h1>

          <motion.div
            className="relative inline-block mb-6"
            variants={itemVariants}
          >
            <h2 className="hero-caption text-2xl sm:text-3xl md:text-4xl mb-4 text-[#f5f5f1] font-light">
              Empowering Lives Through Compassion
            </h2>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a35e] to-transparent"
              initial={{ scaleX: 0 }}
              animate={isHeroTextInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.div>

          <motion.p
            className="text-[#f5f5f1] text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            EV Foundation supports communities through education, healthcare, and empowerment initiatives.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/donate"
                className="group relative w-full sm:w-auto text-center bg-gradient-to-r from-[#f8d46a] to-[#f8d46a] text-black px-8 py-4 rounded-full text-lg font-bold shadow-2xl inline-flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Donate Now</span>
                <FaHandHoldingHeart className="relative z-10 text-xl" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#fff3c4] to-[#f8d46a]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/about"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-[#c9a35e] font-bold text-[#f5f5f1] hover:bg-[#c9a35e]/20 backdrop-blur-sm transition-all duration-300 text-lg shadow-lg"
              >
                <span>About Us</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Stats Section */}
      {/* <motion.section 
        ref={statsRef}
        className="py-12 sm:py-16 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm"
        initial="hidden"
        animate={isStatsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
            variants={containerVariants}
          >
            {[
              { number: "10K+", label: "Lives Impacted", icon: "👥" },
              { number: "500+", label: "Programs", icon: "🎯" },
              { number: "50+", label: "Communities", icon: "🏘️" },
              { number: "24/7", label: "Support", icon: "💙" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-6 rounded-2xl bg-black/30 backdrop-blur-md border border-[#c9a35e]/20 hover:border-[#c9a35e]/50 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-3xl sm:text-4xl font-bold text-[#f8d46a] mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-[#f5f5f1]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section> */}

      {/* YouTube Videos Section - Always visible */}
      <section ref={youtubeRef} className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#f7e7b7] mb-4">
            YouTube Videos
          </h2>
          <p className="text-[#f5f5f1] text-lg max-w-2xl mx-auto">
            Watch how we're making a difference in communities
          </p>
        </motion.div>

        {allYoutubeItems.length === 0 ? (
          <motion.div
            className="text-center text-base text-slate-400 mb-6 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            No YouTube videos yet
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="visible"
            animate="visible"
          >
            {allYoutubeItems.map((url, idx) => {
              let embed = url;
              try {
                const u = new URL(url);
                if (u.hostname.includes("youtube.com")) {
                  const v = u.searchParams.get("v");
                  if (v) embed = `https://www.youtube.com/embed/${v}`;
                } else if (u.hostname.includes("youtu.be")) {
                  const id = u.pathname.replace("/", "");
                  embed = `https://www.youtube.com/embed/${id}`;
                }
              } catch (e) { }

              return (
                <motion.div
                  key={idx}
                  className="group relative p-1 rounded-2xl bg-gradient-to-br from-[#c9a35e] to-[#f8d46a]"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <div className="p-5 rounded-2xl bg-black/90 backdrop-blur-md h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-semibold text-[#f7e7b7]">Video {idx + 1}</span>
                    </div>
                    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                      <iframe
                        title={`yt-${idx}`}
                        src={embed}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>


      {/* YouTube Modal (kept for compatibility) */}
      {selectedYoutube && (
        <motion.section
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedYoutube(null)}
        >
          <motion.div
            className="max-w-5xl w-full"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#f7e7b7]">Embedded Video</h3>
              <motion.button
                onClick={() => setSelectedYoutube(null)}
                className="px-6 py-3 bg-[#c9a35e] hover:bg-[#f8d46a] text-white rounded-full font-bold transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-[#c9a35e]">
              <iframe
                title="embedded-youtube"
                src={selectedYoutube}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* Programs Section with Enhanced Cards */}
      <section
        ref={programsRef}
        className="py-16 sm:py-20 relative"
        style={{ background: "var(--background)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <UseAnimations animation={activity} size={64} strokeColor="#f8d46a" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 text-[#f7e7b7]">
              Our Key Programs
            </h2>
            <p className="text-[#f5f5f1] text-lg max-w-2xl mx-auto">
              Comprehensive initiatives designed to create lasting impact
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isProgramsInView ? "visible" : "hidden"}
          >
            {programs.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  className="group relative rounded-3xl shadow-2xl overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ y: -15 }}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

                  {/* Content */}
                  <div className="relative p-8 bg-black/50 backdrop-blur-xl border border-[#c9a35e]/30 group-hover:border-[#c9a35e]/60 transition-all duration-300 h-full">
                    <motion.div
                      className="mb-6 inline-block p-4 rounded-2xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="text-5xl text-[#f8d46a]" />
                    </motion.div>

                    <h3 className="font-serif text-2xl sm:text-3xl mb-4 text-[#f7e7b7] group-hover:text-[#f8d46a] transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-[#f5f5f1] text-base leading-relaxed">
                      {p.desc}
                    </p>

                    {/* Hover effect indicator */}
                    <motion.div
                      className="mt-6 flex items-center justify-center gap-2 text-[#c9a35e] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <span>Learn More</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isProgramsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/programs"
                className="inline-flex items-center gap-3 mt-6 text-[#f5f5f1] bg-gradient-to-r from-[#c9a35e]/20 to-[#f8d46a]/20 backdrop-blur-sm border-2 border-[#c9a35e] px-8 py-4 rounded-full hover:from-[#c9a35e]/30 hover:to-[#f8d46a]/30 transition-all duration-300 font-bold text-lg shadow-lg"
              >
                <span>View All Programs</span>
                <motion.svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
