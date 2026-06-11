import Link from "next/link";
import { ImageIcon } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-white">
            <ImageIcon className="h-5 w-5" />
          </div>
          <span>
            Pixel<span className="text-violet-500">Forge</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
            All Tools
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/tools/remove-bg"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
          >
            Try Free
          </Link>
        </div>
      </div>
    </header>
  );
}
