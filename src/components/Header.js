// src/app/components/Header.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";



export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const navItems = ["Home", "About", "Programs", "Gallery", "Contact"];

  return (
<header className="w-full z-50 fixed top-0 left-0 bg-gradient-to-br from-[#1a1a1a] via-[#3d2b1f] to-[#c9a35e]">
      {/* DESKTOP */}
      <div className="hidden  lg:flex items-center justify-between p-6 sticky top-0 z-40">
        
        <div className="flex items-center gap-1">
          <img
            src="/turst-logo (2).png"
            alt="Logo"
            className="w-25 h-25 ml-9  rounded-md object-cover"
          />

        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
          <Link
            href="/"
            className="inline-block text-2xl font-serif font-bold bg-gradient-to-r from-[#c9a35e] via-[#e8d39f] to-[#f7e7b7] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]" style={{marginTop:"20px"}}
          >
            AR Foundation
          </Link>
          </motion.div>
        </div>

        <nav className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 text-[15px] font-semibold text-[#f1f1e9]">
            {navItems.map((item) => {
              const href = `/${item === "Home" ? "" : item.toLowerCase()}`;
              return (
                <Link
                  key={item}
                  href={href}
                  className="relative inline-block transition hover:text-[#fff3c4] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#f8d46a] after:transition-all hover:after:w-full"
                >
                  {item}
                </Link>
              );
            })}
          </div>

          <Link
            href="/donate"
            className="bg-[#f8d46a] text-black px-4 py-2 rounded-md font-bold hover:bg-[#fff3c4] transition"
          >
            Donate
          </Link>
        </nav>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden fixed top-1 left-1/2 -translate-x-1/2 w-[98%] z-10">
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#3d2b1f] to-[#c9a35e] backdrop-blur-xl  px-3 py-4 shadow flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/turst-logo.webp"
              alt="Logo"
              className="w-20 h-10 rounded-md object-cover"
            />

            <Link href="/" className="text-base sm:text-lg font-serif font-bold text-[#f7e7b7]">
              AR Foundation
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg ring-1 ring-[#f7e7b7]/50 hover:bg-white/10 transition"
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <svg width="25" height="25" stroke="#f7e7b7" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`mt-2 overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm shadow transition-all ${
            open ? "max-h-72" : "max-h-0"
          }`}
        >
          <nav className="px-3 py-3">
            <ul className="flex flex-col gap-2 text-sm text-[#f1f1e9]">
              {navItems.map((item) => {
                const href = `/${item === "Home" ? "" : item.toLowerCase()}`;
                return (
                  <Link
                    key={item}
                    href={href}
                    className="px-2 py-2 rounded hover:bg-[#3d2b1f]/40 hover:text-[#fff3c4] transition"
                  >
                    {item}
                  </Link>
                );
              })}
            </ul>

            <div className="mt-3">
              <Link
                href="/donate"
                className="w-full block text-center px-3 py-2 bg-[#f8d46a] text-black rounded font-bold hover:bg-[#fff3c4] transition"
              >
                Donate
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* spacing for mobile */}
      <div className="lg:hidden h-20" />
    </header>
  );
}
