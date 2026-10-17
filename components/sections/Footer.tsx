import Link from "next/link";
import Image from "next/image";
import { EmailLink } from "@/components/ui/EmailLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import { services } from "@/content/services";
import { phoneHref, site, whatsappHref } from "@/content/site";

const headingClass = "text-xs font-medium tracking-widest uppercase text-foreground/60 mb-5";
const linkClass = "text-sm text-foreground/60 hover:text-foreground transition-colors duration-fast";

interface ContactItem {
  icon: IconName;
  label: string;
  href: string | null;
  external?: boolean;
  /** Rendered as an EmailLink (Gmail compose) instead of a plain anchor. */
  email?: string;
}

/** Contact rows — only details that are actually configured in content/site.ts. */
function getContactItems(): ContactItem[] {
  const { email, phone, location } = site.contact;
  const tel = phoneHref();
  const whatsapp = whatsappHref();

  const items: (ContactItem | null)[] = [
    email ? { icon: "mail", label: email, href: null, email } : null,
    phone && tel ? { icon: "phone", label: phone, href: tel } : null,
    whatsapp ? { icon: "message", label: "WhatsApp", href: whatsapp, external: true } : null,
    location ? { icon: "mapPin", label: location, href: null } : null,
  ];
  return items.filter((item): item is ContactItem => item !== null);
}

export function Footer() {
  const contactItems = getContactItems();

  return (
    <footer id="footer" className="relative border-t border-surface-border">
      <div className="container mx-auto px-6 pt-14 pb-8 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src={site.logo} alt="" width={24} height={24} className="object-contain" />
              <span className="text-base font-bold tracking-tight text-foreground">{site.name}</span>
            </Link>
            <p className="mt-4 text-sm text-foreground/60 leading-relaxed">{site.tagline}</p>
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3">
            {/* Services */}
            <div>
              <h2 className={headingClass}>Services</h2>
              <ul className="flex flex-col gap-3">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services#${service.slug}`} className={linkClass}>
                      {service.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h2 className={headingClass}>Company</h2>
              <ul className="flex flex-col gap-3">
                {site.nav.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h2 className={headingClass}>Contact</h2>
              <ul className="flex flex-col gap-3">
                {contactItems.map((item) => (
                  <li key={item.icon}>
                    {item.email ? (
                      <EmailLink
                        email={item.email}
                        className={`${linkClass} inline-flex max-w-full items-center gap-2`}
                      >
                        <Icon name={item.icon} className="h-4 w-4" />
                        <span className="min-w-0 [overflow-wrap:anywhere]">{item.label}</span>
                      </EmailLink>
                    ) : item.href ? (
                      <a
                        href={item.href}
                        {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                        className={`${linkClass} inline-flex max-w-full items-center gap-2`}
                      >
                        <Icon name={item.icon} className="h-4 w-4" />
                        <span className="min-w-0 [overflow-wrap:anywhere]">{item.label}</span>
                        {item.external && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-foreground/60">
                        <Icon name={item.icon} className="h-4 w-4" />
                        <span className="min-w-0">{item.label}</span>
                      </span>
                    )}
                  </li>
                ))}
                {site.socials.map((social) => (
                  <li key={social.href}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {social.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-fast"
                  >
                    Start a project
                    <Icon
                      name="arrowRight"
                      className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-surface-border flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/60">
            © {new Date().getFullYear()} {site.name}
          </p>

          <nav aria-label="Legal">
            <ul className="flex items-center gap-1">
              {site.legal.map((link, i) => (
                <li key={link.href} className="flex items-center gap-1">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-foreground/30 text-xs select-none">
                      ·
                    </span>
                  )}
                  <Link
                    href={link.href}
                    className="text-xs text-foreground/60 hover:text-foreground transition-colors duration-fast"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
