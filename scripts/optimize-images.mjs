import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dirs = [path.join(root, 'src', 'assets', 'images'), path.join(root, 'project images')];
const MAX_DIM = 1600;

function writeAtomic(target, buffer) {
  const tmp = `${target}.tmp`;
  writeFileSync(tmp, buffer);
  try {
    renameSync(tmp, target);
  } catch (err) {
    rmSync(tmp, { force: true });
    throw err;
  }
}

let totalBefore = 0;
let totalAfter = 0;
let done = 0;
let skipped = 0;
const converted = [];

const files = dirs.flatMap((dir) =>
  readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f)).map((f) => path.join(dir, f))
);

for (const file of files) {
  const before = statSync(file).size;
  if (before < 40_000) { skipped++; totalBefore += before; totalAfter += before; continue; }

  const meta = await sharp(file).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if ((width > 0 && width <= 900 && height > 0 && height <= 900)) { skipped++; totalBefore += before; totalAfter += before; continue; }

  let out = null;
  let target = file;

  if (/\.jpe?g$/i.test(file)) {
    out = await sharp(file).rotate().resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 74, mozjpeg: true }).toBuffer();
  } else if (meta.hasAlpha) {
    out = await sharp(file).rotate().resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true }).png({ palette: true, quality: 90, effort: 7 }).toBuffer();
  } else {
    const jpg = await sharp(file).rotate().resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    if (jpg.length < before) {
      target = file.replace(/\.png$/i, '.jpg');
      renameSync(file, target);
      out = jpg;
      converted.push(file);
    }
  }

  if (!out || out.length >= before) { skipped++; totalAfter += before; continue; }

  try {
    writeAtomic(target, out);
  } catch (err) {
    console.warn(`[optimize-images] SKIP (locked/in use): ${target}`);
    skipped++;
    totalBefore += before;
    totalAfter += before;
    continue;
  }
  done++;
  totalBefore += before;
  totalAfter += out.length;
}

console.log(`[optimize-images] compressed ${done} file(s), skipped ${skipped}, ${(totalBefore / 1048576).toFixed(1)}MB -> ${(totalAfter / 1048576).toFixed(1)}MB (${Math.max(0, Math.round(100 - (totalAfter / Math.max(totalBefore, 1)) * 100))}% smaller)`);
if (converted.length) {
  console.log('[optimize-images] CONVERTED PNG -> JPG:');
  for (const f of converted) console.log('  ' + f);
}
