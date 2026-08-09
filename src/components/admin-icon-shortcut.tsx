"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function AdminIconShortcut() {
  const pathname = usePathname();
  if (!pathname.startsWith("/admin") || pathname === "/admin/icone") return null;
  return <Link href="/admin/icone" className="fixed bottom-4 right-4 z-[90] flex min-h-11 items-center gap-2 rounded-full bg-black px-4 text-xs font-black text-white shadow-xl"><ImageIcon size={16}/>Logo & icône</Link>;
}
