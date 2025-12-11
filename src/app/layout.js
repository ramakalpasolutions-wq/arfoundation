// src/app/layout.js
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "AR Foundation",
  description: "Serving humanity with compassion.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased bg-gradient-to-br from-[#1a1a1a] via-[#3d2b1f] to-[#c9a35e] text-[var(--foreground)] min-h-screen"
      >
        <Header />
        <main className="min-h-screen  text-white pt-24 lg:pt-30">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
