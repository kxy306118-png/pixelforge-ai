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
    "Free AI-powered image tools. Remove backgrounds, upscale photos, compress images, convert formats, and more — all in your browser. No signup required.",
  keywords: [
    "remove background", "image upscale", "compress image", "convert image",
    "AI image tools", "free image editor", "background remover", "image resize",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PixelForge AI",
    title: "PixelForge AI — Free AI Image Tools",
    description: "Remove backgrounds, upscale photos, compress images, and more — all powered by AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelForge AI — Free AI Image Tools",
    description: "Remove backgrounds, upscale, compress images with AI. Free, no signup.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <head>
        {/* Google AdSense — replace with your actual publisher ID */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" /> */}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
