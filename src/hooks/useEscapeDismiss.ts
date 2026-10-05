"use client";

import { useEffect } from "react";

export function useEscapeDismiss(open: boolean, dismiss: () => void): void {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent): void => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, dismiss]);
}
