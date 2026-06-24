"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { lang } = useI18n();

  const t = (en: string, zh: string) => lang === "zh" ? zh : en;

  const footerSections = [
    {
      title: t("Product", "产品"),
      links: [
        { href: "/tools", label: t("All Tools", "全部工具") },
        { href: "/pricing", label: t("Pricing", "定价") },
        { href: "/docs", label: t("API Docs", "API 文档") },
        { href: "/tools?cat=image", label: t("Image Tools", "图像工具") },
        { href: "/tools?cat=video", label: t("Video Tools", "视频工具") },
        { href: "/tools?cat=audio", label: t("Audio Tools", "音频工具") },
        { href: "/tools?cat=text", label: t("Text Tools", "文本工具") },
      ],
    },
    {
      title: t("Company", "公司"),
      links: [
        { href: "/about", label: t("About Us", "关于我们") },
        { href: "/blog", label: t("Blog", "博客") },
        { href: "/contact", label: t("Contact", "联系我们") },
      ],
    },
    {
      title: t("Support", "支持"),
      links: [
        { href: "/docs", label: t("Help Center", "帮助中心") },
        { href: "/contact", label: t("Contact Support", "联系客服") },
        { href: "/terms", label: t("Terms of Service", "服务条款") },
        { href: "/privacy", label: t("Privacy Policy", "隐私政策") },
      ],
    },
  ];

  return (
    <footer className="border-t border-[#1e1e30] bg-[#08080f]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-black text-[#e8e8f0]">
              Pixel<span className="text-violet-400">Forge</span>
            </Link>
            <p className="mt-3 text-sm text-[#8888a0] leading-relaxed">
              {t(
                "All-in-one AI creative toolkit. Image, video, audio & text tools for everyone.",
                "一体化 AI 创意工具套件。为每个人提供的图像、视频、音频和文本工具。"
              )}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://twitter.com/pixelforgeai" target="_blank" rel="noopener" className="text-[#8888a0] hover:text-violet-400 text-sm">Twitter</a>
              <a href="https://github.com/pixelforgeai" target="_blank" rel="noopener" className="text-[#8888a0] hover:text-violet-400 text-sm">GitHub</a>
              <a href="https://discord.gg/pixelforgeai" target="_blank" rel="noopener" className="text-[#8888a0] hover:text-violet-400 text-sm">Discord</a>
            </div>
          </div>
          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold text-[#e8e8f0] mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-[#8888a0] hover:text-violet-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-[#1e1e30] flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-[#555570]">© {new Date().getFullYear()} PixelForge AI. {t("All rights reserved.", "保留所有权利。")}</p>
          <p className="text-xs text-[#555570]">{t("Made with ❤️ for creators worldwide", "用 ❤️ 为全球创作者打造")}</p>
        </div>
      </div>
    </footer>
  );
}
