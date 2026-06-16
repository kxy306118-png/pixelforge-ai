import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
      <h2 className="text-xl font-bold text-[#e8e8f0] mb-2">Page Not Found</h2>
      <p className="text-[#8888a0] mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/tools" className="btn-secondary">Browse Tools</Link>
      </div>
    </div>
  );
}
