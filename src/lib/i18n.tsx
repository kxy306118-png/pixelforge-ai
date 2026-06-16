"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "en" | "zh";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    "nav.tools": "Tools",
    "nav.pricing": "Pricing",
    "nav.help": "Help",
    "nav.about": "About",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.signin": "Sign in",
    "nav.signup": "Sign up",
    "nav.dashboard": "Dashboard",
    "nav.signout": "Sign out",
    // Hero
    "hero.badge": "AI-Powered Creative Toolkit",
    "hero.title1": "Create, Edit & Transform with",
    "hero.title2": "PixelForge AI",
    "hero.desc": "16 AI tools for images, video, audio & text. Start free — no credit card required.",
    "hero.cta": "Get Started Free",
    "hero.cta2": "View Pricing",
    // Categories
    "cat.image": "Image Tools",
    "cat.video": "Video Tools",
    "cat.audio": "Audio Tools",
    "cat.text": "Text Tools",
    // Pricing
    "pricing.title": "Simple, Transparent",
    "pricing.subtitle": "Start free. Upgrade when you need more power.",
    "pricing.annual": "Save 20% with annual billing →",
    "pricing.compare": "How We Compare",
    "pricing.faq": "FAQ",
    "pricing.subscribe": "Subscribe",
    "pricing.free": "Get Started Free",
    "pricing.popular": "Most Popular",
    // Common
    "common.loading": "Loading...",
    "common.processing": "Processing...",
    "common.download": "Download",
    "common.back": "Back",
    "common.learn_more": "Learn more",
    // Help
    "help.title": "How can we help you?",
    "help.subtitle": "Everything you need to know about using PixelForge AI tools",
    "help.still_need": "Still need help?",
    "help.contact_us": "Contact Us",
  },
  zh: {
    "nav.tools": "工具",
    "nav.pricing": "定价",
    "nav.help": "帮助",
    "nav.about": "关于",
    "nav.blog": "博客",
    "nav.contact": "联系我们",
    "nav.signin": "登录",
    "nav.signup": "注册",
    "nav.dashboard": "控制台",
    "nav.signout": "退出登录",
    "hero.badge": "AI 驱动的创意工具套件",
    "hero.title1": "用 AI 创造、编辑和转换",
    "hero.title2": "PixelForge AI",
    "hero.desc": "16 款 AI 工具，涵盖图像、视频、音频和文本处理。免费开始，无需信用卡。",
    "hero.cta": "免费开始",
    "hero.cta2": "查看定价",
    "cat.image": "图像工具",
    "cat.video": "视频工具",
    "cat.audio": "音频工具",
    "cat.text": "文本工具",
    "pricing.title": "简单透明的",
    "pricing.subtitle": "免费开始，按需升级。",
    "pricing.annual": "年付立省 20% →",
    "pricing.compare": "方案对比",
    "pricing.faq": "常见问题",
    "pricing.subscribe": "订阅",
    "pricing.free": "免费开始",
    "pricing.popular": "最受欢迎",
    "common.loading": "加载中...",
    "common.processing": "处理中...",
    "common.download": "下载",
    "common.back": "返回",
    "common.learn_more": "了解更多",
    "help.title": "我们能帮你什么？",
    "help.subtitle": "关于 PixelForge AI 工具你需要知道的一切",
    "help.still_need": "还需要帮助？",
    "help.contact_us": "联系我们",
  },
};

type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("pf-lang");
    if (saved === "zh") setLangState("zh");
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("pf-lang", l);
    document.documentElement.lang = l;
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
