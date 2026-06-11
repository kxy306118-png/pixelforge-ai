import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span>
                Pixel<span className="text-violet-500">Forge</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Free AI-powered image tools. Process images directly in your browser — fast, private, and easy.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Popular Tools</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools/remove-bg" className="hover:text-foreground transition-colors">Remove Background</Link></li>
              <li><Link href="/tools/upscale" className="hover:text-foreground transition-colors">AI Upscale</Link></li>
              <li><Link href="/tools/compress" className="hover:text-foreground transition-colors">Compress Image</Link></li>
              <li><Link href="/tools/convert" className="hover:text-foreground transition-colors">Convert Format</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools" className="hover:text-foreground transition-colors">All Tools</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PixelForge AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
