import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// Default social share image for every page (pages without their own inherit it).
// Rendered with the Node runtime so the logo can be read from /public.

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BACKGROUND = "#080809";
const ACCENT = "#8b5cf6";
const SURFACE = "#0f0f12";
const HAIRLINE = "rgba(255,255,255,0.1)";
const MUTED = "rgba(240,240,242,0.6)";

const services = ["Websites", "Web Apps", "Mobile Apps", "Custom Software"];

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/webitai-logo.png"), "base64");
  const logoSrc = `data:image/png;base64,${logo}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 40,
          background: BACKGROUND,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            borderRadius: 32,
            border: `1px solid ${HAIRLINE}`,
            backgroundColor: SURFACE,
            backgroundImage:
              "radial-gradient(circle at 85% 0%, rgba(139,92,246,0.16), rgba(15,15,18,0) 55%)",
          }}
        >
          {/* The logo PNG has ~18% transparent padding; the negative margin lines
              the visible swirl up with the text below. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={144} height={144} style={{ margin: "-24px 0 0 -26px" }} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: 72, height: 4, borderRadius: 2, background: ACCENT, marginBottom: 32 }} />
            <div
              style={{
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "#ffffff",
              }}
            >
              {site.name}
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 32,
                lineHeight: 1.3,
                color: "rgba(240,240,242,0.7)", // foreground at 70%
              }}
            >
              {site.tagline}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ height: 1, background: HAIRLINE, marginBottom: 28 }} />
            <div style={{ fontSize: 24, letterSpacing: "0.04em", color: MUTED }}>
              {services.join("  ·  ")}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
