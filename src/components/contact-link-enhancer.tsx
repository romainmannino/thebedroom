"use client";

import { useEffect } from "react";

export function ContactLinkEnhancer() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";

      if (!href.startsWith("sms:+33627630932")) return;

      event.preventDefault();
      window.location.href = "/api/contact/whatsapp";
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
