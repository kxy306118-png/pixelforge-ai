import Link from "next/link";

const footerSections = [
  {
    title: "Popular Tools",
    links: [
      { href: "/tools/remove-bg", label: "Remove Background" },
      { href: "/tools/upscale", label: "AI Upscale" },
      { href: "/tools/compress", label: "Compress Image" },
      { href: "/tools/convert", label: "Convert Format" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/tools", label: "All Tools" },
      { href: "/pricing", label: "Pricing" },
      { href: "#", label: "API Docs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span>
                Pixel<span className="text-violet-500">Forge</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Free AI-powered image tools. Process images directly in your browser — fast, private, and easy.
            </p>
            {/* Social proof */}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>🔒 SSL Secure</span>
              <span>🌍 50K+ Users</span>
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PixelForge AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for creators worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
