"use client";

import { type ReactNode } from "react";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/ui/Preloader";
import CommandPalette from "@/components/layout/CommandPalette";

interface ClientLandingShellProps {
  children: ReactNode;
}

export default function ClientLandingShell({ children }: ClientLandingShellProps) {
  return (
    <SmoothScrollProvider>
      <Preloader />
      <CustomCursor />
      <Navigation />
      <CommandPalette />
      {children}
      <Footer />
    </SmoothScrollProvider>
  );
}
