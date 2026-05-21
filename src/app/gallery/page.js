// src/app/gallery/page.js
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import loading2 from "react-useanimations/lib/loading2";
import infinity from "react-useanimations/lib/infinity";
import plusToX from "react-useanimations/lib/plusToX";
import searchToX from "react-useanimations/lib/searchToX";

export default function GalleryPage() {
  const [gallery, setGallery] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // popup gallery viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [isYoutubeFolder, setIsYoutubeFolder] = useState(false);

  // lightbox
  const [lightbox, setLightbox] = useState({
    open: false,
    src: "",
    alt: "",
    currentIndex: -1,
    totalImages: 0,
  });

  // -----------------------
  // Load Gallery
  // -----------------------
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/event-photos");
        const text = await res.text().catch(() => "");
        let body = {};
        try {
          body = text ? JSON.parse(text) : {};
        } catch (e) {
          body = {};
        }

        if (!res.ok) throw new Error(body?.error || "Failed to load gallery");

        const raw = body.gallery ?? body ?? {};
        const cleaned = {};

        for (const [k, v] of Object.entries(raw)) {
          if (!v || !Array.isArray(v) || v.length === 0) continue;
          const filtered = v.filter((item) => {
            if (!item) return false;
            if (typeof item === "string") return item.trim() !== "";
            if (typeof item === "object") {
              if (item.youtube === true)
                return !!(item.url && String(item.url).trim());
              return !!(item.original || item.optimized || item.thumb);
            }
            return false;
          });
          if (filtered.length === 0) continue;
          cleaned[k] = filtered;
        }

        setGallery(cleaned);
      } catch (err) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // -----------------------
  // Keyboard Navigation
  // -----------------------
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        if (lightbox.open) closeLightbox();
        else if (viewerOpen) closeEventViewer();
      } else if (lightbox.open && lightbox.currentIndex >= 0) {
        if (e.key === "ArrowLeft" && lightbox.currentIndex > 0) {
          navigateLightbox(lightbox.currentIndex - 1);
        } else if (
          e.key === "ArrowRight" &&
          lightbox.currentIndex < lightbox.totalImages - 1
        ) {
          navigateLightbox(lightbox.currentIndex + 1);
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, viewerOpen]);

  // -----------------------
  // Helpers
  // -----------------------
  function parseYouTubeId(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
      if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
      return null;
    } catch {
      const m = (url || "").match(
        /(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{6,})/
      );
      return m ? m[1] : null;
    }
  }

  function youtubeThumbUrl(url) {
    const id = parseYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }

  function youTubeEmbedSrc(url) {
    const id = parseYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  function previewSrc(items) {
    if (!items || items.length === 0) return null;
    for (const it of items) {
      if (!it) continue;
      if (typeof it === "string") return it;
      if (it.youtube === true) continue;
      const src = it.thumb || it.optimized || it.original || null;
      if (src && String(src).trim()) return src;
    }
    return null;
  }

  function getImgSrc(img) {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.optimized || img.original || img.thumb || "";
  }

  // -----------------------
  // Computed Values
  // -----------------------
  const rawKeys = Object.keys(gallery).sort((a, b) => a.localeCompare(b));

  const youtubeKeys = rawKeys.filter((k) => {
    const items = gallery[k] || [];
    return items.length > 0 && items[0]?.youtube === true;
  });

  const imageKeys = rawKeys.filter((k) => {
    const items = gallery[k] || [];
    return !(items.length > 0 && items[0]?.youtube === true);
  });

  const filteredImageEvents = imageKeys.filter((ev) =>
    ev.replace(/_/g, " ").toLowerCase().includes(query.trim().toLowerCase())
  );

  const filteredYoutubeEvents = youtubeKeys.filter((ev) =>
    ev.replace(/_/g, " ").toLowerCase().includes(query.trim().toLowerCase())
  );

  const totalEvents =
    filteredImageEvents.length + filteredYoutubeEvents.length;

  // -----------------------
  // Event Viewer
  // -----------------------
  function openEventViewer(ev) {
    const items = gallery[ev] || [];
    const isYT = items.length > 0 && items[0]?.youtube === true;
    setSelectedEvent(ev);

    if (isYT) {
      const embeds = items
        .map((it) => {
          const url = typeof it === "string" ? it : it.url || "";
          return url ? youTubeEmbedSrc(url) : null;
        })
        .filter(Boolean);
      setIsYoutubeFolder(true);
      setEventImages(embeds);
    } else {
      setIsYoutubeFolder(false);
      setEventImages(items.filter((it) => it && it.youtube !== true));
    }

    setViewerOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeEventViewer() {
    setViewerOpen(false);
    setSelectedEvent(null);
    setEventImages([]);
    setIsYoutubeFolder(false);
    if (!lightbox.open) document.body.style.overflow = "";
  }

  // -----------------------
  // Lightbox
  // -----------------------
  function openLightbox(src, alt = "", index = 0, total = 0) {
    setLightbox({ open: true, src, alt, currentIndex: index, totalImages: total });
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightbox({ open: false, src: "", alt: "", currentIndex: -1, totalImages: 0 });
    if (!viewerOpen) document.body.style.overflow = "";
  }

  function navigateLightbox(newIndex) {
    const img = eventImages[newIndex];
    const src = getImgSrc(img);
    setLightbox((prev) => ({
      ...prev,
      currentIndex: newIndex,
      src,
    }));
  }

  // -----------------------
  // Animation Variants
  // -----------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <main className="min-h-screen px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-3 animated-text text-glow">
            Event Gallery
          </h1>
          <p className="text-base sm:text-lg text-[#f5f5f1]/75">
            Tap any card to explore our memorable moments
          </p>
        </motion.div>

        {/* ── Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-[#c9a35e]/30 bg-black/30 backdrop-blur-md text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] outline-none transition-all duration-300 text-sm sm:text-base"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <UseAnimations
                  animation={searchToX}
                  size={26}
                  strokeColor="#c9a35e"
                  reverse={query.length > 0}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#c9a35e]/20 to-[#f8d46a]/20 border border-[#c9a35e]/30 self-stretch sm:self-auto justify-center">
              {loading ? (
                <UseAnimations animation={infinity} size={22} strokeColor="#f8d46a" />
              ) : (
                <span className="text-xl">📊</span>
              )}
              <span className="text-sm font-semibold text-[#f7e7b7] whitespace-nowrap">
                {loading
                  ? "Loading…"
                  : `${totalEvents} event${totalEvents !== 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}
        </motion.div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <UseAnimations animation={loading2} size={72} strokeColor="#c9a35e" />
            <p className="mt-4 text-[#f5f5f1]/60 text-sm">Loading events...</p>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && totalEvents === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 sm:p-14 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f7e7b7] mb-2">
              No events found
            </h3>
            <p className="text-[#f5f5f1]/60 text-sm sm:text-base">
              {query ? "Try adjusting your search" : "No events available yet"}
            </p>
          </motion.div>
        )}

        {/* ── Image Event Grid ── */}
        {!loading && filteredImageEvents.length > 0 && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs sm:text-sm text-[#d5c08a]/70 mb-4 flex items-center gap-2"
            >
              <span>📁</span>
              <span>
                {filteredImageEvents.length} image event
                {filteredImageEvents.length !== 1 ? "s" : ""} — tap a card to
                open
              </span>
            </motion.p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10"
            >
              {filteredImageEvents.map((ev) => {
                const items = gallery[ev] || [];
                const label = ev.replace(/_/g, " ");
                const rep = previewSrc(items);

                return (
                  <motion.div
                    key={ev}
                    variants={cardVariants}
                    onClick={() => openEventViewer(ev)}
                    className="glass-card group cursor-pointer overflow-hidden rounded-2xl border-2 border-[#c9a35e]/20 hover:border-[#f8d46a]/60 transition-all duration-300 active:scale-95"
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden h-44 sm:h-52">
                      {rep ? (
                        <img
                          src={rep}
                          alt={label}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black/30 text-[#f5f5f1]/30">
                          <span className="text-5xl">🖼️</span>
                          <span className="text-xs mt-2">No Preview</span>
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Photo count badge */}
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] sm:text-xs text-[#f8d46a] font-semibold border border-[#f8d46a]/30">
                        {items.length} photo{items.length !== 1 ? "s" : ""}
                      </div>

                      {/* Hover CTA */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-4 py-2 rounded-full bg-[#f8d46a] text-black text-xs sm:text-sm font-bold shadow-2xl">
                          Open Gallery →
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-4">
                      <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#f7e7b7] group-hover:text-[#f8d46a] transition-colors truncate">
                        {label}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a35e]" />
                        <span className="text-xs text-[#d5c08a]/70">
                          Image Gallery
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        {/* ── YouTube Grid ── */}
        {!loading && filteredYoutubeEvents.length > 0 && (
          <>
            {/* Section divider */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              <h3 className="text-lg sm:text-2xl font-bold text-[#f7e7b7] flex items-center gap-2 whitespace-nowrap">
                <span>🎬</span>
                <span>YouTube Videos</span>
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs sm:text-sm text-[#d5c08a]/70 mb-4 flex items-center gap-2"
            >
              <span>🎥</span>
              <span>
                {filteredYoutubeEvents.length} video collection
                {filteredYoutubeEvents.length !== 1 ? "s" : ""} — tap to watch
              </span>
            </motion.p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredYoutubeEvents.map((ev) => {
                const items = gallery[ev] || [];
                const label = ev.replace(/_/g, " ");
                const firstUrl = (() => {
                  const it = items[0];
                  if (!it) return "";
                  return typeof it === "string" ? it : it.url || "";
                })();
                const thumb = youtubeThumbUrl(firstUrl);

                return (
                  <motion.div
                    key={ev}
                    variants={cardVariants}
                    onClick={() => openEventViewer(ev)}
                    className="glass-card group cursor-pointer overflow-hidden rounded-2xl border-2 border-red-500/20 hover:border-red-400/60 transition-all duration-300 active:scale-95"
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden h-44 sm:h-52">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={label}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black/30 text-[#f5f5f1]/30">
                          <span className="text-5xl">📺</span>
                          <span className="text-xs mt-2">No Thumbnail</span>
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                      {/* Video count badge */}
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-red-600/80 backdrop-blur-sm text-[10px] sm:text-xs text-white font-semibold">
                        {items.length} video{items.length !== 1 ? "s" : ""}
                      </div>

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {/* Hover CTA */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-xl">
                          Watch Videos →
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-4">
                      <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#f7e7b7] group-hover:text-red-400 transition-colors truncate">
                        {label}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-xs text-red-400/70">
                          YouTube Collection
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>

      {/* ══════════════════════════════════════
          POPUP EVENT VIEWER
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-xl p-0 sm:p-4"
            onClick={closeEventViewer}
          >
            <motion.div
              initial={{ scale: 0.95, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 60 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="glass-card w-full sm:max-w-7xl sm:w-full h-[92vh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl border-2 border-[#c9a35e]/30 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Viewer Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#c9a35e]/20 flex-shrink-0">
                {/* Mobile drag handle */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[#c9a35e]/40 sm:hidden" />

                <div className="mt-2 sm:mt-0">
                  <h2 className="text-base sm:text-2xl font-bold text-[#f7e7b7] truncate max-w-[200px] sm:max-w-none">
                    {selectedEvent?.replace(/_/g, " ")}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#d5c08a] mt-0.5">
                    {eventImages.length}{" "}
                    {isYoutubeFolder ? "video" : "photo"}
                    {eventImages.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <motion.button
                  onClick={closeEventViewer}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-semibold text-xs sm:text-sm transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UseAnimations
                    animation={plusToX}
                    size={20}
                    strokeColor="#ff6b6b"
                    reverse={true}
                  />
                  <span className="hidden sm:inline">Close</span>
                </motion.button>
              </div>

              {/* Viewer Content — scrollable */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                {isYoutubeFolder ? (
                  /* YouTube Grid */
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  >
                    {eventImages.map((embedUrl, idx) => (
                      <motion.div
                        key={idx}
                        variants={cardVariants}
                        className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-[#c9a35e]/30 shadow-2xl"
                      >
                        <iframe
                          title={`yt-${selectedEvent}-${idx}`}
                          src={embedUrl}
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  /* Photo Grid */
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3"
                  >
                    {eventImages.map((img, i) => {
                      const src = getImgSrc(img);
                      return (
                        <motion.button
                          key={i}
                          variants={cardVariants}
                          onClick={() =>
                            openLightbox(src, `photo-${i}`, i, eventImages.length)
                          }
                          className="relative group overflow-hidden rounded-xl border-2 border-[#c9a35e]/20 hover:border-[#f8d46a]/60 transition-all duration-300 aspect-square"
                          whileHover={{ scale: 1.04, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={src}
                            className="w-full h-full object-cover"
                            alt={`photo-${i}`}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-2xl sm:text-3xl">
                              🔍
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/97 backdrop-blur-2xl"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Counter */}
              {lightbox.totalImages > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white/80 text-xs sm:text-sm font-semibold">
                  {lightbox.currentIndex + 1} / {lightbox.totalImages}
                </div>
              )}

              {/* Close */}
              <motion.button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md hover:bg-black/90 border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UseAnimations
                  animation={plusToX}
                  size={20}
                  strokeColor="#ffffff"
                  reverse={true}
                />
                <span className="hidden sm:inline">Close</span>
              </motion.button>

              {/* Prev Arrow */}
              {lightbox.currentIndex > 0 && (
                <motion.button
                  onClick={() => navigateLightbox(lightbox.currentIndex - 1)}
                  className="absolute left-2 sm:left-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-[#c9a35e]/40 border border-white/10 text-white flex items-center justify-center transition-all"
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>
              )}

              {/* Next Arrow */}
              {lightbox.currentIndex < lightbox.totalImages - 1 && (
                <motion.button
                  onClick={() => navigateLightbox(lightbox.currentIndex + 1)}
                  className="absolute right-2 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-[#c9a35e]/40 border border-white/10 text-white flex items-center justify-center transition-all"
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              )}

              {/* Image */}
              <motion.img
                key={lightbox.src}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                src={lightbox.src}
                alt={lightbox.alt || "photo"}
                className="max-w-full max-h-[85vh] rounded-xl sm:rounded-2xl shadow-2xl border-2 border-[#c9a35e]/20"
                style={{ objectFit: "contain" }}
              />

              {/* Thumbnail strip — mobile hidden, visible sm+ */}
              {lightbox.totalImages > 1 && (
                <div className="absolute bottom-4 left-0 right-0 hidden sm:flex justify-center gap-2 px-4 overflow-x-auto">
                  {eventImages.map((img, i) => {
                    const s = getImgSrc(img);
                    return (
                      <button
                        key={i}
                        onClick={() => navigateLightbox(i)}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          i === lightbox.currentIndex
                            ? "border-[#f8d46a] scale-110"
                            : "border-white/20 opacity-50 hover:opacity-80"
                        }`}
                      >
                        <img
                          src={s}
                          alt={`thumb-${i}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}