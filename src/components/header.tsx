"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageIcon, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/tools", label: "All Tools" },
  { href: "/pricing", label: "Pricing" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change (click link)
  const handleNav = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "glass border-b border-border/40 shadow-sm"
          : "bg-background/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg sm:text-xl group" onClick={handleNav}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-md shadow-violet-200/50 group-hover:shadow-lg group-hover:shadow-violet-300/50 transition-shadow">
            <ImageIcon className="h-5 w-5" />
          </div>
          <span>
            Pixel<span className="text-violet-500">Forge</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/tools/remove-bg"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200/50 hover:shadow-lg hover:shadow-violet-300/50 hover:from-violet-700 hover:to-violet-600 transition-all duration-200 btn-press"
          >
            Try Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 space-y-1 border-t border-border/40 bg-background/95 backdrop-blur-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNav}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/tools/remove-bg"
            onClick={handleNav}
            className="block mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3 text-center text-sm font-semibold text-white btn-press"
          >
            Try Free — Remove Background
          </Link>
        </div>
      </div>
    </header>
  );
}
