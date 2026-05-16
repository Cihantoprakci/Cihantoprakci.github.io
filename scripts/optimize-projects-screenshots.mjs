import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';

const rawDir = 'public/assets/images/projects/raw';
const outDir = 'public/assets/images/projects';

await mkdir(outDir, { recursive: true });

// funiro is handled by optimize-funiro.mjs (needs admin-bar crop + 1440x900) — skip here
const SKIP = new Set(['funiro-desktop.png']);
const files = (await readdir(rawDir)).filter(
  (f) => f.toLowerCase().endsWith('.png') && !SKIP.has(f)
);
let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const src = join(rawDir, file);
  const out = join(outDir, `${parse(file).name}.webp`);
  const inSize = (await stat(src)).size;
  await sharp(src).webp({ quality: 80, effort: 6 }).toFile(out);
  const outSize = (await stat(out)).size;
  totalIn += inSize;
  totalOut += outSize;
  console.log(
    `${file.padEnd(38)} ${(inSize / 1024).toFixed(0).padStart(5)} Ko -> ${(outSize / 1024).toFixed(0).padStart(4)} Ko`
  );
}

console.log(
  `\n${files.length} images · ${(totalIn / 1024 / 1024).toFixed(2)} Mo -> ${(totalOut / 1024 / 1024).toFixed(2)} Mo WebP`
);
