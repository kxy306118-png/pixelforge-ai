import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PixelForge AI — All-in-One AI Creative Toolkit",
  description: "AI-powered image, video, audio & text tools. Remove backgrounds, upscale images, generate videos, transcribe audio, and more.",
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
