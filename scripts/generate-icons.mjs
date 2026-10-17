#!/usr/bin/env node
/**
 * App icon generator
 *
 * The swirl logo (public/webitai-logo.png) is white on transparent, so it
 * disappears on light browser tabs and home screens. This script places it
 * on the site's dark background and writes the file-based icons that Next.js
 * serves automatically:
 *
 *   • app/icon.png        512×512  rounded dark tile  → /icon.png (favicon)
 *   • app/apple-icon.png  180×180  solid dark square  → /apple-icon.png
 *     (iOS applies its own corner mask and ignores transparency)
 *
 * Run after changing the logo:  npm run icons
 */

import sharp from "sharp";

/* ─── config ─────────────────────────────────────────────── */

const LOGO       = "public/webitai-logo.png";
const BACKGROUND = "#080809";   // matches --background in app/globals.css

// logoScale = share of the tile taken by the (trimmed) logo
// radius    = corner radius as a share of the tile (0 = square)
const ICONS = [
  { out: "app/icon.png",       size: 512, logoScale: 0.72, radius: 0.22 },
  { out: "app/apple-icon.png", size: 180, logoScale: 0.70, radius: 0 },
];

const PNG_OPTS = { compressionLevel: 9, effort: 10 };

/* ─── helpers ─────────────────────────────────────────────── */

/** Background tile as SVG — rounded when radius > 0, otherwise a full square. */
function tile(size, radius) {
  const rx = Math.round(size * radius);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${rx}" ry="${rx}" fill="${BACKGROUND}"/>` +
      `</svg>`
  );
}

async function generate({ out, size, logoScale, radius }) {
  // The source PNG has generous transparent padding — trim it so the scale
  // applies to the visible swirl rather than the whole canvas.
  const logoSize = Math.round(size * logoScale);
  const logo = await sharp(LOGO)
    .trim()
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  let pipe = sharp(tile(size, radius)).composite([{ input: logo, gravity: "center" }]);

  // A square tile has no transparent pixels — drop the alpha channel entirely.
  if (radius === 0) pipe = pipe.flatten({ background: BACKGROUND });

  await pipe.png(PNG_OPTS).toFile(out);
  console.log(`  ▸ ${out.padEnd(20)} ${size}×${size}`);
}

/* ─── main ────────────────────────────────────────────────── */

async function main() {
  console.log(`\n  Generating icons from ${LOGO}`);
  for (const icon of ICONS) await generate(icon);
  console.log("");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
