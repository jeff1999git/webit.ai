import Link from "next/link";

const footerLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

export function Footer() {
  return (
    <footer id="footer" className="relative border-t border-surface-border">
      <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-sm font-bold tracking-tight text-foreground">
          WebApp
        </Link>

        <nav className="flex items-center gap-1">
          {footerLinks.map((link, i) => (
            <span key={link.href} className="flex items-center gap-1">
              {i > 0 && <span className="text-foreground/20 text-xs select-none">·</span>}
              <Link
                href={link.href}
                className="text-xs text-foreground/40 hover:text-foreground/80 transition-colors duration-fast"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>

        <p className="text-xs text-foreground/25">
          © {new Date().getFullYear()} WebApp Inc
        </p>
      </div>
    </footer>
  );
}
