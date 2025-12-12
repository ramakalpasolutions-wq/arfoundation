"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import UseAnimations from "react-useanimations";
import loading2 from "react-useanimations/lib/loading2";
import alertCircle from "react-useanimations/lib/alertCircle";
import {
  FaFolder,
  FaUpload,
  FaTrash,
  FaEdit,
  FaImages,
  FaYoutube,
  FaHome,
  FaSignOutAlt,
  FaChevronRight,
  FaTimes,
  FaEye,
  FaCheck,
} from "react-icons/fa";

const API = "/api/event-photos";
const EXAMPLE_LOCAL_PATH = "/mnt/data/3b9d88d7-3ddd-44b0-b3e7-dad4e4e185b4.png";

export default function AdminPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // main form state
  const [eventName, setEventName] = useState("");
  const [files, setFiles] = useState([]);
  const [singleFile, setSingleFile] = useState(null);

  // galleries
  const [gallery, setGallery] = useState({});
  const [selectedEvent, setSelectedEvent] = useState("");
  const [heroGallery, setHeroGallery] = useState([]);

  // UI state
  const [useExisting, setUseExisting] = useState(true);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");

  // hero card state
  const [heroFiles, setHeroFiles] = useState([]);
  const [heroPreview, setHeroPreview] = useState(EXAMPLE_LOCAL_PATH);
  const [heroUploading, setHeroUploading] = useState(false);

  // YouTube input
  const [youtubeUrls, setYoutubeUrls] = useState("");

  // -----------------------
  // Helpers
  // -----------------------
  function getImgUrl(img) {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.original || img.optimized || img.thumb || "";
  }

  function safeSrc(img) {
    const s = getImgUrl(img);
    return s && s.trim() !== "" ? s : null;
  }

  function getHeroUrlSet(heroArr) {
    return new Set((heroArr || []).map(getImgUrl).filter(Boolean));
  }

  const allowedExts = [];
  function isValidImageFile(file) {
    if (!file) return false;
    if (file.type && !file.type.startsWith("image/")) return false;
    const name = (file.name || "").toLowerCase();
    if (allowedExts.length === 0) return true;
    return allowedExts.some((ext) => name.endsWith(ext));
  }

  const HERO_KEYS = new Set(["home_slider", "home-slider", "homeSlider"]);

  function updateStatus(message, type = "info") {
    setStatus(message);
    setStatusType(type);
  }

  // -----------------------
  // Auth check (client)
  // -----------------------
  useEffect(() => {
    setIsMounted(true);
    const logged = localStorage.getItem("isAdmin");
    if (!logged) router.push("/admin-login");
  }, [router]);

  // -----------------------
  // Load gallery + slider
  // -----------------------
  async function loadGallery() {
    try {
      const res = await fetch(API);
      const text = await res.text().catch(() => "");
      let body;
      try {
        body = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.error("loadGallery: invalid JSON:", parseErr, text);
        setGallery({});
        setHeroGallery([]);
        setSelectedEvent("");
        updateStatus("Error loading gallery: invalid server response", "error");
        return;
      }

      if (!res.ok) {
        const errMsg = body?.error || `Failed to load gallery (status ${res.status})`;
        throw new Error(errMsg);
      }

      const galleryFromBody = body.gallery ?? body;
      const sliderFromBody = body.slider ?? body.home_slider ?? body.homeSlider ?? [];

      const finalGallery =
        body.gallery ??
        (galleryFromBody.gallery
          ? galleryFromBody.gallery
          : typeof galleryFromBody === "object"
          ? galleryFromBody
          : {});

      setGallery(finalGallery || {});
      setHeroGallery(Array.isArray(sliderFromBody) ? sliderFromBody : []);
      setSelectedEvent("");
      updateStatus("", "info");
    } catch (err) {
      console.error("loadGallery error:", err);
      setGallery({});
      setHeroGallery([]);
      setSelectedEvent("");
      updateStatus("Error loading gallery: " + (err.message || String(err)), "error");
    }
  }

  useEffect(() => {
    if (isMounted) {
      loadGallery();
    }
  }, [isMounted]);

  // computed helpers for UI
  const heroUrlSet = getHeroUrlSet(heroGallery);
  const events = Object.keys(gallery)
    .filter((k) => !HERO_KEYS.has(k))
    .sort((a, b) => a.localeCompare(b));

  const safeCount = (ev) => {
    const list = gallery[ev] || [];
    return list.filter((img) => !heroUrlSet.has(getImgUrl(img))).length;
  };

  // -----------------------
  // Cloudinary direct upload helper
  // -----------------------
  async function uploadToCloudinary(file, folder) {
    const sigRes = await fetch(`/api/upload-signature?folder=${encodeURIComponent(folder)}`);
    if (!sigRes.ok) throw new Error("Failed to get upload signature");
    const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", apiKey);
    fd.append("timestamp", timestamp);
    fd.append("signature", signature);
    fd.append("folder", folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: fd,
    });

    const json = await uploadRes.json();
    if (!uploadRes.ok) {
      throw new Error(json.error?.message || "Cloudinary upload failed");
    }
    return json;
  }

  // -----------------------
  // Upload images to an event (direct to Cloudinary)
  // -----------------------
  async function handleFilesUpload(e) {
    e?.preventDefault?.();
    const targetRaw = useExisting ? selectedEvent : eventName;
    const target = String(targetRaw || "").trim();
    if (!target) return alert("Please choose or enter an event name.");
    const toUpload = singleFile ? [singleFile] : files;
    if (!toUpload || toUpload.length === 0) return alert("Pick one or more images to upload.");

    const valid = toUpload.filter(isValidImageFile);
    const invalidCount = toUpload.length - valid.length;
    if (invalidCount > 0) {
      updateStatus(
        `Rejected ${invalidCount} file(s). Allowed: ${allowedExts.join(", ") || "images"}`,
        "error"
      );
    }
    if (valid.length === 0)
      return alert("No valid image files to upload. Allowed types: " + (allowedExts.join(", ") || "images"));

    updateStatus("Uploading to Cloudinary...", "info");
    try {
      const uploadedItems = [];
      let i = 1;
      for (const f of valid) {
        updateStatus(`Uploading ${i}/${valid.length}...`, "info");
        const uploadRes = await uploadToCloudinary(f, `events/${target}`);
        uploadedItems.push({
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id,
        });
        i++;
      }

      const metaRes = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploaded: uploadedItems, eventName: target }),
      });

      const metaBody = await metaRes.json();
      if (!metaRes.ok) throw new Error(metaBody.error || "Failed to save metadata");

      if (metaBody.gallery) setGallery(metaBody.gallery);
      if (metaBody.slider) setHeroGallery(metaBody.slider);
      if (!metaBody.gallery && !metaBody.slider) await loadGallery();

      setSelectedEvent(target);
      setFiles([]);
      setSingleFile(null);
      setEventName("");
      updateStatus("Uploaded successfully", "success");
    } catch (err) {
      console.error("handleFilesUpload error:", err);
      updateStatus("Error: " + (err.message || String(err)), "error");
    }
  }

  // -----------------------
  // Rename event
  // -----------------------
  async function renameEvent() {
    if (!selectedEvent) return alert("Select an event to rename.");
    const current = selectedEvent;
    const suggested = current.replace(/_/g, " ");
    const newNameRaw = prompt(`Rename event "${suggested}" to:`, suggested);
    if (!newNameRaw) return;
    const newName = newNameRaw.trim();
    if (!newName) return alert("Please provide a non-empty name.");
    const newKey = newName.replace(/\s+/g, "_");

    updateStatus("Renaming event...", "info");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renameEvent: true, oldName: current, newName: newKey }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Server refused rename");
      setGallery(body.gallery || (await loadGallery()) || {});
      setSelectedEvent(newKey);
      updateStatus("Renamed successfully", "success");
    } catch (err) {
      updateStatus("Error renaming: " + (err.message || String(err)), "error");
    }
  }

  // -----------------------
  // delete entire event
  // -----------------------
  async function handleDeleteEvent(ev) {
    if (!ev) return alert("Select an event to delete.");
    if (HERO_KEYS.has(ev)) {
      return alert("Cannot delete the home slider here.");
    }
    if (!confirm(`Delete entire event '${ev}' and all its photos?`)) return;
    updateStatus("Deleting event...", "info");
    try {
      const res = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: ev, deleteEvent: true, hero: false }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Delete failed");
      setGallery(body.gallery || (await loadGallery()) || {});
      setHeroGallery(body.slider || body.home_slider || []);
      setSelectedEvent("");
      updateStatus(`Deleted ${ev}`, "success");
    } catch (err) {
      updateStatus("Error: " + (err.message || String(err)), "error");
    }
  }

  // -----------------------
  // delete single image
  // -----------------------
  async function deleteImageFromServer(event, url, opts = { hero: false }) {
    let targetUrl = typeof url === "string" && url.trim() ? url : null;

    if (!targetUrl && event && gallery[event] && Array.isArray(gallery[event])) {
      for (const it of gallery[event]) {
        const u = getImgUrl(it);
        if (u) {
          targetUrl = u;
          break;
        }
        if (it && it.url) {
          targetUrl = it.url;
          break;
        }
      }
    }

    if (!targetUrl && (opts.hero || HERO_KEYS.has(event))) {
      for (const it of heroGallery || []) {
        const u = getImgUrl(it);
        if (u) {
          targetUrl = u;
          break;
        }
        if (it && it.url) {
          targetUrl = it.url;
          break;
        }
      }
    }

    if (!targetUrl) {
      return alert("No image URL provided to delete.");
    }

    if (!confirm("Remove this image / link?")) return;

    updateStatus("Removing...", "info");
    try {
      const res = await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: opts.hero ? "home_slider" : event,
          url: targetUrl,
          hero: !!opts.hero,
        }),
      });

      const text = await res.text().catch(() => "");
      let body;
      try {
        body = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Invalid server response");
      }

      if (!res.ok) throw new Error(body?.error || `Delete failed (status ${res.status})`);

      setGallery(body.gallery || (await loadGallery()) || {});
      setHeroGallery(body.slider || body.home_slider || []);
      updateStatus("Removed successfully", "success");
    } catch (err) {
      updateStatus("Error: " + (err.message || String(err)), "error");
    }
  }

  // -----------------------
  // hero upload
  // -----------------------
  async function handleHeroUpload() {
    if (!heroFiles || heroFiles.length === 0) return alert("Select hero images first.");
    const validHero = heroFiles.filter(isValidImageFile);
    const invalidHeroCount = heroFiles.length - validHero.length;
    if (invalidHeroCount > 0) {
      updateStatus(
        `Rejected ${invalidHeroCount} hero file(s). Allowed: ${allowedExts.join(", ") || "images"}`,
        "error"
      );
    }
    if (validHero.length === 0) return alert("No valid hero image files to upload.");
    setHeroUploading(true);
    updateStatus("Uploading hero images...", "info");
    try {
      const uploaded = [];
      let i = 1;
      for (const f of validHero) {
        updateStatus(`Uploading hero ${i}/${validHero.length}...`, "info");
        const uploadRes = await uploadToCloudinary(f, `slider`);
        uploaded.push({ url: uploadRes.secure_url, public_id: uploadRes.public_id });
        i++;
      }

      const metaRes = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploaded, hero: true, eventName: "home_slider" }),
      });

      let metaBody = {};
      try {
        metaBody = await metaRes.json();
      } catch (e) {
        console.warn("handleHeroUpload: non-JSON response, reloading gallery", e);
        await loadGallery();
        setHeroFiles([]);
        setHeroPreview(EXAMPLE_LOCAL_PATH);
        updateStatus("Hero uploaded (server returned non-JSON)", "success");
        return;
      }

      if (!metaRes.ok) throw new Error(metaBody.error || "Hero metadata save failed");

      if (metaBody.slider || metaBody.home_slider) {
        setHeroGallery(metaBody.slider || metaBody.home_slider || []);
      } else {
        setGallery(metaBody.gallery || gallery);
        await loadGallery();
      }

      setHeroFiles([]);
      setHeroPreview(EXAMPLE_LOCAL_PATH);
      updateStatus("Hero uploaded successfully", "success");
    } catch (err) {
      updateStatus("Error: " + (err.message || String(err)), "error");
    } finally {
      setHeroUploading(false);
    }
  }

  function onHeroFilesChange(e) {
    const list = Array.from(e.target.files || []);
    const valid = list.filter(isValidImageFile);
    const rejected = list.length - valid.length;
    if (rejected > 0)
      updateStatus(
        `Rejected ${rejected} hero file(s). Allowed: ${allowedExts.join(", ") || "images"}`,
        "error"
      );
    setHeroFiles(valid);
    if (valid.length > 0) setHeroPreview(URL.createObjectURL(valid[0]));
  }

  function onSingleFileChange(e) {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setSingleFile(null);
      return;
    }
    if (!isValidImageFile(f)) {
      setSingleFile(null);
      updateStatus(
        "Invalid file selected. Allowed types: " + (allowedExts.join(", ") || "images"),
        "error"
      );
      return;
    }
    setSingleFile(f);
  }

  function onMultipleFilesChange(e) {
    const list = Array.from(e.target.files || []);
    const valid = list.filter(isValidImageFile);
    const rejected = list.length - valid.length;
    if (rejected > 0)
      updateStatus(
        `Rejected ${rejected} file(s). Allowed: ${allowedExts.join(", ") || "images"}`,
        "error"
      );
    setFiles(valid);
  }

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    router.push("/admin-login");
  }

  function handleResetForm() {
    setFiles([]);
    setSingleFile(null);
    updateStatus("", "info");
  }

  // -----------------------
  // Add YouTube folder/link
  // -----------------------
  async function addYoutubeFolder() {
    const nameRaw = (eventName || selectedEvent || "youtube").trim();
    if (!nameRaw) return alert("Provide a folder name or select an event.");
    const en = nameRaw;

    const rawInput = (youtubeUrls || "").trim();
    let urls = [];
    if (rawInput) {
      urls = rawInput
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (urls.length === 0) {
      const single = (prompt("Paste the YouTube URL:") || "").trim();
      if (!single) return alert("No URL provided.");
      urls = [single];
    }

    updateStatus(`Adding ${urls.length} YouTube link(s) to "${en}"...`, "info");

    const failures = [];
    let lastBody = null;

    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      try {
        const payload = { addYoutube: true, eventName: en, url: u };
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text().catch(() => "");
        let body;
        try {
          body = text ? JSON.parse(text) : {};
        } catch (e) {
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          throw new Error(body?.error || `Failed to add URL (status ${res.status})`);
        }

        lastBody = body;
        updateStatus(`Added ${i + 1}/${urls.length}`, "info");
      } catch (err) {
        failures.push({ url: u, message: err.message || String(err) });
      }
    }

    try {
      if (lastBody) {
        const newGallery = lastBody.gallery ?? lastBody ?? {};
        setGallery(newGallery);
        setHeroGallery(lastBody.slider ?? lastBody.home_slider ?? heroGallery);
      } else {
        await loadGallery();
      }
    } catch (e) {
      console.warn("Failed to update gallery after YouTube posts:", e);
    }

    if (failures.length === 0) {
      updateStatus("YouTube link(s) added successfully", "success");
      setEventName("");
      setYoutubeUrls("");
    } else {
      updateStatus(`Added ${urls.length - failures.length}/${urls.length} — ${failures.length} failed`, "error");
    }
  }

  // -----------------------
  // YouTube helpers
  // -----------------------
  function parseYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        return u.searchParams.get("v");
      } else if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }
      return null;
    } catch (e) {
      const m = url.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{6,})/);
      return m ? m[1] : null;
    }
  }

  function youtubeThumbUrl(url) {
    const id = parseYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }

  function isYoutubeFolder(ev) {
    const items = gallery[ev];
    return Array.isArray(items) && items.length > 0 && items[0]?.youtube === true;
  }

  function youTubeEmbedSrc(url) {
    const id = parseYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  const youtubeFolders = Object.entries(gallery).filter(
    ([k, items]) => Array.isArray(items) && items.length > 0 && items[0]?.youtube === true
  );

  // Status icon component
  const StatusIcon = () => {
    if (statusType === "success") return <FaCheck className="text-green-400" />;
    if (statusType === "error") return <UseAnimations animation={alertCircle} size={20} strokeColor="#f87171" />;
    return <UseAnimations animation={loading2} size={20} strokeColor="#f8d46a" />;
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]">
        <div className="glass-card p-8 text-center">
          <UseAnimations animation={loading2} size={56} strokeColor="#f8d46a" />
          <div className="mt-4 text-[#f5f5f1]">Loading...</div>
        </div>
      </div>
    );
  }

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6 mb-6 border-2 border-[#c9a35e]/30"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#f7e7b7] mb-2">Admin Dashboard</h1>
              <div className="text-sm text-[#d5c08a]">AR Foundation — Event Photos Management</div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Status Bar */}
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                  statusType === "success"
                    ? "bg-green-500/10 border border-green-500/30"
                    : statusType === "error"
                    ? "bg-red-500/10 border border-red-500/30"
                    : "bg-blue-500/10 border border-blue-500/30"
                }`}
              >
                <StatusIcon />
                <span
                  className={`text-sm ${
                    statusType === "success"
                      ? "text-green-200"
                      : statusType === "error"
                      ? "text-red-200"
                      : "text-blue-200"
                  }`}
                >
                  {status}
                </span>
                <motion.button
                  onClick={() => updateStatus("", "info")}
                  className="ml-auto text-white/50 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - Upload Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Upload Card */}
            <div className="glass-card p-6 border-2 border-[#c9a35e]/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20">
                  <FaUpload className="text-2xl text-[#f8d46a]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#f7e7b7]">Upload Event Photos</h2>
                  <div className="text-sm text-[#d5c08a]">Add images to existing or new events</div>
                </div>
              </div>

              <form onSubmit={handleFilesUpload} className="space-y-5">
                {/* Radio Buttons */}
                <div className="flex gap-4">
                  <motion.label
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      useExisting
                        ? "bg-gradient-to-r from-[#c9a35e]/20 to-[#f8d46a]/20 border-2 border-[#f8d46a]"
                        : "bg-black/20 border-2 border-[#c9a35e]/30"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      checked={useExisting}
                      onChange={() => setUseExisting(true)}
                      className="accent-[#f8d46a]"
                    />
                    <span className="text-[#f5f5f1] font-semibold">Use Existing</span>
                  </motion.label>

                  <motion.label
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      !useExisting
                        ? "bg-gradient-to-r from-[#c9a35e]/20 to-[#f8d46a]/20 border-2 border-[#f8d46a]"
                        : "bg-black/20 border-2 border-[#c9a35e]/30"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      checked={!useExisting}
                      onChange={() => setUseExisting(false)}
                      className="accent-[#f8d46a]"
                    />
                    <span className="text-[#f5f5f1] font-semibold">Create New</span>
                  </motion.label>
                </div>

                {/* Event Selection/Creation */}
                {useExisting ? (
                  <div>
                    <label className="block text-sm font-semibold text-[#d5c08a] mb-2">Select Event</label>
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
                    >
                      <option value="">-- Select Event --</option>
                      {events.map((ev) => (
                        <option key={ev} value={ev}>
                          {ev.replace(/_/g, " ")} ({safeCount(ev)})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-[#d5c08a] mb-2">New Event Name</label>
                    <input
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="e.g. Annual Meeting 2025"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
                    />
                  </div>
                )}

                {/* Single File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#d5c08a] mb-2">
                    Single Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onSingleFileChange}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-[#c9a35e] file:to-[#f8d46a] file:text-black file:font-semibold hover:file:cursor-pointer"
                  />
                </div>

                <div className="text-center">
                  <div className="text-[#f8d46a] font-bold">OR</div>
                </div>

                {/* Multiple Files Upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#d5c08a] mb-2">
                    Multiple Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onMultipleFilesChange}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-[#c9a35e] file:to-[#f8d46a] file:text-black file:font-semibold hover:file:cursor-pointer"
                  />
                  <div className="text-xs text-[#d5c08a] mt-2">{files.length} file(s) selected</div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    type="button"
                    onClick={handleFilesUpload}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#c9a35e] to-[#f8d46a] text-black font-bold shadow-2xl hover:shadow-[#f8d46a]/50 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaUpload />
                    <span>Upload Photos</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={renameEvent}
                    className="px-6 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] font-semibold hover:bg-[#c9a35e]/20 transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaEdit />
                    <span>Rename</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleResetForm}
                    className="px-6 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] font-semibold hover:bg-[#c9a35e]/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Gallery Section */}
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border-2 border-[#c9a35e]/30"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FaImages className="text-2xl text-[#f8d46a]" />
                    <h3 className="text-xl font-bold text-[#f7e7b7]">
                      {selectedEvent.replace(/_/g, " ")}
                    </h3>
                  </div>
                  <motion.button
                    onClick={() => setSelectedEvent("")}
                    className="p-2 rounded-lg bg-black/40 text-[#f5f5f1] hover:bg-red-500/20 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes />
                  </motion.button>
                </div>

                {isYoutubeFolder(selectedEvent) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(gallery[selectedEvent] || []).map((item, i) => {
                      const url = item?.url || "";
                      const embed = youTubeEmbedSrc(url);
                      const title = item?.title || `Video ${i + 1}`;
                      return (
                        <div key={i} className="glass-card p-4 border border-[#c9a35e]/20">
                          <div className="font-semibold text-[#f5f5f1] mb-3">{title}</div>
                          {embed ? (
                            <div className="relative" style={{ paddingTop: "56.25%" }}>
                              <iframe
                                src={embed}
                                title={title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-gray-800 flex items-center justify-center rounded-lg">
                              <span className="text-sm text-gray-400">Invalid URL</span>
                            </div>
                          )}
                          <div className="mt-3 flex items-center justify-between">
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                            >
                              <FaYoutube />
                              <span>Open</span>
                            </a>
                            <button
                              onClick={() => deleteImageFromServer(selectedEvent, url)}
                              className="text-sm text-red-400 hover:text-red-300 underline flex items-center gap-1"
                            >
                              <FaTrash />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(gallery[selectedEvent] || [])
                      .filter((img) => !heroUrlSet.has(getImgUrl(img)))
                      .map((img, i) => {
                        const src = safeSrc(img);
                        const url = getImgUrl(img);
                        return (
                          <motion.div
                            key={i}
                            className="glass-card overflow-hidden border border-[#c9a35e]/20"
                            whileHover={{ y: -5 }}
                          >
                            {src ? (
                              <img src={src} alt={`img-${i}`} className="w-full h-40 object-cover" />
                            ) : (
                              <div className="w-full h-40 bg-gray-800 flex items-center justify-center">
                                <span className="text-sm text-gray-400">No preview</span>
                              </div>
                            )}
                            <div className="p-3 flex items-center justify-between">
                              <a
                                href={src || url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                              >
                                <FaEye />
                                <span>View</span>
                              </a>
                              <button
                                onClick={() => deleteImageFromServer(selectedEvent, url)}
                                className="text-sm text-red-400 hover:text-red-300 underline flex items-center gap-1"
                              >
                                <FaTrash />
                                <span>Remove</span>
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT - Events List */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass-card p-6 border-2 border-[#c9a35e]/30 h-fit"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaFolder className="text-xl text-[#f8d46a]" />
                <h3 className="text-lg font-bold text-[#f7e7b7]">Events</h3>
              </div>
              {selectedEvent && (
                <motion.button
                  onClick={() => handleDeleteEvent(selectedEvent)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTrash />
                </motion.button>
              )}
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-auto pr-2 scrollbar-custom">
              {events.length === 0 && (
                <div className="text-sm text-[#d5c08a] text-center py-8">No events yet</div>
              )}

              {events.map((ev) => (
                <motion.div
                  key={ev}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedEvent === ev
                      ? "bg-gradient-to-r from-[#c9a35e]/20 to-[#f8d46a]/20 border-2 border-[#f8d46a]"
                      : "bg-black/20 border-2 border-[#c9a35e]/20 hover:bg-[#c9a35e]/10"
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#f5f5f1]">{ev.replace(/_/g, " ")}</div>
                      <div className="text-xs text-[#d5c08a] mt-1">{safeCount(ev)} photos</div>
                    </div>
                    <FaChevronRight className={`text-[#f8d46a] transition-transform ${selectedEvent === ev ? 'rotate-90' : ''}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        </div>

        {/* Hero Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 glass-card p-6 border-2 border-[#c9a35e]/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20">
              <FaHome className="text-2xl text-[#f8d46a]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f7e7b7]">Home Carousel Images</h3>
              <div className="text-sm text-[#d5c08a]">Upload images for the hero section on homepage</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Preview */}
            <div>
              <div className="w-full h-48 bg-gray-800 rounded-xl overflow-hidden mb-4">
                {heroPreview ? (
                  <img src={heroPreview} className="w-full h-full object-cover" alt="hero preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    No preview
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onHeroFilesChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-[#c9a35e] file:to-[#f8d46a] file:text-black file:font-semibold hover:file:cursor-pointer mb-2"
              />

              <div className="text-xs text-[#d5c08a] mb-4">{heroFiles.length} file(s) selected</div>

              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={handleHeroUpload}
                  disabled={heroUploading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c9a35e] to-[#f8d46a] text-black font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: heroUploading ? 1 : 1.03, y: heroUploading ? 0 : -2 }}
                  whileTap={{ scale: heroUploading ? 1 : 0.98 }}
                >
                  <FaHome />
                  <span>{heroUploading ? "Uploading..." : "Upload to Carousel"}</span>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setHeroFiles([]);
                    setHeroPreview(EXAMPLE_LOCAL_PATH);
                  }}
                  className="px-6 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] font-semibold hover:bg-[#c9a35e]/20 transition-all duration-300"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset
                </motion.button>
              </div>
            </div>

            {/* Current Hero Images */}
            <div className="lg:col-span-2">
              <h4 className="text-lg font-bold text-[#f7e7b7] mb-4">Current Hero Images</h4>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {heroGallery.length === 0 && (
                  <div className="col-span-full text-center text-[#d5c08a] py-8">No hero images yet</div>
                )}

                {heroGallery.map((h, i) => {
                  const src = safeSrc(h);
                  const url = getImgUrl(h);
                  return (
                    <motion.div
                      key={i}
                      className="glass-card overflow-hidden border border-[#c9a35e]/20"
                      whileHover={{ y: -5 }}
                    >
                      {src ? (
                        <img src={src} className="w-full h-32 object-cover" alt={`hero-${i}`} />
                      ) : (
                        <div className="w-full h-32 bg-gray-800 flex items-center justify-center">
                          <span className="text-sm text-gray-400">No preview</span>
                        </div>
                      )}
                      <div className="p-3 flex items-center justify-between">
                        <a
                          href={src || url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                        >
                          <FaEye />
                          <span>View</span>
                        </a>
                        <button
                          onClick={() => deleteImageFromServer("home_slider", url, { hero: true })}
                          className="text-sm text-red-400 hover:text-red-300 underline flex items-center gap-1"
                        >
                          <FaTrash />
                          <span>Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* YouTube Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 glass-card p-6 border-2 border-[#c9a35e]/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#c9a35e]/20 to-[#f8d46a]/20">
              <FaYoutube className="text-2xl text-[#f8d46a]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#f7e7b7]">YouTube Videos</h3>
              <div className="text-sm text-[#d5c08a]">Add YouTube links to events</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Folder name (or select an event)"
                className="flex-1 px-4 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300"
              />
              <motion.button
                onClick={addYoutubeFolder}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c9a35e] to-[#f8d46a] text-black font-bold shadow-xl hover:shadow-[#f8d46a]/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Add YouTube
              </motion.button>
              <motion.button
                onClick={() => { setEventName(""); setYoutubeUrls(""); updateStatus("", "info"); }}
                className="px-6 py-3 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] font-semibold hover:bg-[#c9a35e]/20 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear
              </motion.button>
            </div>

            <textarea
              value={youtubeUrls}
              onChange={(e) => setYoutubeUrls(e.target.value)}
              placeholder="Paste one or more YouTube URLs (newline or comma separated)"
              className="w-full p-4 rounded-xl bg-black/40 border-2 border-[#c9a35e]/30 text-[#f5f5f1] placeholder:text-[#f5f5f1]/40 outline-none focus:ring-2 focus:ring-[#f8d46a] focus:border-[#f8d46a] transition-all duration-300 resize-y min-h-[100px]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {youtubeFolders.length === 0 && (
                <div className="col-span-full text-center text-[#d5c08a] py-8">No YouTube links yet</div>
              )}

              {youtubeFolders.map(([folder, items]) => {
                const url = items?.[0]?.url || "";
                const thumb = youtubeThumbUrl(url);
                return (
                  <motion.div
                    key={folder}
                    className="glass-card p-4 border border-[#c9a35e]/20"
                    whileHover={{ y: -5 }}
                  >
                    <div className="font-semibold text-[#f5f5f1] mb-3">{folder.replace(/_/g, " ")}</div>
                    <div className="h-40 mb-3 rounded-lg overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={`yt-${folder}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <span className="text-sm text-gray-400">No thumbnail</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 justify-between">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-[#c9a35e] to-[#f8d46a] text-black rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        Open Link
                      </a>
                      <button
                        onClick={() => deleteImageFromServer(folder, url)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
