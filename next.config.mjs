/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Default dirs plus the content configuration.
    dirs: ["app", "components", "lib", "content"],
  },
  async headers() {
    // Images in /public are served with max-age=0 by default, so every visit
    // re-checks each one. Cache them for 30 days. When replacing an image,
    // give the new file a new name so visitors don't keep the old one.
    const imageCache = [
      { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
    ];
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      { source: "/optimized/:file*", headers: imageCache },
      { source: "/projects/:file([^/]+\\.webp)", headers: imageCache },
      { source: "/webitai-logo.png", headers: imageCache },
    ];
  },
  async redirects() {
    return [
      // The About page moved from /about-us to /about.
      { source: "/about-us", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
