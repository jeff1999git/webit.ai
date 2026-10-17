import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { absoluteUrl, site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Root metadata deliberately omits canonical and Open Graph title/description:
// pages set their own title/description/canonical and Next derives the OG and
// Twitter text from them, while the file-based opengraph-image is inherited.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Websites, Apps & Custom Software Development`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "IT services",
    "software development company",
    "website development",
    "web application development",
    "mobile app development",
    "custom software development",
    "e-commerce development",
    "API development",
    "website maintenance",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080809",
  colorScheme: "dark",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: absoluteUrl("/icon.png"),
  description: site.description,
  ...(site.contact.email && { email: site.contact.email }),
  ...(site.contact.phone && { telephone: site.contact.phone }),
  ...(site.socials.length > 0 && { sameAs: site.socials.map((s) => s.href) }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-black"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          // JSON-LD must be inline; content is static and escaped below.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
