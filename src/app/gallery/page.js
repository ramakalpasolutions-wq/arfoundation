// src/app/gallery/page.js
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import loading2 from "react-useanimations/lib/loading2";
import infinity from "react-useanimations/lib/infinity";
import plusToX from "react-useanimations/lib/plusToX";
import arrowDown from "react-useanimations/lib/arrowDown";
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
  const [lightbox, setLightbox] = useState({ open: false, src: "", alt: "" });

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
          if (!v) continue;
          if (!Array.isArray(v)) continue;
          if (v.length === 0) continue;

          const filtered = v.filter((item) => {
            if (!item) return false;
            if (typeof item === "string") return item.trim() !== "";
            if (typeof item === "object") {
              if (item.youtube === true) return !!(item.url && String(item.url).trim());
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

  // ESC closes viewer/lightbox
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape" || e.key === "Esc") {
        if (lightbox.open) {
          closeLightbox();
        } else if (viewerOpen) {
          closeEventViewer();
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox.open, viewerOpen]);

  // helpers
  const rawKeys = Object.keys(gallery).sort((a, b) => a.localeCompare(b));

  // classify keys
  const youtubeKeys = rawKeys.filter((k) => {
    const items = gallery[k] || [];
    return items.length > 0 && items[0]?.youtube === true;
  });

  const imageKeys = rawKeys.filter((k) => {
    const items = gallery[k] || [];
    return !(items.length > 0 && items[0]?.youtube === true);
  });

  // search filter
  const filteredImageEvents = imageKeys.filter((ev) =>
    ev.replace(/_/g, " ").toLowerCase().includes(query.trim().toLowerCase())
  );

  const filteredYoutubeEvents = youtubeKeys.filter((ev) =>
    ev.replace(/_/g, " ").toLowerCase().includes(query.trim().toLowerCase())
  );

  // preview first useful image (skip youtube items)
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

  // YouTube helpers
  function parseYouTubeId(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        return u.searchParams.get("v");
      } else if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }
      return null;
    } catch (e) {
      const m = (url || "").match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{6,})/);
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

  // open event viewer
  function openEventViewer(ev) {
    const items = gallery[ev] || [];
    const isYT = items.length > 0 && items[0]?.youtube === true;

    setSelectedEvent(ev);

    if (isYT) {
      const embeds = items
        .map((it) => {
          if (!it) return null;
          const url = typeof it === "string" ? it : it.url || "";
          if (!url) return null;
          const embed = youTubeEmbedSrc(url) || null;
          return embed;
        })
        .filter(Boolean);

      setIsYoutubeFolder(true);
      setEventImages(embeds);
      setViewerOpen(true);
      document.body.style.overflow = "hidden";
      return;
    }

    const imageItems = items.filter((it) => it && it.youtube !== true);
    setIsYoutubeFolder(false);
    setEventImages(imageItems);
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

  // lightbox
  function openLightbox(src, alt = "") {
    setLightbox({ open: true, src, alt });
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightbox({ open: false, src: "", alt: "" });
    if (!viewerOpen) document.body.style.overflow = "";
  }

  const totalEvents = filteredImageEvents.length + filteredYoutubeEvents.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 animated-text text-glow">
            Event Gallery
          </h1>
          <p className="text-lg text-[#f5f5f1]/80">
            Explore our memorable moments and achievements
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-[#c9a35e]/30 bg-black/30 backdrop-blur-md text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] outline-none transition-all duration-300"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <UseAnimations
                  animation={searchToX}
                  size={28}
                  strokeColor="#c9a35e"
                  reverse={query.length > 0}
                />
              </div>
            </div>

            <motion.div
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#c9a35e]/20 to-[#f8d46a]/20 border border-[#c9a35e]/30"
              whileHover={{ scale: 1.05 }}
            >
              {loading ? (
                <UseAnimations animation={infinity} size={24} strokeColor="#f8d46a" />
              ) : (
                <span className="text-2xl">📊</span>
              )}
              <span className="text-sm font-semibold text-[#f7e7b7]">
                {loading ? "Loading…" : `${totalEvents} event${totalEvents !== 1 ? "s" : ""}`}
              </span>
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 1, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <UseAnimations animation={loading2} size={80} strokeColor="#c9a35e" />
            <p className="mt-4 text-[#f5f5f1]/60">Loading events...</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && totalEvents === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-[#f7e7b7] mb-2">No events found</h3>
            <p className="text-[#f5f5f1]/60">
              {query ? "Try adjusting your search" : "No events available yet"}
            </p>
          </motion.div>
        )}

        {/* EVENT LIST */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Regular image event cards */}
          {filteredImageEvents.map((ev, idx) => {
            const items = gallery[ev] || [];
            const label = ev.replace(/_/g, " ");
            const rep = previewSrc(items);

            return (
              <motion.section
                key={ev}
                variants={cardVariants}
                className="glass-card hover-lift p-6 group"
                whileHover={{ y: -8 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="text-4xl"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      📁
                    </motion.div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-[#f7e7b7] group-hover:text-[#f8d46a] transition-colors">
                        {label}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-[#d5c08a]">
                          {items.length} photo{items.length !== 1 ? "s" : ""}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#c9a35e]" />
                        <span className="text-xs text-[#d5c08a]/60">Image Gallery</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => openEventViewer(ev)}
                    className="btn-glass flex items-center gap-2 justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-semibold">Open Gallery</span>
                    <UseAnimations animation={arrowDown} size={20} strokeColor="#000" />
                  </motion.button>
                </div>

                <div className="relative overflow-hidden rounded-xl border-2 border-[#c9a35e]/20 group-hover:border-[#f8d46a]/40 transition-all duration-300">
                  {rep ? (
                    <motion.img
                      src={rep}
                      className="w-full h-48 md:h-64 object-cover"
                      alt={`${label} preview`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <div className="w-full h-48 md:h-64 flex flex-col items-center justify-center bg-black/20 text-[#f5f5f1]/40">
                      <div className="text-5xl mb-2">🖼️</div>
                      <span className="text-sm">No Preview Available</span>
                    </div>
                  )}
                  
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.section>
            );
          })}

          {/* YouTube folders */}
          {filteredYoutubeEvents.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mt-8 mb-4"
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9a35e] to-transparent" />
                <h3 className="text-2xl font-bold text-[#f7e7b7] flex items-center gap-2">
                  <span>🎬</span>
                  <span>YouTube Videos</span>
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c9a35e] to-transparent" />
              </motion.div>

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
                  <motion.section
                    key={ev}
                    variants={cardVariants}
                    className="glass-card hover-lift p-6 group border-2 border-red-500/20"
                    whileHover={{ y: -8 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="text-4xl"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🎥
                        </motion.div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-[#f7e7b7] group-hover:text-red-400 transition-colors">
                            {label}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-[#d5c08a]">
                              {items.length} video{items.length !== 1 ? "s" : ""}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            <span className="text-xs text-red-400/80">YouTube Collection</span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => openEventViewer(ev)}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Watch Videos</span>
                        <UseAnimations animation={arrowDown} size={20} strokeColor="#ffffff" />
                      </motion.button>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border-2 border-red-500/30 group-hover:border-red-400/50 transition-all duration-300">
                      {thumb ? (
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                        >
                          <img
                            src={thumb}
                            className="w-full h-48 md:h-64 object-cover"
                            alt={`${label} preview`}
                          />
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300">
                            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="w-full h-48 md:h-64 flex flex-col items-center justify-center bg-black/20 text-[#f5f5f1]/40">
                          <div className="text-5xl mb-2">📺</div>
                          <span className="text-sm">No Thumbnail Available</span>
                        </div>
                      )}
                    </div>
                  </motion.section>
                );
              })}
            </>
          )}
        </motion.div>
      </div>

      {/* POPUP EVENT VIEWER */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            onClick={closeEventViewer}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card max-w-7xl w-full max-h-[90vh] overflow-auto p-6 md:p-8 border-2 border-[#c9a35e]/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#c9a35e]/20">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold animated-text">
                    {selectedEvent?.replace(/_/g, " ")}
                  </h2>
                  <p className="text-sm text-[#d5c08a] mt-1">
                    {eventImages.length} {isYoutubeFolder ? "video" : "photo"}
                    {eventImages.length !== 1 ? "s" : ""} 
                  </p>
                </div>

                <motion.button
                  onClick={closeEventViewer}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UseAnimations animation={plusToX} size={24} strokeColor="#ff6b6b" reverse={true} />
                  <span>Close</span>
                </motion.button>
              </div>

              {/* Content */}
              {isYoutubeFolder ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {eventImages.map((embedUrl, idx) => (
                    <motion.div
                      key={idx}
                      variants={cardVariants}
                      className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-[#c9a35e]/30 shadow-2xl group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <iframe
                        title={`yt-${selectedEvent}-${idx}`}
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; autoplay"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {eventImages.map((img, i) => {
                    const src = typeof img === "string" ? img : (img.optimized || img.thumb || img.original || "");
                    return (
                      <motion.button
                        key={i}
                        variants={cardVariants}
                        onClick={() => openLightbox(src)}
                        className="relative group overflow-hidden rounded-xl border-2 border-[#c9a35e]/20 hover:border-[#f8d46a]/60 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={src}
                          className="w-full h-40 object-cover"
                          alt={`photo-${i}`}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-white text-3xl">🔍</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-screen-xl w-full max-h-[95vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={closeLightbox}
                className="flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 border border-white/10 text-white font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <UseAnimations animation={plusToX} size={24} strokeColor="#ffffff" reverse={true} />
                <span>Close</span>
              </motion.button>

              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={lightbox.src}
                alt={lightbox.alt || "photo"}
                className="w-full h-auto rounded-2xl border-4 border-[#c9a35e]/30 shadow-2xl"
                style={{ objectFit: "contain", maxHeight: "85vh" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
