import sharp from 'sharp';
import { statSync } from 'node:fs';

const RAW = 'public/assets/images/projects/raw';
const OUT = 'public/assets/images/projects';

const CANVAS_W = 1600;
const CANVAS_H = 1000;

// Tier 1 + Tier 2 projects with both desktop & mobile captures (duo mockup).
const DUO = [
  { slug: 'digistylze-saas', src: 'digistylze-saas-dashboard' },
  { slug: 'cvgenius', src: 'cvgenius-editeur' },
  { slug: 'covercraft-ai', src: 'covercraft-ai-accueil' },
  { slug: 'myhr-oncall', src: 'myhr-oncall' },
  { slug: 'nova-tech', src: 'nova-tech' },
  { slug: 'morpion-php', src: 'morpion-php' },
  { slug: 'jo-hiver-2030', src: 'jo-hiver-2030' },
  { slug: 'my-digital-week', src: 'my-digital-week' },
  { slug: 'veil-parfumerie', src: 'veil-parfumerie' },
  { slug: 'stunning', src: 'stunning' },
  { slug: 'euphoria', src: 'euphoria' },
];

// Funiro: Elementor archive, no mobile capture → desktop-only mockup.
// Source = the already-cleaned 1440x900 webp (admin bar removed in Phase 3-C).
const SOLO = [{ slug: 'funiro', srcPath: `${OUT}/funiro-desktop.webp` }];

// Rounded + hairline border RGBA buffer for a resized screenshot.
async function frame(srcPath, w, h, r) {
  const base = await sharp(srcPath).resize(w, h, { fit: 'cover' }).png().toBuffer();
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}"/></svg>`
  );
  const border = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${r}" ry="${r}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1"/></svg>`
  );
  return sharp(base)
    .composite([
      { input: mask, blend: 'dest-in' },
      { input: border, blend: 'over' },
    ])
    .png()
    .toBuffer();
}

// Soft shadow: blurred semi-transparent rounded rect, padded so blur doesn't clip.
async function shadow(w, h, r, pad = 70, blur = 30, alpha = 0.5) {
  const W = w + pad * 2;
  const H = h + pad * 2;
  const svg = Buffer.from(
    `<svg width="${W}" height="${H}"><rect x="${pad}" y="${pad}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="rgba(0,0,0,${alpha})"/></svg>`
  );
  return { buf: await sharp(svg).blur(blur).png().toBuffer(), pad };
}

async function buildDuo({ slug, src }) {
  const dW = 1120;
  const dH = Math.round(dW * (900 / 1440)); // 700
  const dR = 16;
  const dX = 24;
  const dY = 96;

  const mH = 612;
  const mW = Math.round(mH * (390 / 844)); // ~283
  const mR = 44;
  const mX = CANVAS_W - mW - 78;
  const mY = CANVAS_H - mH - 44;

  const deskImg = await frame(`${RAW}/${src}-desktop.png`, dW, dH, dR);
  const mobImg = await frame(`${RAW}/${src}-mobile.png`, mW, mH, mR);
  const deskSh = await shadow(dW, dH, dR, 80, 34, 0.42);
  const mobSh = await shadow(mW, mH, mR, 70, 28, 0.5);

  const outPath = `${OUT}/${slug}-mockup.webp`;
  await sharp({
    create: { width: CANVAS_W, height: CANVAS_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: deskSh.buf, left: dX - deskSh.pad, top: dY - deskSh.pad + 16 },
      { input: deskImg, left: dX, top: dY },
      { input: mobSh.buf, left: mX - mobSh.pad, top: mY - mobSh.pad + 14 },
      { input: mobImg, left: mX, top: mY },
    ])
    .webp({ quality: 86 })
    .toFile(outPath);

  console.log(`${slug}-mockup.webp  ${(statSync(outPath).size / 1024).toFixed(0)} Ko`);
}

async function buildSolo({ slug, srcPath }) {
  // Desktop-only, centered (no mobile capture available).
  const dW = 1200;
  const dH = Math.round(dW * (900 / 1440)); // 750
  const dR = 16;
  const dX = Math.round((CANVAS_W - dW) / 2); // 200
  const dY = Math.round((CANVAS_H - dH) / 2); // 125

  const deskImg = await frame(srcPath, dW, dH, dR);
  const deskSh = await shadow(dW, dH, dR, 80, 34, 0.42);

  const outPath = `${OUT}/${slug}-mockup.webp`;
  await sharp({
    create: { width: CANVAS_W, height: CANVAS_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: deskSh.buf, left: dX - deskSh.pad, top: dY - deskSh.pad + 16 },
      { input: deskImg, left: dX, top: dY },
    ])
    .webp({ quality: 86 })
    .toFile(outPath);

  console.log(`${slug}-mockup.webp  ${(statSync(outPath).size / 1024).toFixed(0)} Ko (desktop seul)`);
}

for (const p of DUO) await buildDuo(p);
for (const p of SOLO) await buildSolo(p);
