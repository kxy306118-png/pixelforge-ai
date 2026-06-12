import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free", price: "$0", period: "forever", desc: "Perfect for casual use",
    features: ["3 images / day", "All tools", "Standard quality", "10MB max upload"],
    cta: "Get Started", href: "/tools/remove-bg", highlight: false,
  },
  {
    name: "Pro", price: "$9", period: "/mo", desc: "For creators & professionals",
    features: ["Unlimited images", "Priority AI processing", "Max quality output", "50MB max upload", "Batch processing (20)", "No ads", "API access"],
    cta: "Start 7-Day Trial", href: "#", highlight: true,
  },
  {
    name: "Business", price: "$29", period: "/mo", desc: "For teams & agencies",
    features: ["Everything in Pro", "Unlimited batch", "200MB max upload", "Team (5 seats)", "Webhooks & API", "SLA guarantee", "Dedicated support"],
    cta: "Contact Sales", href: "#", highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="relative min-h-screen grid-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(139,92,246,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="text-center animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-[10px] font-bold text-violet-400 uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Pricing
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="mt-4 text-zinc-500 max-w-lg mx-auto">Start free. Upgrade when you need more. Cancel anytime.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 stagger">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-2xl p-6 sm:p-8 animate-fade-in-up transition-all duration-300 ${
              plan.highlight
                ? "border border-violet-500/30 bg-gradient-to-b from-violet-500/[0.08] to-transparent shadow-[0_0_40px_rgba(139,92,246,0.1)] md:scale-105"
                : "glass-card"
            }`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="text-center">
                <h3 className="text-lg font-bold text-zinc-100">{plan.name}</h3>
                <div className="mt-3 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">{plan.desc}</p>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /><span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 ${
                plan.highlight ? "neon-btn" : "ghost-btn"
              }`}>
                <span>{plan.cta}</span>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto space-y-3">
          <h2 className="text-xl font-bold text-center mb-6">Pricing FAQ</h2>
          {[
            { q: "Can I cancel anytime?", a: "Yes. Cancel anytime from your settings. No questions asked." },
            { q: "Is there a free trial?", a: "Free plan is free forever with 3 images/day. Pro includes a 7-day free trial." },
            { q: "Payment methods?", a: "All major credit cards, PayPal, and Apple Pay." },
          ].map((f, i) => (
            <details key={i} className="group rounded-xl border border-white/[0.04] hover:border-violet-500/20 transition-colors">
              <summary className="cursor-pointer p-4 text-sm font-medium text-zinc-300">{f.q}</summary>
              <p className="px-4 pb-4 text-sm text-zinc-500">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 ad-slot h-[90px] rounded-2xl"><span>Advertisement</span></div>
      </div>
    </div>
  );
}
