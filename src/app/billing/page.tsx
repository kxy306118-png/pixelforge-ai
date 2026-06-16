"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ArrowLeft, Shield, Zap, Loader2 } from "lucide-react";

const planDetails: Record<string, { name: string; price: string; credits: string }> = {
  starter: { name: "Starter", price: "$4.99/mo", credits: "50 AI tasks/month" },
  pro: { name: "Pro", price: "$9.99/mo", credits: "150 AI tasks/month" },
};

function BillingPageInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const details = planDetails[plan] || planDetails.pro;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/signup?plan=${plan}`);
    }
  }, [status, plan, router]);

  if (status === "loading") {
    return <div className="mx-auto max-w-lg px-5 py-20 text-center text-[#8888a0]">Loading...</div>;
  }
  if (!session) return null;

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || "Failed to start checkout. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to LemonSqueezy hosted checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Checkout URL not received. Please contact support.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-[#8888a0] hover:text-violet-400 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Pricing
      </Link>
      <h1 className="text-2xl font-black text-[#e8e8f0] mb-2">Subscribe to {details.name}</h1>
      <p className="text-[#8888a0] mb-8">Complete your subscription securely via LemonSqueezy.</p>

      <div className="card mb-6 bg-gradient-to-br from-violet-500/5 to-transparent border-violet-500/20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-[#e8e8f0]">{details.name} Plan</h3>
          <span className="text-violet-400 font-bold">{details.price}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#8888a0]">
          <Check className="h-4 w-4 text-emerald-400" /> {details.credits}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border-2 border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="card">
        <div className="text-center py-6">
          <Shield className="h-12 w-12 text-violet-400 mx-auto mb-4" />
          <h3 className="font-bold text-[#e8e8f0] mb-2">Secure Checkout</h3>
          <p className="text-sm text-[#8888a0] mb-6">
            You&apos;ll be redirected to LemonSqueezy&apos;s secure payment page.
            Your card details are never stored on our servers.
          </p>
          <div className="text-2xl font-black text-[#e8e8f0] mb-1">{details.price}</div>
          <div className="text-sm text-[#8888a0] mb-6">{details.credits}</div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full justify-center py-3"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting to checkout...</>
            ) : (
              <><Zap className="h-4 w-4" /> Subscribe Now</>
            )}
          </button>
          <div className="mt-4 text-xs text-[#555570]">
            Secured by LemonSqueezy · Cancel anytime · Instant access
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-5 py-20 text-center text-[#8888a0]">Loading...</div>}>
      <BillingPageInner />
    </Suspense>
  );
}
