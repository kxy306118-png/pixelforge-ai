import { Zap, Shield, Globe, Heart, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black">About <span className="gradient-text">PixelForge AI</span></h1>
        <p className="mt-3 text-[#8888a0] max-w-2xl mx-auto">We believe AI-powered creative tools should be accessible to everyone. PixelForge is building the all-in-one platform for creators, designers, and developers.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {[
          { icon: Zap, title: "Fast & Powerful", desc: "Process images, video, and audio in seconds with cutting-edge AI models." },
          { icon: Shield, title: "Privacy First", desc: "Your files are never stored. All data is deleted immediately after processing." },
          { icon: Globe, title: "Global Reach", desc: "Serving creators in 180+ countries with multi-language support." },
          { icon: Heart, title: "Creator-Focused", desc: "Built by creators, for creators. Every feature is designed with you in mind." },
        ].map((item) => (
          <div key={item.title} className="card">
            <item.icon className="h-8 w-8 text-violet-400 mb-3" />
            <h3 className="text-lg font-bold text-[#e8e8f0]">{item.title}</h3>
            <p className="mt-2 text-sm text-[#8888a0]">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="card text-center">
        <h2 className="text-2xl font-black text-[#e8e8f0]">Our Mission</h2>
        <p className="mt-4 text-[#8888a0] leading-relaxed max-w-2xl mx-auto">
          To democratize AI creative tools — making professional-grade image, video, audio, and text processing available to everyone, regardless of technical skill or budget.
        </p>
        <div className="grid grid-cols-3 gap-6 mt-8">
          {[
            { num: "16+", label: "AI Tools" },
            { num: "180+", label: "Countries" },
            { num: "1M+", label: "Files Processed" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black gradient-text">{s.num}</p>
              <p className="text-sm text-[#8888a0] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
