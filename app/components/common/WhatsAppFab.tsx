// components/WhatsAppFab.tsx
"use client";

import Image from "next/image";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966543145105";
const MESSAGE =
  "Hello, I am interested in your cargo services. Please share more details.";

export default function WhatsAppFab() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-fab"
      title="Chat on WhatsApp"
    >
      <Image
        src="/Icons/whatsapp.png"
        width={50}
        height={50}
        alt="WhatsApp Now"
        priority
      />
    </a>
  );
}
