"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Globe, ChevronDown, LayoutDashboard, LogOut, Zap, ImageIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const navKeys = [
  { href: "/tools", labelKey: "nav.tools" },
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/docs", labelKey: "nav.help" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/contact", labelKey: "nav.contact" },
];

export function Header() {
  const { data: session } = useSession();
  const { lang, setLang, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const langLabel = lang === "zh" ? "🇨🇳 中文" : "🇺🇸 English";

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a45] bg-[#0a0a12]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-5 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600">
            <ImageIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-black text-[#e8e8f0]">
            Pixel<span className="text-violet-400">Forge</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navKeys.map((link) => (
            <Link key={link.href} href={link.href} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? "text-violet-400 bg-violet-500/10" : "text-[#8888a0] hover:text-[#e8e8f0] hover:bg-white/5"}`}>
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language */}
          <div ref={langRef} className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-[#8888a0] hover:text-[#e8e8f0] hover:bg-white/5">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{langLabel}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1 w-36 rounded-xl border border-[#2a2a45] bg-[#12121e] shadow-2xl py-1 z-50">
                <button onClick={() => { setLang("en"); setLangOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 ${lang === "en" ? "text-violet-400 bg-violet-500/10" : "text-[#8888a0]"}`}>
                  🇺🇸 English
                </button>
                <button onClick={() => { setLang("zh"); setLangOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 ${lang === "zh" ? "text-violet-400 bg-violet-500/10" : "text-[#8888a0]"}`}>
                  🇨🇳 中文
                </button>
              </div>
            )}
          </div>

          {/* User Menu */}
          {session?.user ? (
            <div ref={userRef} className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-white/5 border border-[#2a2a45]">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-[#e8e8f0] font-medium max-w-[100px] truncate">{session.user.name}</span>
                <ChevronDown className="h-3 w-3 text-[#8888a0]" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 rounded-xl border border-[#2a2a45] bg-[#12121e] shadow-2xl py-1 z-50">
                  <div className="px-3 py-2 border-b border-[#2a2a45]">
                    <p className="text-sm font-bold text-[#e8e8f0]">{session.user.name}</p>
                    <p className="text-xs text-[#8888a0]">{session.user.email}</p>
                    <span className="inline-block mt-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-400 uppercase">{(session.user as any).plan || "free"}</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-[#8888a0] hover:text-[#e8e8f0] hover:bg-white/5">
                    <LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}
                  </Link>
                  <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5">
                    <LogOut className="h-4 w-4" /> {t("nav.signout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block px-3 py-1.5 rounded-lg text-sm font-medium text-[#8888a0] hover:text-[#e8e8f0] hover:bg-white/5">{t("nav.signin")}</Link>
              <Link href="/signup" className="hidden sm:flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.3)]">
                <Zap className="h-3.5 w-3.5" /> {t("nav.signup")}
              </Link>
            </>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1.5 rounded-lg text-[#8888a0] hover:text-[#e8e8f0] hover:bg-white/5">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#2a2a45] bg-[#0a0a12] px-5 pb-4">
          <nav className="flex flex-col gap-1 pt-3">
            {navKeys.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`px-3 py-2 rounded-lg text-sm font-medium ${pathname === link.href ? "text-violet-400 bg-violet-500/10" : "text-[#8888a0]"}`}>
                {t(link.labelKey)}
              </Link>
            ))}
            <hr className="border-[#2a2a45] my-2" />
            {session?.user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-[#8888a0]">📊 {t("nav.dashboard")}</Link>
                <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }} className="px-3 py-2 rounded-lg text-sm text-red-400 text-left">{t("nav.signout")}</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-[#8888a0]">{t("nav.signin")}</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm justify-center mt-1">{t("nav.signup")}</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
