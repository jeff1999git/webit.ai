import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "WebApp — AI-Powered Web Studio",
  description:
    "We craft high-performance web experiences powered by AI — from landing pages to full-stack platforms that scale.",
  keywords: ["web development", "AI", "Next.js", "SaaS", "agency"],
  openGraph: {
    title: "WebApp — AI-Powered Web Studio",
    description: "Build smarter. Launch faster.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080809",
  colorScheme: "dark",
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
      <body
        data-scroll-container
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
