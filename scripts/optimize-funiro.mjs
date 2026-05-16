import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const src = 'public/assets/images/projects/raw/funiro-desktop.png';
const out = 'public/assets/images/projects/funiro-desktop.webp';

const meta = await sharp(src).metadata();
const adminBar = 60; // crop WordPress admin toolbar from the top

await sharp(src)
  .extract({ left: 0, top: adminBar, width: meta.width, height: meta.height - adminBar })
  .resize(1440, 900, { fit: 'cover', position: 'left top' })
  .webp({ quality: 80, effort: 6 })
  .toFile(out);

const inSize = (await stat(src)).size;
const outSize = (await stat(out)).size;
console.log(
  `funiro-desktop  ${(inSize / 1024).toFixed(0)} Ko -> ${(outSize / 1024).toFixed(0)} Ko (1440x900)`
);
