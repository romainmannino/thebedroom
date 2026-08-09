"use client";

import { useEffect } from "react";

export function DynamicAppIcon() {
  useEffect(() => {
    fetch("/api/appearance", { cache: "no-store" }).then((r) => r.json()).then((data) => {
      const icon = data?.configuration?.appIcon;
      if (!icon) return;
      ["icon", "shortcut icon", "apple-touch-icon"].forEach((rel) => {
        let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
        if (!link) { link = document.createElement("link"); link.rel = rel; document.head.appendChild(link); }
        link.href = icon;
      });
    }).catch(() => undefined);
  }, []);
  return null;
}
