import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: "Experience artisanal hair styling, balayage, deep cleansing facials, and luxury spa rituals at Beverly Hills' premier boutique salon.",
  keywords: ["salon", "haircut", "balayage", "facial", "manicure", "head spa", "luxury salon"],
  authors: [{ name: siteConfig.name }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#1C1917] antialiased selection:bg-[#B8976C] selection:text-white">
        {children}
      </body>
    </html>
  );
}
