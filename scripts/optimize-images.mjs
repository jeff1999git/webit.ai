#!/usr/bin/env node
/**
 * Image optimisation pipeline
 *
 * For every PNG / JPG in /public it generates:
 *   • AVIF  – primary format (best compression, transparency-safe)
 *   • WebP  – fallback (wide support, transparency-safe)
 *   • PNG/JPEG – compressed original-format fallback (oldest browsers)
 *
 * Responsive widths are only generated when the source image is wider,
 * so nothing is ever upscaled.
 *
 * Output: public/optimized/<stem>-<width>.<ext>
 *         e.g.  public/optimized/2.2-1080.avif
 *               public/optimized/2.2-orig.avif
 */

import sharp from "sharp";
import { readdir, mkdir, stat, rm } from "fs/promises";
import { join, extname, basename } from "path";

/* ─── config ─────────────────────────────────────────────── */

const INPUT_DIR  = "public";
const OUTPUT_DIR = "public/optimized";
const SUPPORTED  = new Set([".png", ".jpg", ".jpeg"]);

// Responsive breakpoints (px). Only emitted when source is wider.
const BREAKPOINTS = [640, 1080, 1920];

const QUALITY = {
  avif: 72,   // perceptually lossless for most images
  webp: 82,
  jpeg: 85,
};

const PNG_OPTS = {
  compressionLevel: 9,  // max zlib compression
  effort: 10,           // max encoder effort
};

/* ─── helpers ─────────────────────────────────────────────── */

function fmt(bytes) {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function pct(a, b) {
  return `${((1 - a / b) * 100).toFixed(1)}%`;
}

async function fileSize(p) {
  return (await stat(p)).size;
}

/* ─── core ────────────────────────────────────────────────── */

async function processImage(srcPath, stem, ext) {
  const img  = sharp(srcPath, { failOnError: false });
  const meta = await img.metadata();
  const srcW = meta.width;

  // widths to emit: all breakpoints narrower than source + original
  const widths = [...BREAKPOINTS.filter(w => w < srcW), srcW];

  let outBytes = 0;
  const rows = [];

  for (const w of widths) {
    const label = w === srcW ? "orig" : `${w}w`;
    const base  = join(OUTPUT_DIR, `${stem}-${label}`);
    const pipe  = img.clone().resize(w, null, { withoutEnlargement: true });

    // AVIF
    const avifPath = `${base}.avif`;
    await pipe.clone().avif({ quality: QUALITY.avif }).toFile(avifPath);
    const avifSz = await fileSize(avifPath);

    // WebP
    const webpPath = `${base}.webp`;
    await pipe.clone().webp({ quality: QUALITY.webp }).toFile(webpPath);
    const webpSz = await fileSize(webpPath);

    // Original-format fallback (preserves transparency for PNG)
    let fbPath, fbSz;
    if (ext === ".png") {
      fbPath = `${base}.png`;
      await pipe.clone().png(PNG_OPTS).toFile(fbPath);
    } else {
      fbPath = `${base}.jpg`;
      await pipe.clone().jpeg({ quality: QUALITY.jpeg, mozjpeg: true }).toFile(fbPath);
    }
    fbSz = await fileSize(fbPath);

    outBytes += avifSz + webpSz + fbSz;
    rows.push({ label, avifSz, webpSz, fbSz, ext });
  }

  return { outBytes, rows };
}

/* ─── main ────────────────────────────────────────────────── */

const CLEAN = process.argv.includes("--clean");

async function main() {
  if (CLEAN) {
    process.stdout.write(`Cleaning ${OUTPUT_DIR}…\n`);
    await rm(OUTPUT_DIR, { recursive: true, force: true });
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const entries = await readdir(INPUT_DIR);
  const images  = entries.filter(f => {
    const e = extname(f).toLowerCase();
    return SUPPORTED.has(e) && !f.startsWith(".");
  });

  if (!images.length) {
    console.log("No images found in", INPUT_DIR);
    return;
  }

  const line = "─".repeat(58);
  console.log(`\n${line}`);
  console.log(`  Optimising ${images.length} image(s)  →  ${OUTPUT_DIR}`);
  console.log(line);

  let totalIn = 0, totalOut = 0;

  for (const file of images) {
    const srcPath = join(INPUT_DIR, file);
    const ext     = extname(file).toLowerCase();
    const stem    = basename(file, extname(file));
    const srcSz   = await fileSize(srcPath);
    totalIn += srcSz;

    console.log(`\n  ▸ ${file}   ${fmt(srcSz)}`);
    console.log(`    ${"size".padEnd(6)}  ${"avif".padEnd(10)}  ${"webp".padEnd(10)}  fallback`);

    const { outBytes, rows } = await processImage(srcPath, stem, ext);
    totalOut += outBytes;

    for (const r of rows) {
      console.log(
        `    ${r.label.padEnd(6)}  ${fmt(r.avifSz).padEnd(10)}  ${fmt(r.webpSz).padEnd(10)}  ${fmt(r.fbSz)}`
      );
    }
  }

  console.log(`\n${line}`);
  console.log(`  Source total   ${fmt(totalIn)}`);
  console.log(`  Output total   ${fmt(totalOut)}  (all variants combined)`);
  console.log(`  Space saved    ${pct(totalOut, totalIn)} vs source`);
  console.log(`${line}\n`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
