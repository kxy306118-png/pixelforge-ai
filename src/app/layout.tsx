import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://pixelforgeai.club"),
  title: {
    default: "PixelForge AI — All-in-One AI Creative Toolkit",
    template: "%s | PixelForge AI",
  },
  description: "AI-powered image, video, audio & text tools. Remove backgrounds, upscale images, generate videos, transcribe audio, and more.",
  keywords: ["AI image tools", "background remover", "image upscaler", "AI video generator", "speech to text", "image compressor", "AI writer", "PixelForge"],
  authors: [{ name: "PixelForge AI" }],
  creator: "PixelForge AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pixelforgeai.club",
    siteName: "PixelForge AI",
    title: "PixelForge AI — All-in-One AI Creative Toolkit",
    description: "AI-powered image, video, audio & text tools. Remove backgrounds, upscale images, generate videos, transcribe audio, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PixelForge AI — AI Creative Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelForge AI — All-in-One AI Creative Toolkit",
    description: "AI-powered image, video, audio & text tools. Remove backgrounds, upscale, generate videos, and more.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://pixelforgeai.club",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen bg-[#0a0a12] text-[#e8e8f0] antialiased`}>
        <I18nProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
