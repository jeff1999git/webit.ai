"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const MOBILE_MENU_ID = "mobile-menu";

/** "/" matches only itself; other links also match their sub-pages (/projects/x → Projects). */
function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu whenever the route changes (back/forward included).
  // Adjusting state during render avoids an extra effect-driven re-render.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // Escape closes the menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="py-5 container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label={`${site.name} — home`} className="flex items-center gap-2">
          <Image src={site.logo} alt={`${site.name} logo`} width={28} height={28} className="object-contain" />
          <span className="text-lg font-bold tracking-tight text-foreground">{site.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-3">
          {site.nav.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm px-4 py-2 rounded-full backdrop-blur-lg border border-white/25 hover:text-foreground hover:bg-white/25 transition-all duration-fast",
                  active ? "bg-white/25 text-foreground" : "bg-white/15 text-foreground/80"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href={site.cta.href}
            className="text-sm font-semibold text-black px-4 py-2 rounded-full bg-white/90 border border-transparent hover:bg-white transition-all duration-fast"
          >
            {site.cta.label}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={MOBILE_MENU_ID}
          className="lg:hidden flex flex-col justify-center gap-[5px] w-8 h-8 rounded"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-px bg-foreground origin-center"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="block w-5 h-px bg-foreground"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-px bg-foreground origin-center"
          />
        </button>
      </div>

      {/* Mobile menu dropdown — the wrapper stays mounted so aria-controls always resolves */}
      <div id={MOBILE_MENU_ID} className="lg:hidden">
        <AnimatePresence>
          {open && (
            <motion.nav
              aria-label="Primary"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden bg-black/80 backdrop-blur-lg border-t border-white/10"
            >
              <div className="flex flex-col px-6 py-4 gap-1">
                {site.nav.map((link) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "text-sm py-2 hover:text-foreground transition-colors duration-fast",
                        active ? "text-foreground font-medium" : "text-foreground/70"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  href={site.cta.href}
                  onClick={() => setOpen(false)}
                  className="mt-3 self-start text-sm font-semibold text-black px-5 py-2 rounded-full bg-white/90 hover:bg-white transition-all duration-fast"
                >
                  {site.cta.label}
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
