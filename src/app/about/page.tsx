"use client";

import { Zap, Shield, Globe, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();

  const features = [
    { icon: Zap, titleKey: "about.feature1_title", descKey: "about.feature1_desc" },
    { icon: Shield, titleKey: "about.feature2_title", descKey: "about.feature2_desc" },
    { icon: Globe, titleKey: "about.feature3_title", descKey: "about.feature3_desc" },
    { icon: Heart, titleKey: "about.feature4_title", descKey: "about.feature4_desc" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="text-center mb-12">
        <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-4">{t("about.badge")}</span>
        <h1 className="text-3xl sm:text-4xl font-black">{t("about.title1")} <span className="gradient-text">{t("about.title2")}</span></h1>
        <p className="mt-3 text-[#8888a0] max-w-2xl mx-auto">{t("about.subtitle")}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {features.map((item) => (
          <div key={item.titleKey} className="card">
            <item.icon className="h-8 w-8 text-violet-400 mb-3" />
            <h3 className="text-lg font-bold text-[#e8e8f0]">{t(item.titleKey)}</h3>
            <p className="mt-2 text-sm text-[#8888a0]">{t(item.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
