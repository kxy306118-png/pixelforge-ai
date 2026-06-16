import Link from "next/link";

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "/tools", label: "All Tools" },
      { href: "/pricing", label: "Pricing" },
      { href: "/docs", label: "API Docs" },
      { href: "/tools?cat=image", label: "Image Tools" },
      { href: "/tools?cat=video", label: "Video Tools" },
      { href: "/tools?cat=audio", label: "Audio Tools" },
      { href: "/tools?cat=text", label: "Text Tools" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/docs", label: "Help Center" },
      { href: "/contact", label: "Live Chat" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e30] bg-[#08080f]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-black text-[#e8e8f0]">
              Pixel<span className="text-violet-400">Forge</span>
            </Link>
            <p className="mt-3 text-sm text-[#8888a0] leading-relaxed">
              All-in-one AI creative toolkit. Image, video, audio & text tools for everyone.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://twitter.com/pixelforgeai" target="_blank" rel="noopener" className="text-[#8888a0] hover:text-violet-400 text-sm">Twitter</a>
              <a href="https://github.com/pixelforgeai" target="_blank" rel="noopener" className="text-[#8888a0] hover:text-violet-400 text-sm">GitHub</a>
              <a href="https://discord.gg/pixelforgeai" target="_blank" rel="noopener" className="text-[#8888a0] hover:text-violet-400 text-sm">Discord</a>
            </div>
          </div>
          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold text-[#e8e8f0] mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-[#8888a0] hover:text-violet-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-[#1e1e30] flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-[#555570]">© {new Date().getFullYear()} PixelForge AI. All rights reserved.</p>
          <p className="text-xs text-[#555570]">Made with ❤️ for creators worldwide</p>
        </div>
      </div>
    </footer>
  );
}
