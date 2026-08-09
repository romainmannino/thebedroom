import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ContactLinkEnhancer } from "@/components/contact-link-enhancer";
import { LocalWeatherPill } from "@/components/local-weather-pill";
import { AppWebEnhancer } from "@/components/app-web-enhancer";
import { DynamicAppIcon } from "@/components/dynamic-app-icon";
import { AdminIconShortcut } from "@/components/admin-icon-shortcut";
import { supabaseAdmin } from "@/lib/supabase-admin";
import "./globals.css";
import "./mobile-fixes.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  let appIcon = "/favicon.ico";

  try {
    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("id")
      .eq("slug", "the-bedroom")
      .single();

    if (property) {
      const { data } = await supabaseAdmin
        .from("guide_home_settings")
        .select("configuration")
        .eq("property_id", property.id)
        .maybeSingle();

      const configured = (data?.configuration as { appIcon?: string } | undefined)?.appIcon;
      if (configured) appIcon = configured;
    }
  } catch {}

  const title = "The Bedroom";
  const description = "Livret d’accueil The Bedroom à Jonage";

  return {
    metadataBase: new URL("https://www.thebedroom.fr"),
    title,
    description,
    manifest: "/manifest.webmanifest",
    icons: { icon: appIcon, shortcut: appIcon, apple: appIcon },
    openGraph: {
      type: "website",
      url: "https://www.thebedroom.fr",
      siteName: "The Bedroom",
      title,
      description,
      images: [{ url: appIcon, alt: "The Bedroom" }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [appIcon],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
    <body className="min-h-full flex flex-col">
      <ContactLinkEnhancer />
      <LocalWeatherPill />
      <DynamicAppIcon />
      <AppWebEnhancer />
      <AdminIconShortcut />
      {children}
    </body>
  </html>;
}
