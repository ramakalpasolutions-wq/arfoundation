"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import UseAnimations from "react-useanimations";
import activity from "react-useanimations/lib/activity";
import {
  FaHandHoldingHeart,
  FaUserMd,
  FaUtensils,
  FaGraduationCap,
  FaYoutube,
  FaArrowRight,
} from "react-icons/fa";

// safe image URL helper
function getImgUrlSafe(img) {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img;
  return img.optimized || img.original || img.thumb || null;
}

// ─────────────────────────────────────────
// Photo Carousel
// ─────────────────────────────────────────
function PhotoCarousel({
  slides,
  interval = 3000,
  desktopHeight = "65vh",
  showIndicators = true,
}) {
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
    ? slides.map((s) => (typeof s === "string" ? s : getImgUrlSafe(s))).filter(Boolean)
    : [];

  useEffect(() => {
    if (running) startTimer();
    return () => stopTimer();
  }, [index, running, safeSlides.length]);

  function startTimer() {
    stopTimer();
    if (!running || safeSlides.length <= 1) return;
    timerRef.current = setInterval(
      () => setIndex((s) => (s + 1) % safeSlides.length),
      interval
    );
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
    if (!safeSlides.length) return;
    setIndex((s) => (s - 1 + safeSlides.length) % safeSlides.length);
    pause();
  }
  function next() {
    if (!safeSlides.length) return;
    setIndex((s) => (s + 1) % safeSlides.length);
    pause();
  }
  function goTo(i) {
    setIndex(i);
    pause();
  }

  if (!safeSlides.length) return null;

  return (
    <motion.section
      className="relative w-full overflow-hidden select-none rounded-2xl sm:rounded-3xl shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-[5] pointer-events-none rounded-2xl sm:rounded-3xl" />

      <div className="relative w-full" style={{ height }}>
        {safeSlides.map((src, i) => (
          <motion.div
            key={`${src}-${i}`}
            className={`absolute inset-0 flex items-center justify-center ${
              index === i ? "z-10" : "z-0"
            }`}
            style={{ pointerEvents: "none" }}
            animate={{ opacity: index === i ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-contain bg-black"
              draggable={false}
            />
          </motion.div>
        ))}
      </div>

      {/* Nav Buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-8 pointer-events-none z-20">
        <motion.button
          className="pointer-events-auto bg-gradient-to-r from-[#c9a35e]/80 to-[#f8d46a]/80 backdrop-blur-md text-white p-2.5 sm:p-4 rounded-full shadow-2xl border border-white/20"
          onClick={prev}
          aria-label="previous"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          className="pointer-events-auto bg-gradient-to-r from-[#f8d46a]/80 to-[#c9a35e]/80 backdrop-blur-md text-white p-2.5 sm:p-4 rounded-full shadow-2xl border border-white/20"
          onClick={next}
          aria-label="next"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Indicators */}
      {showIndicators && safeSlides.length > 1 && (
        <div className="absolute left-0 right-0 bottom-4 sm:bottom-8 flex justify-center gap-2 sm:gap-3 px-4 z-20">
          {safeSlides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all backdrop-blur-sm ${
                index === i
                  ? "w-8 sm:w-12 h-2 sm:h-3 bg-gradient-to-r from-[#c9a35e] to-[#f8d46a]"
                  : "w-2 sm:w-3 h-2 sm:h-3 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`go-to-${i + 1}`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

// ─────────────────────────────────────────
// YouTube Video Card
// ─────────────────────────────────────────
function YoutubeCard({ url, idx }) {
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
  } catch {}

  return (
    <motion.div
      className="group relative p-[2px] rounded-2xl bg-gradient-to-br from-[#c9a35e] to-[#f8d46a]"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <div className="p-3 sm:p-5 rounded-2xl bg-black/90 backdrop-blur-md h-full">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <FaYoutube className="text-red-500 text-base sm:text-lg" />
          <span className="font-semibold text-[#f7e7b7] text-xs sm:text-sm">
            Video {idx + 1}
          </span>
        </div>
        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
          <iframe
            title={`yt-home-${idx}`}
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
}

// ─────────────────────────────────────────
// Home Page
// ─────────────────────────────────────────
export default function Home() {
  const [slides, setSlides] = useState([]);
  const [galleryForHome, setGalleryForHome] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const heroTextRef = useRef(null);
  const programsRef = useRef(null);
  const youtubeRef = useRef(null);

  const isHeroTextInView = useInView(heroTextRef, { once: true, margin: "-50px" });
  const isProgramsInView = useInView(programsRef, { once: true, margin: "-100px" });

  useEffect(() => {
    let mounted = true;
    async function loadGalleryData() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/event-photos");
        const text = await res.text().catch(() => "");
        let body;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          body = null;
        }
        if (!res.ok || !body) return;

        const rawSliderArr = body.slider || body.home_slider || [];
        const mapped = rawSliderArr
          .map(getImgUrlSafe)
          .filter((u) => typeof u === "string" && u.trim().length > 0);

        if (mounted) setSlides(mapped);

        let rawGallery = body.gallery ?? body ?? {};
        if (typeof rawGallery !== "object") rawGallery = {};
        const copy = { ...rawGallery };
        for (const key of ["home_slider", "homeSlider", "home-slider", "slider"]) {
          delete copy[key];
        }
        if (mounted) setGalleryForHome(copy);
      } catch (e) {
        console.warn("Could not load gallery:", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadGalleryData();
    return () => { mounted = false; };
  }, []);

  // All youtube URLs flat
  const allYoutubeItems = Object.values(galleryForHome || {})
    .flat()
    .filter((item) => item?.youtube && item?.url)
    .map((item) => item.url);

  // Only show max 4 on homepage
  const MAX_YOUTUBE = 4;
  const visibleYoutube = allYoutubeItems.slice(0, MAX_YOUTUBE);
  const hasMoreYoutube = allYoutubeItems.length > MAX_YOUTUBE;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
  };

  const programs = [
    {
      title: "Education Support",
      desc: "Helping children continue their education with resources and scholarships.",
      icon: FaGraduationCap,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Healthcare Camps",
      desc: "Free medical checkups and health awareness drives in rural areas.",
      icon: FaUserMd,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Food Distribution",
      desc: "Providing nutritious meals to families in need.",
      icon: FaUtensils,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="overflow-hidden">

      {/* ── Hero Carousel ── */}
      <div className="px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        {isLoading ? (
          <div
            className="flex justify-center items-center rounded-2xl sm:rounded-3xl shadow-2xl bg-black/20"
            style={{ height: "45vh", minHeight: "280px" }}
          >
            <motion.div
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-[#f8d46a]/30 border-t-[#f8d46a]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : slides.length > 0 ? (
          <PhotoCarousel slides={slides} desktopHeight="65vh" />
        ) : (
          <motion.div
            className="flex justify-center items-center rounded-2xl sm:rounded-3xl shadow-2xl bg-black/30 backdrop-blur-md border border-[#c9a35e]/30"
            style={{ height: "45vh", minHeight: "280px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center px-4">
              <p className="text-base sm:text-xl text-[#f5f5f1] mb-2">
                No hero images uploaded yet
              </p>
              <p className="text-xs sm:text-sm text-[#c9a35e]">
                Please upload images from the dashboard
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Hero Text ── */}
      <motion.section
        ref={heroTextRef}
        className="py-10 sm:py-14 lg:py-20 relative"
        initial="hidden"
        animate={isHeroTextInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Floating blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-16 left-6 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-[#f8d46a]/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-6 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#c9a35e]/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 relative z-10">
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 sm:mb-6 text-[#f7e7b7] leading-tight"
            variants={itemVariants}
          >
            AR Foundation
          </motion.h1>

          <motion.div className="relative inline-block mb-5 sm:mb-6" variants={itemVariants}>
            <h2 className="text-xl sm:text-3xl md:text-4xl mb-4 text-[#f5f5f1] font-light">
              Empowering Lives Through Compassion
            </h2>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#c9a35e] to-transparent"
              initial={{ scaleX: 0 }}
              animate={isHeroTextInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.div>

          <motion.p
            className="text-[#f5f5f1] text-sm sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            AR Foundation supports communities through education, healthcare,
            and empowerment initiatives.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/donate"
                className="group relative w-full sm:w-auto text-center bg-gradient-to-r from-[#f8d46a] to-[#f8d46a] text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold shadow-2xl inline-flex items-center justify-center gap-2 sm:gap-3 overflow-hidden"
              >
                <span className="relative z-10">Donate Now</span>
                <FaHandHoldingHeart className="relative z-10 text-lg sm:text-xl" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#fff3c4] to-[#f8d46a]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/about"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-[#c9a35e] font-bold text-[#f5f5f1] hover:bg-[#c9a35e]/20 backdrop-blur-sm transition-all duration-300 text-base sm:text-lg shadow-lg"
              >
                <span>About Us</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── YouTube Videos Section ── */}
      <section
        ref={youtubeRef}
        className="py-10 sm:py-16 max-w-6xl mx-auto px-3 sm:px-6"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
            <FaYoutube className="text-red-500 text-3xl sm:text-4xl" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#f7e7b7]">
              YouTube Videos
            </h2>
          </div>
          <p className="text-[#f5f5f1]/70 text-sm sm:text-lg max-w-xl mx-auto">
            Watch how we&apos;re making a difference in communities
          </p>
        </motion.div>

        {/* No Videos State */}
        {!isLoading && allYoutubeItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 sm:py-16 glass-card rounded-2xl"
          >
            <FaYoutube className="text-5xl sm:text-6xl text-red-500/40 mx-auto mb-4" />
            <p className="text-[#f5f5f1]/50 text-sm sm:text-base">
              No YouTube videos yet. Add videos from the dashboard.
            </p>
          </motion.div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-white/5 animate-pulse aspect-video"
              />
            ))}
          </div>
        )}

        {/* Video Grid — max 4 */}
        {!isLoading && visibleYoutube.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
            }}
            className={`grid gap-4 sm:gap-6 ${
              visibleYoutube.length === 1
                ? "grid-cols-1 max-w-2xl mx-auto"
                : visibleYoutube.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : visibleYoutube.length === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
            }`}
          >
            {visibleYoutube.map((url, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <YoutubeCard url={url} idx={idx} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View More Button */}
        {!isLoading && hasMoreYoutube && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-10 text-center"
          >
            {/* remaining count badge */}
            <p className="text-[#d5c08a]/70 text-xs sm:text-sm mb-4">
              +{allYoutubeItems.length - MAX_YOUTUBE} more video
              {allYoutubeItems.length - MAX_YOUTUBE !== 1 ? "s" : ""} in the gallery
            </p>

            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-red-500/30 transition-all duration-300"
              >
                <FaYoutube className="text-lg sm:text-xl" />
                <span>View All Videos</span>
                <FaArrowRight className="text-sm sm:text-base" />
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* View Gallery link even when <= 4 videos */}
        {!isLoading && allYoutubeItems.length > 0 && !hasMoreYoutube && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 sm:mt-8 text-center"
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-[#d5c08a]/70 hover:text-[#f8d46a] text-xs sm:text-sm transition-colors duration-300"
            >
              <span>Explore full gallery</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </motion.div>
        )}
      </section>

      {/* ── Programs Section ── */}
      <section
        ref={programsRef}
        className="py-12 sm:py-16 lg:py-20 relative"
        style={{ background: "var(--background)" }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 text-center">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 sm:mb-16"
          >
            <motion.div
              className="inline-block mb-4 sm:mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <UseAnimations animation={activity} size={48} strokeColor="#f8d46a" />
            </motion.div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 sm:mb-6 text-[#f7e7b7]">
              Our Key Programs
            </h2>
            <p className="text-[#f5f5f1]/70 text-sm sm:text-lg max-w-2xl mx-auto">
              Comprehensive initiatives designed to create lasting impact
            </p>
          </motion.div>

          {/* Program Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isProgramsInView ? "visible" : "hidden"}
          >
            {programs.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  className="group relative rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                  <div className="relative p-6 sm:p-8 bg-black/50 backdrop-blur-xl border border-[#c9a35e]/30 group-hover:border-[#c9a35e]/60 transition-all duration-300 h-full">
                    <motion.div
                      className="mb-4 sm:mb-6 inline-block p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="text-4xl sm:text-5xl text-[#f8d46a]" />
                    </motion.div>
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4 text-[#f7e7b7] group-hover:text-[#f8d46a] transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-[#f5f5f1]/80 text-sm sm:text-base leading-relaxed">
                      {p.desc}
                    </p>
                    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-[#c9a35e] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm sm:text-base">
                      <span>Learn More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
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

          {/* View All Programs */}
          <motion.div
            className="mt-10 sm:mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={isProgramsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 sm:gap-3 text-[#f5f5f1] bg-gradient-to-r from-[#c9a35e]/20 to-[#f8d46a]/20 backdrop-blur-sm border-2 border-[#c9a35e] px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:from-[#c9a35e]/30 hover:to-[#f8d46a]/30 transition-all duration-300 font-bold text-sm sm:text-lg shadow-lg"
              >
                <span>View All Programs</span>
                <motion.svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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