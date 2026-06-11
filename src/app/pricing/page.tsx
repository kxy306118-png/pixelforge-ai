import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try all tools with daily limits",
    features: [
      "3 images per day",
      "All basic tools",
      "Standard quality",
      "No signup required",
    ],
    cta: "Get Started Free",
    href: "/tools/remove-bg",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9.9",
    period: "/month",
    description: "Unlimited usage for professionals",
    features: [
      "Unlimited images",
      "All tools including AI",
      "HD quality output",
      "Priority processing",
      "Batch processing",
      "API access",
      "No watermarks",
    ],
    cta: "Start Pro Trial",
    href: "#",
    highlighted: true,
  },
  {
    name: "API",
    price: "$0.03",
    period: "/image",
    description: "For developers and businesses",
    features: [
      "REST API access",
      "All tools available",
      "Pay per use",
      "High rate limits",
      "Webhook support",
      "Priority support",
    ],
    cta: "Contact Us",
    href: "#",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Start free, upgrade when you need more
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 ${
              plan.highlighted
                ? "border-violet-500 bg-violet-50/50 shadow-lg shadow-violet-100"
                : "border-border bg-card"
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
            )}
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 mt-0.5 text-violet-600 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                plan.highlighted
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "border border-border hover:bg-muted"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>All prices are in USD. Cancel anytime. No hidden fees.</p>
        <p className="mt-1">Payment processed securely via LemonSqueezy.</p>
      </div>
    </div>
  );
}
