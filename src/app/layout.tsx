import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PixelForge AI — Free AI Image Tools | Remove BG, Upscale, Compress",
    template: "%s | PixelForge AI",
  },
  description:
    "Free AI-powered image tools. Remove backgrounds, upscale photos, compress images — all in your browser. No signup required.",
  keywords: [
    "remove background", "image upscale", "compress image", "convert image",
    "AI image tools", "free image editor", "background remover", "image resize",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} dark`}>
      <head>
        {/* Google AdSense — uncomment and add your publisher ID
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" />
        */}
      </head>
      <body className="min-h-screen bg-[#06060a] text-zinc-200 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
