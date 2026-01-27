// src/app/components/Footer.js
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full z-40 bg-gradient-to-br from-[#1a1a1a] via-[#3d2b1f] to-[#c9a35e] text-[#f1f1e9]">
      {/* CONTAINER */}
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* GRID: desktop 4-col, tablet 2-col, mobile single */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Social */}
          <div>
            <h3 className="font-bold mb-3 text-[#f7e7b7]">Follow Us</h3>
            <p className="text-sm mb-4 text-[#f1f1e9]">
              Stay connected — join our community on social media.
            </p>

            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#f8d46a] hover:text-[#fff3c4] transition"
              >
                <FaFacebookF className="text-xl" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#f8d46a] hover:text-[#fff3c4] transition"
              >
                <FaInstagram className="text-xl" />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[#f8d46a] hover:text-[#fff3c4] transition"
              >
                <FaTwitter className="text-xl" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[#f8d46a] hover:text-[#fff3c4] transition"
              >
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-3 text-[#f7e7b7]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#fff3c4]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#fff3c4]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-[#fff3c4]">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-[#fff3c4]">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#fff3c4]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold mb-3 text-[#f7e7b7]">About</h3>
            <p className="text-sm mb-2 text-[#f1f1e9]">
              AR Foundation supports underprivileged communities through food
              drives, education programs, medical camps, and emergency relief.
            </p>
            <p className="text-xs text-[#d5c08a]">
              Registered charity — empowering lives with care.
            </p>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold mb-3 text-[#f7e7b7]">Our Location</h3>

            <div className="w-full rounded overflow-hidden shadow-sm mb-3">
              <iframe
                width="100%"
                height="160"
                className="block"
                loading="lazy"
                title="AR Foundation Location"
                src="https://www.google.com/maps?q=Door+No.+1-42/4/C,+S.C+Colony,+Mandapadu+village,+Medikonduru+mandal,+Guntur+district,+522401&output=embed"
              />
            </div>

            <address className="not-italic text-sm leading-relaxed text-[#f1f1e9]">
            
              <br />
              
              <br />
            
              <br />
              
              <br />
              Guntur District – 522401
            </address>
          </div>
        </div>

        {/* bottom row: divider + copyright */}
        <div className="mt-8 pt-6 border-t border-[#2b2b2b] text-center">
          <p className="text-xs text-[#d5c08a]">
            © {year} AR Foundation. All rights reserved.
          </p>
           <a className="text-xs text-[#d5c08a]" href="https://www.ramakalpasolutions.in/">
            Designed by Ramakalpa Solutions
          </a>
        </div>
        
      </div>

      {/* MOBILE: a compact alternate layout (keeps markup small and readable)
      <div className="md:hidden px-5 pb-12">
        <div className="bg-[#00000040] rounded-xl p-5 mx-5 -mt-8 backdrop-blur-sm">
          <div className="mb-5">
            <h3 className="font-bold mb-2 text-[#f7e7b7]">Follow Us</h3>
            <div className="flex gap-6 text-[#f8d46a] text-xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-[#fff3c4] transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#fff3c4] transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-[#fff3c4] transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-[#fff3c4] transition"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          <div className="mb-5">
            <h4 className="font-bold mb-2 text-[#f7e7b7]">About</h4>
            <p className="text-sm text-[#f1f1e9]">
              AR Foundation supports underprivileged communities
              through food drives, education programs, medical camps, and
              emergency relief.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-[#f7e7b7]">Location</h4>
            <iframe
              width="100%"
              height="140"
              className="rounded shadow-sm mb-3"
              loading="lazy"
              title="Sahaya Trust Map (mobile)"
              src="https://www.google.com/maps?q=Door+No.+1-42/4/C,+S.C+Colony,+Mandapadu+village,+Medikonduru+mandal,+Guntur+district,+522401&output=embed"
            />
            <p className="text-sm text-[#f1f1e9]">
              Door No. 1-42/4/C, S.C Colony, Mandapadu Village, Medikonduru
              Mandal, Guntur District – 522002
            </p>
          </div>
        </div>

        <div className="h-20" />
      </div>
       */}
    </footer>
  );
}
