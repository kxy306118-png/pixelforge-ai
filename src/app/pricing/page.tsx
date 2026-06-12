import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for casual users",
    features: [
      "3 images per day",
      "All tools included",
      "Standard quality",
      "Max 10MB upload",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/tools/remove-bg",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    desc: "For creators and professionals",
    features: [
      "Unlimited images",
      "All tools + priority AI",
      "Maximum quality output",
      "Max 50MB upload",
      "Batch processing (up to 20)",
      "No ads experience",
      "Priority support",
      "API access",
    ],
    cta: "Start 7-Day Free Trial",
    href: "#",
    highlight: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    desc: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Unlimited batch processing",
      "Max 200MB upload",
      "Custom AI model tuning",
      "Team collaboration (5 seats)",
      "Webhook integrations",
      "SLA guarantee",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    href: "#",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold sm:text-4xl">Simple, Transparent Pricing</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          Start free, upgrade when you need more. No hidden fees, cancel anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3 stagger-children">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 sm:p-8 animate-fade-in-up transition-all duration-300 ${
              plan.highlight
                ? "border-violet-300 bg-gradient-to-b from-violet-50/80 to-white shadow-xl shadow-violet-100/50 scale-[1.02] md:scale-105"
                : "border-border/60 bg-card shadow-sm card-hover"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-1 text-xs font-bold text-white">
                Most Popular
              </div>
            )}
            <div className="text-center">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{plan.desc}</p>
            </div>

            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 btn-press ${
                plan.highlight
                  ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-200/50 hover:shadow-xl"
                  : "border border-border bg-white text-foreground hover:bg-muted"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-center">Pricing FAQ</h2>
        {[
          { q: "Can I cancel anytime?", a: "Yes! Cancel your subscription anytime from your account settings. No questions asked." },
          { q: "Is there a free trial?", a: "The Free plan is free forever with 3 images/day. Pro plan includes a 7-day free trial." },
          { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and Apple Pay through our secure payment processor." },
          { q: "Do you offer refunds?", a: "Yes, we offer a 30-day money-back guarantee on all paid plans." },
        ].map((f, i) => (
          <details key={i} className="rounded-xl border border-border/60 p-4 hover:border-violet-200 transition-colors">
            <summary className="cursor-pointer font-medium text-sm">{f.q}</summary>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      {/* Banner ad */}
      <div className="mt-12">
        <div className="ad-container ad-container-banner rounded-2xl">
          <p className="text-xs text-muted-foreground/40 py-6">Advertisement</p>
        </div>
      </div>
    </div>
  );
}
