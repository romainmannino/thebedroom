import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ContactLinkEnhancer } from "@/components/contact-link-enhancer";
import { LocalWeatherPill } from "@/components/local-weather-pill";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Bedroom",
  description: "Livret d’accueil The Bedroom à Jonage",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ContactLinkEnhancer />
        <LocalWeatherPill />
        {children}
      </body>
    </html>
  );
}
