// src/app/donate/qr/page.js
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Component that uses useSearchParams
function QRContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramName = searchParams?.get("name") ?? "";
  const paramPhone = searchParams?.get("phone") ?? "";
  const paramAmount = searchParams?.get("amount") ?? "";

  // decoded friendly strings
  const [name, setName] = useState(paramName);
  const [phone, setPhone] = useState(paramPhone);
  const [amount, setAmount] = useState(paramAmount);

  // build UPI deep link (modify pa/pn to your actual UPI id / payee)
  const upiId = "gopi.chand21@ybl"; // change if needed
  const payeeName = "AR Foundation";

  // transaction note includes donor name and phone (if present)
  const txnNoteParts = [];
  if (name) txnNoteParts.push(`Donor:${name}`);
  if (phone) txnNoteParts.push(`Phone:${phone}`);
  if (amount) txnNoteParts.push(`Amt:${amount}`);
  const txnNote = txnNoteParts.join(" | ") || "Donation";

  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&tn=${encodeURIComponent(txnNote)}${amount ? `&am=${encodeURIComponent(amount)}` : ""}`;

  // QR image source via qrserver public API
  const qrData = upiLink;
  const qrSize = 400;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrData)}&margin=8`;

  useEffect(() => {
    // if name/phone are missing, you may want to redirect back; optional:
    if (!name && !phone) {
      // keep this optional; comment out to avoid auto-redirect
      // router.push("/donate");
    }
  }, [name, phone, router]);

  function handleCopyUPI() {
    navigator.clipboard?.writeText(upiLink).then(() => {
      alert("UPI link copied to clipboard. Paste into your UPI app or browser.");
    }, () => {
      alert("Could not copy. Please copy manually.");
    });
  }

  return (
    <div className="py-12">
      <section className="max-w-md mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2 text-[#f7e7b7]">
          Thank you, {name || "donor"}!
        </h2>

        <p className="text-sm text-[#d5c08a] mb-6">
          Scan the QR below with your UPI app to complete the donation.
        </p>

        <div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl shadow-lg inline-block border border-[#c9a35e]/20">
          {/* Display donor name above QR */}
          <div className="mb-4">
            <div className="text-sm text-[#d5c08a]">Donor</div>
            <div className="text-lg font-semibold text-[#f5f5f1]">{name || "—"}</div>
          </div>

          {/* QR image */}
          <div className="mb-4">
            <img src={qrApi} alt="Donation QR code" className="w-64 h-64 object-contain rounded" />
          </div>

          {/* phone / amount info */}
          <div className="mb-4 text-sm text-[#f5f5f1]">
            {phone && <div>Phone: {phone}</div>}
            {amount && <div>Amount: ₹{amount}</div>}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={handleCopyUPI} className="px-4 py-2 bg-[#f8d46a] text-black rounded font-semibold hover:bg-[#fff3c4] transition">
              Copy UPI Link
            </button>

            <a href={qrApi} download={`sahaya-qr-${name || "donor"}.png`} className="px-4 py-2 border rounded text-[#f5f5f1] hover:border-[#c9a35e] transition">
              Download QR
            </a>
          </div>
        </div>

        <div className="mt-6 text-sm text-[#d5c08a]">
          If your UPI app allows direct scan, use the QR scanner; otherwise copy the UPI link.
        </div>

        <div className="mt-6">
          <a href="/" className="text-sm text-[#f5f5f1] hover:text-[#fff3c4]">Back to home</a>
        </div>
      </section>
    </div>
  );
}

// Main component with Suspense wrapper
export default function DonateQRPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#f8d46a] text-xl">Generating QR Code...</div>
      </div>
    }>
      <QRContent />
    </Suspense>
  );
}
