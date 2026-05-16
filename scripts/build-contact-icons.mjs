// Génère les icônes de contact COULEUR (vrais logos officiels) vers
// public/assets/icons/contact/. Sources = packages installés uniquement
// (devicon / simple-icons / @iconify-json/logos). Aucun tracé dessiné main.
// Rendu : monochrome au repos (filtre CSS) → vraie couleur au survol.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/assets/icons/contact');
const dv = path.join(root, 'node_modules/devicon/icons');
const si = path.join(root, 'node_modules/simple-icons/icons');
const exists = async (p) => {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
};

await mkdir(outDir, { recursive: true });
const missing = [];

// ── Source A: devicon couleur originale ───────────────────────────────────────
const deviconMap = {
  linkedin: 'linkedin/linkedin-original.svg', // bleu officiel #0076b2
};
for (const [slug, rel] of Object.entries(deviconMap)) {
  const dest = path.join(outDir, `${slug}.svg`);
  if (await exists(dest)) continue;            // override utilisateur sacré
  const src = path.join(dv, rel);
  if (await exists(src)) {
    await writeFile(dest, await readFile(src, 'utf8'));
    console.log(`A: ${slug} <- devicon (couleur)`);
  } else {
    missing.push(slug);
    console.warn(`A: MANQUE devicon ${slug}: ${rel}`);
  }
}

// ── Source B: marque monochrome → forcée BLANC ────────────────────────────────
const whiteMap = { github: 'github' };
for (const [slug, siSlug] of Object.entries(whiteMap)) {
  const dest = path.join(outDir, `${slug}.svg`);
  if (await exists(dest)) continue;
  const src = path.join(si, `${siSlug}.svg`);
  if (await exists(src)) {
    const svg = (await readFile(src, 'utf8')).replace('<svg ', '<svg fill="#FFFFFF" ');
    await writeFile(dest, svg);
    console.log(`B: ${slug} <- simple-icons (blanc)`);
  } else {
    missing.push(slug);
    console.warn(`B: MANQUE simple-icons ${siSlug}.svg`);
  }
}

// ── Source C: @iconify-json/logos — vrais logos MULTICOLORES officiels ─────────
const logosJsonPath = path.join(root, 'node_modules/@iconify-json/logos/icons.json');
if (await exists(logosJsonPath)) {
  const logos = JSON.parse(await readFile(logosJsonPath, 'utf8'));
  const logosMap = {
    gmail: 'google-gmail',  // enveloppe multicolore officielle
    tiktok: 'tiktok-icon',  // note cyan/magenta officielle
  };
  for (const [slug, iconName] of Object.entries(logosMap)) {
    const dest = path.join(outDir, `${slug}.svg`);
    if (await exists(dest)) continue;
    const ic = logos.icons[iconName];
    if (ic && ic.body) {
      const w = ic.width || logos.width || 24;
      const h = ic.height || logos.height || 24;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${ic.body}</svg>`;
      await writeFile(dest, svg);
      console.log(`C: ${slug} <- @iconify-json/logos:${iconName} (multicolore)`);
    } else {
      missing.push(slug);
      console.warn(`C: MANQUE @iconify-json/logos:${iconName}`);
    }
  }
} else {
  missing.push('gmail', 'tiktok');
  console.warn('C: @iconify-json/logos introuvable');
}

// ── Source D: tracé officiel simple-icons + DÉGRADÉ de marque officiel ─────────
const igGradient =
  '<defs><linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">' +
  '<stop offset="0" stop-color="#FEDA75"/>' +
  '<stop offset=".25" stop-color="#FA7E1E"/>' +
  '<stop offset=".5" stop-color="#D62976"/>' +
  '<stop offset=".75" stop-color="#962FBF"/>' +
  '<stop offset="1" stop-color="#4F5BD5"/>' +
  '</linearGradient></defs>';
{
  const dest = path.join(outDir, 'instagram.svg');
  const src = path.join(si, 'instagram.svg');
  if (!(await exists(dest))) {
    if (await exists(src)) {
      const raw = await readFile(src, 'utf8');
      const svg = raw
        .replace('<svg ', '<svg fill="url(#ig-grad)" ')
        .replace(/(<svg[^>]*>)/, `$1${igGradient}`);
      await writeFile(dest, svg);
      console.log('D: instagram <- simple-icons + dégradé marque officiel');
    } else {
      missing.push('instagram');
      console.warn('D: MANQUE simple-icons instagram.svg');
    }
  }
}

// ── Source E: glyphe utilitaire neutre (le téléphone n'a pas de marque) ───────
const literalMap = {
  phone: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#E8EAF0"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>`,
};
for (const [slug, svgContent] of Object.entries(literalMap)) {
  const dest = path.join(outDir, `${slug}.svg`);
  if (await exists(dest)) continue;            // override utilisateur sacré
  await writeFile(dest, svgContent);
  console.log(`E: ${slug} <- glyphe neutre embarqué`);
}

if (missing.length) {
  console.log(`\nMANQUANTS: ${missing.join(', ')}`);
} else {
  console.log('\nOK — toutes les icônes contact (couleur) générées');
}
