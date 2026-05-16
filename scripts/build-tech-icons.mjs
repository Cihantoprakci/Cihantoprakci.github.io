// Copie les logos officiels (devicon couleur / simple-icons marque) vers
// public/assets/icons/tech/. Aucun téléchargement réseau : tout est en node_modules.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/assets/icons/tech');
const dv = path.join(root, 'node_modules/devicon/icons');
const si = path.join(root, 'node_modules/simple-icons/icons');
const exists = async (p) => {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
};

// simple-icons v16 uses data/simple-icons.json; older versions use _data/
const siDataCandidates = [
  path.join(root, 'node_modules/simple-icons/data/simple-icons.json'),
  path.join(root, 'node_modules/simple-icons/_data/simple-icons.json'),
];
let siDataPath = null;
for (const c of siDataCandidates) { if (await exists(c)) { siDataPath = c; break; } }
if (!siDataPath) throw new Error('simple-icons data JSON introuvable — vérifier la version du package');
const siJson = JSON.parse(await readFile(siDataPath, 'utf8'));
const icons = siJson.icons || siJson;
// simple-icons v16 has a 'slug' field per icon
const siBySlug = new Map(icons.map((i) => [i.slug, i.hex]));
const hexOf = (slug) => siBySlug.get(slug) || null;

await mkdir(outDir, { recursive: true });
const missing = [];

// ── Source A: devicon colour originals ────────────────────────────────────────
const deviconMap = {
  html:       'html5/html5-original.svg',
  css:        'css3/css3-original.svg',
  sass:       'sass/sass-original.svg',
  javascript: 'javascript/javascript-original.svg',
  php:        'php/php-original.svg',
  vscode:     'vscode/vscode-original.svg',
  git:        'git/git-original.svg',
  npm:        'npm/npm-original-wordmark.svg',
  figma:      'figma/figma-original.svg',
  react:      'react/react-original.svg',
  tailwind:   'tailwindcss/tailwindcss-original.svg',
  vite:       'vitejs/vitejs-original.svg',
  wordpress:  'wordpress/wordpress-original.svg',
  typescript: 'typescript/typescript-original.svg',
  docker:     'docker/docker-original.svg',
};

for (const [slug, rel] of Object.entries(deviconMap)) {
  const dest = path.join(outDir, `${slug}.svg`);
  if (await exists(dest)) continue;            // user override is sacred
  const src = path.join(dv, rel);
  if (await exists(src)) {
    await writeFile(dest, await readFile(src, 'utf8'));
    console.log(`A: ${slug} <- devicon`);
  } else {
    missing.push(slug);
    console.warn(`A: MISSING devicon path for ${slug}: ${rel}`);
  }
}

// ── Source B: monochrome brands → forced WHITE #FFFFFF ────────────────────────
const whiteMap = {
  github: 'github',
  vercel: 'vercel',
  notion: 'notion',
};

for (const [slug, siSlug] of Object.entries(whiteMap)) {
  const dest = path.join(outDir, `${slug}.svg`);
  if (await exists(dest)) continue;
  const src = path.join(si, `${siSlug}.svg`);
  if (await exists(src)) {
    const svg = (await readFile(src, 'utf8')).replace('<svg ', '<svg fill="#FFFFFF" ');
    await writeFile(dest, svg);
    console.log(`B: ${slug} <- simple-icons (white)`);
  } else {
    missing.push(slug);
    console.warn(`B: MISSING simple-icons file for ${slug}: ${siSlug}.svg`);
  }
}

// ── Source C: simple-icons recoloured to official brand hex ───────────────────
// [output-slug, simple-icons-file-slug, simple-icons-data-slug]
const brandMap = [
  ['supabase',      'supabase',   'supabase'],
  ['gsap',          'greensock',  'greensock'],
  ['elementor',     'elementor',  'elementor'],
  ['n8n',           'n8n',        'n8n'],
  ['framer-motion', 'framer',     'framer'],
  ['pnpm',          'pnpm',       'pnpm'],
  ['stripe',        'stripe',     'stripe'],
  ['gemini',        'googlegemini', 'googlegemini'],
];

for (const [slug, fileSlug, dataSlug] of brandMap) {
  const dest = path.join(outDir, `${slug}.svg`);
  if (await exists(dest)) continue;
  const src = path.join(si, `${fileSlug}.svg`);
  const hex = hexOf(dataSlug);
  if (await exists(src) && hex) {
    const svg = (await readFile(src, 'utf8')).replace('<svg ', `<svg fill="#${hex}" `);
    await writeFile(dest, svg);
    console.log(`C: ${slug} <- simple-icons #${hex}`);
  } else {
    missing.push(slug);
    console.warn(`C: MISSING for ${slug}: file=${await exists(src)} hex=${hex}`);
  }
}

// ── Source D: hard-coded brand SVGs (dropped from upstream packages) ──────────
// Adobe was removed from simple-icons v16 — embed the official "A" mark directly.
const literalMap = {
  adobe: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#FF0000"><path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM.828 22.624L7.479 5.561h4.512l-8.16 17.063zM22.679 22.624H18.1L11.553 7.48l2.327-5.504 8.799 20.648z"/></svg>`,
};

for (const [slug, svgContent] of Object.entries(literalMap)) {
  const dest = path.join(outDir, `${slug}.svg`);
  if (await exists(dest)) continue;            // user override is sacred
  await writeFile(dest, svgContent);
  console.log(`D: ${slug} <- literal embed`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
if (missing.length) {
  console.log(`\nMANQUANTS (à fournir manuellement): ${missing.join(', ')}`);
} else {
  console.log('\nOK — tous les logos générés');
}
