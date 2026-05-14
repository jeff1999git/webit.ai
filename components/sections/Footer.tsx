import Link from "next/link";

export function Footer() {
  return (
    <footer id="footer" className="relative border-t border-surface-border">
      <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-sm font-bold tracking-tight text-foreground">
          webapp
        </Link>
        <p className="text-xs text-foreground/25">
          © {new Date().getFullYear()} webapp — Lorem ipsum
        </p>
      </div>
    </footer>
  );
}
