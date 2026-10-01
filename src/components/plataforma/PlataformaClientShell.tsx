"use client";

import { type ReactNode } from "react";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import CustomCursor from "@/components/layout/CustomCursor";
import Footer from "@/components/layout/Footer";
import PlataformaNav from "./PlataformaNav";
import { MessageCircle } from "lucide-react";

interface PlataformaClientShellProps {
  children: ReactNode;
}

export default function PlataformaClientShell({ children }: PlataformaClientShellProps) {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <PlataformaNav />
      <main className="relative min-h-screen" style={{ background: "var(--color-vt-bg)" }}>
        {children}
      </main>
      <Footer />

      {/* Floating WhatsApp Quick Contact Button */}
      <div className="fixed right-5 bottom-6 z-50">
        <a
          href="https://wa.me/5519999999999?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20Vertex%20OS%20criador%20de%20sites"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir conversa no WhatsApp"
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.5)] transition-all hover:scale-110 active:scale-95"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
        </a>
      </div>
    </SmoothScrollProvider>
  );
}
