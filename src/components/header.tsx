"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageIcon, Menu, X } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-[#06060a]/80 backdrop-blur-xl border-b border-white/[0.04] shadow-[0_1px_40px_rgba(0,0,0,0.5)]"
        : "bg-transparent"
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-shadow">
            <ImageIcon className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Pixel<span className="gradient-text">Forge</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/tools", label: "Tools" },
            { href: "/pricing", label: "Pricing" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all duration-200">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link href="/tools/remove-bg" className="hidden md:inline-flex neon-btn px-5 py-2.5 text-sm">
          <span className="flex items-center gap-1.5">Try Free →</span>
        </Link>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl hover:bg-white/[0.04] transition-colors" aria-label="Menu">
          {open ? <X className="h-5 w-5 text-zinc-300" /> : <Menu className="h-5 w-5 text-zinc-300" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
        open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-4 pb-4 space-y-1 bg-[#06060a]/95 backdrop-blur-xl border-t border-white/[0.04]">
          {[
            { href: "/tools", label: "Tools" },
            { href: "/pricing", label: "Pricing" },
          ].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/tools/remove-bg" onClick={() => setOpen(false)}
            className="block mt-2 rounded-xl neon-btn px-4 py-3 text-center text-sm">
            <span>Try Free — Remove Background</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
