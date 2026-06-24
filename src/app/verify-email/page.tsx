"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    fetch(`/api/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((d) => { setStatus(d.ok ? "success" : "error"); })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      {status === "loading" && <Loader2 className="h-12 w-12 text-violet-400 mx-auto animate-spin" />}
      {status === "success" && (
        <>
          <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#e8e8f0] mb-2">Email Verified!</h1>
          <p className="text-[#8888a0] mb-6">Your email has been verified. You now have access to all AI tools.</p>
          <Link href="/login" className="btn-primary inline-block">Sign In</Link>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#e8e8f0] mb-2">Verification Failed</h1>
          <p className="text-[#8888a0] mb-6">The verification link is invalid or expired.</p>
          <Link href="/" className="btn-secondary inline-block">Go Home</Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-5 py-20 text-center text-[#8888a0]">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
