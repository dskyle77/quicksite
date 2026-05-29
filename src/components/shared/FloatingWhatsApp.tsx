"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  phone: string;
  message?: string;
  businessName?: string;
}

export default function FloatingWhatsApp({
  phone,
  message = "Hi, I'm interested in your services.",
  businessName,
}: FloatingWhatsAppProps) {
  if (!phone) return null;

  const cleanPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={30} fill="currentColor" />
      {businessName && (
        <span className="absolute right-16 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100">
          Chat with {businessName}
        </span>
      )}
    </a>
  );
}
